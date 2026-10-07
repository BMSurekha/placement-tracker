package com.placement.portal.service;

import com.placement.portal.dto.ApplicationDto;
import com.placement.portal.dto.ApplicationStatusUpdateDto;
import com.placement.portal.dto.ApplyRequestDto;
import com.placement.portal.dto.EligibilityCheckResultDto;
import com.placement.portal.entity.*;
import com.placement.portal.exception.BadRequestException;
import com.placement.portal.exception.DuplicateResourceException;
import com.placement.portal.exception.IneligibleStudentException;
import com.placement.portal.exception.ResourceNotFoundException;
import com.placement.portal.repository.ApplicationRepository;
import com.placement.portal.repository.PlacementDriveRepository;
import com.placement.portal.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final PlacementDriveRepository driveRepository;
    private final StudentRepository studentRepository;
    private final EligibilityService eligibilityService;

    public ApplicationService(ApplicationRepository applicationRepository,
                              PlacementDriveRepository driveRepository,
                              StudentRepository studentRepository,
                              EligibilityService eligibilityService) {
        this.applicationRepository = applicationRepository;
        this.driveRepository = driveRepository;
        this.studentRepository = studentRepository;
        this.eligibilityService = eligibilityService;
    }

    @Transactional
    public ApplicationDto applyToDrive(Long driveId, Long studentUserId, ApplyRequestDto request) {
        Student student = studentRepository.findByUserId(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for the logged in user"));

        PlacementDrive drive = driveRepository.findById(driveId)
                .orElseThrow(() -> new ResourceNotFoundException("Placement Drive not found with id: " + driveId));

        // 1. Check if drive is OPEN
        if (drive.getStatus() != DriveStatus.OPEN) {
            throw new BadRequestException("Applications are closed for this placement drive (Status: " + drive.getStatus() + ")");
        }

        // 2. Check if deadline has passed
        if (LocalDate.now().isAfter(drive.getApplicationDeadline())) {
            throw new BadRequestException("Application deadline of " + drive.getApplicationDeadline() + " has passed");
        }

        // 3. Check duplicate application
        if (applicationRepository.existsByStudentIdAndPlacementDriveId(student.getId(), drive.getId())) {
            throw new DuplicateResourceException("You have already submitted an application for this placement drive");
        }

        // 4. Authoritative backend eligibility check
        EligibilityCheckResultDto eligibilityResult = eligibilityService.checkEligibility(student, drive.getEligibilityCriteria());
        if (!eligibilityResult.isEligible()) {
            throw new IneligibleStudentException(
                    "You are not eligible for this placement drive.",
                    eligibilityResult.getReasons()
            );
        }

        // 5. Create application
        Application application = new Application();
        application.setStudent(student);
        application.setPlacementDrive(drive);
        application.setStatus(ApplicationStatus.APPLIED);
        if (request != null && request.getRemarks() != null) {
            application.setRemarks(request.getRemarks().trim());
        }

        Application saved = applicationRepository.save(application);
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public List<ApplicationDto> getStudentApplications(Long studentUserId) {
        Student student = studentRepository.findByUserId(studentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        return applicationRepository.findByStudentIdOrderByAppliedAtDesc(student.getId()).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ApplicationDto> getDriveApplications(Long driveId) {
        return applicationRepository.findByPlacementDriveIdOrderByAppliedAtDesc(driveId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ApplicationDto> getAllApplications() {
        return applicationRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApplicationDto updateApplicationStatus(Long applicationId, ApplicationStatusUpdateDto dto) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found with id: " + applicationId));

        application.setStatus(dto.getStatus());
        if (dto.getRemarks() != null && !dto.getRemarks().trim().isEmpty()) {
            application.setRemarks(dto.getRemarks().trim());
        }

        Application updated = applicationRepository.save(application);
        return mapToDto(updated);
    }

    public ApplicationDto mapToDto(Application app) {
        ApplicationDto dto = new ApplicationDto();
        dto.setId(app.getId());

        Student student = app.getStudent();
        dto.setStudentId(student.getId());
        dto.setRollNumber(student.getStudentId());
        dto.setStudentName(student.getFullName());
        dto.setStudentEmail(student.getUser().getEmail());
        dto.setStudentPhone(student.getPhone());
        dto.setStudentDepartment(student.getDepartment());
        dto.setStudentYear(student.getYear());
        dto.setStudentCgpa(student.getCgpa());
        dto.setStudentBacklogs(student.getBacklogs());
        dto.setStudentSkills(student.getSkills());
        dto.setResumeUrl(student.getResumeUrl());

        PlacementDrive drive = app.getPlacementDrive();
        dto.setDriveId(drive.getId());
        dto.setCompanyId(drive.getCompany().getId());
        dto.setCompanyName(drive.getCompany().getName());
        dto.setCompanyLogo(drive.getCompany().getLogo());
        dto.setJobRole(drive.getJobRole());
        dto.setCtc(drive.getCtc());
        dto.setLocation(drive.getLocation());

        dto.setAppliedAt(app.getAppliedAt());
        dto.setStatus(app.getStatus());
        dto.setRemarks(app.getRemarks());

        return dto;
    }
}
