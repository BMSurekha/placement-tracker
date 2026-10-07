package com.placement.portal.service;

import com.placement.portal.dto.EligibilityCheckResultDto;
import com.placement.portal.dto.EligibilityCriteriaDto;
import com.placement.portal.dto.PlacementDriveCreateUpdateDto;
import com.placement.portal.dto.PlacementDriveDto;
import com.placement.portal.entity.*;
import com.placement.portal.exception.BadRequestException;
import com.placement.portal.exception.ResourceNotFoundException;
import com.placement.portal.repository.ApplicationRepository;
import com.placement.portal.repository.CompanyRepository;
import com.placement.portal.repository.PlacementDriveRepository;
import com.placement.portal.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PlacementDriveService {

    private final PlacementDriveRepository driveRepository;
    private final CompanyRepository companyRepository;
    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final EligibilityService eligibilityService;

    public PlacementDriveService(PlacementDriveRepository driveRepository,
                                 CompanyRepository companyRepository,
                                 ApplicationRepository applicationRepository,
                                 StudentRepository studentRepository,
                                 EligibilityService eligibilityService) {
        this.driveRepository = driveRepository;
        this.companyRepository = companyRepository;
        this.applicationRepository = applicationRepository;
        this.studentRepository = studentRepository;
        this.eligibilityService = eligibilityService;
    }

    @Transactional(readOnly = true)
    public List<PlacementDriveDto> getAllDrives(Long studentUserId) {
        Student currentStudent = null;
        if (studentUserId != null) {
            currentStudent = studentRepository.findByUserId(studentUserId).orElse(null);
        }

        final Student finalStudent = currentStudent;
        return driveRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(drive -> mapToDto(drive, finalStudent))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public PlacementDriveDto getDriveById(Long id, Long studentUserId) {
        PlacementDrive drive = driveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Placement Drive not found with id: " + id));

        Student currentStudent = null;
        if (studentUserId != null) {
            currentStudent = studentRepository.findByUserId(studentUserId).orElse(null);
        }

        return mapToDto(drive, currentStudent);
    }

    @Transactional
    public PlacementDriveDto createDrive(PlacementDriveCreateUpdateDto dto) {
        validateDriveDates(dto);

        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + dto.getCompanyId()));

        PlacementDrive drive = new PlacementDrive();
        drive.setCompany(company);
        drive.setJobRole(dto.getJobRole().trim());
        drive.setDescription(dto.getDescription());
        drive.setCtc(dto.getCtc());
        drive.setLocation(dto.getLocation());
        drive.setDriveDate(dto.getDriveDate());
        drive.setApplicationDeadline(dto.getApplicationDeadline());
        drive.setStatus(dto.getStatus() != null ? dto.getStatus() : DriveStatus.OPEN);

        if (dto.getEligibilityCriteria() != null) {
            EligibilityCriteria criteria = new EligibilityCriteria();
            copyCriteriaFields(dto.getEligibilityCriteria(), criteria);
            drive.setEligibilityCriteria(criteria);
        }

        PlacementDrive saved = driveRepository.save(drive);
        return mapToDto(saved, null);
    }

    @Transactional
    public PlacementDriveDto updateDrive(Long id, PlacementDriveCreateUpdateDto dto) {
        validateDriveDates(dto);

        PlacementDrive drive = driveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Placement Drive not found with id: " + id));

        Company company = companyRepository.findById(dto.getCompanyId())
                .orElseThrow(() -> new ResourceNotFoundException("Company not found with id: " + dto.getCompanyId()));

        drive.setCompany(company);
        drive.setJobRole(dto.getJobRole().trim());
        drive.setDescription(dto.getDescription());
        drive.setCtc(dto.getCtc());
        drive.setLocation(dto.getLocation());
        drive.setDriveDate(dto.getDriveDate());
        drive.setApplicationDeadline(dto.getApplicationDeadline());
        if (dto.getStatus() != null) {
            drive.setStatus(dto.getStatus());
        }

        if (dto.getEligibilityCriteria() != null) {
            EligibilityCriteria criteria = drive.getEligibilityCriteria();
            if (criteria == null) {
                criteria = new EligibilityCriteria();
            }
            copyCriteriaFields(dto.getEligibilityCriteria(), criteria);
            drive.setEligibilityCriteria(criteria);
        }

        PlacementDrive updated = driveRepository.save(drive);
        return mapToDto(updated, null);
    }

    @Transactional
    public void deleteDrive(Long id) {
        PlacementDrive drive = driveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Placement Drive not found with id: " + id));

        long applicantCount = applicationRepository.countByPlacementDriveId(id);
        if (applicantCount > 0) {
            // If applicants exist, close the drive safely rather than corrupting applicant history
            drive.setStatus(DriveStatus.CLOSED);
            driveRepository.save(drive);
        } else {
            driveRepository.delete(drive);
        }
    }

    @Transactional
    public PlacementDriveDto updateStatus(Long id, DriveStatus status) {
        PlacementDrive drive = driveRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Placement Drive not found with id: " + id));
        drive.setStatus(status);
        PlacementDrive updated = driveRepository.save(drive);
        return mapToDto(updated, null);
    }

    private void validateDriveDates(PlacementDriveCreateUpdateDto dto) {
        if (dto.getApplicationDeadline().isAfter(dto.getDriveDate())) {
            throw new BadRequestException("Application deadline (" + dto.getApplicationDeadline() + ") must not be after the drive date (" + dto.getDriveDate() + ")");
        }
    }

    private void copyCriteriaFields(EligibilityCriteriaDto src, EligibilityCriteria dest) {
        dest.setMinimumCgpa(src.getMinimumCgpa());
        dest.setMaximumBacklogs(src.getMaximumBacklogs());
        dest.setAllowedDepartments(src.getAllowedDepartments() != null ? src.getAllowedDepartments().trim().toUpperCase() : null);
        dest.setAllowedYears(src.getAllowedYears() != null ? src.getAllowedYears().trim() : null);
        dest.setMinimumTenthPercentage(src.getMinimumTenthPercentage());
        dest.setMinimumIntermediatePercentage(src.getMinimumIntermediatePercentage());
        dest.setRequiredSkills(src.getRequiredSkills() != null ? src.getRequiredSkills().trim() : null);
    }

    public PlacementDriveDto mapToDto(PlacementDrive drive, Student currentStudent) {
        PlacementDriveDto dto = new PlacementDriveDto();
        dto.setId(drive.getId());
        dto.setCompanyId(drive.getCompany().getId());
        dto.setCompanyName(drive.getCompany().getName());
        dto.setCompanyLogo(drive.getCompany().getLogo());
        dto.setCompanyIndustry(drive.getCompany().getIndustry());
        dto.setCompanyLocation(drive.getCompany().getLocation());
        dto.setCompanyWebsite(drive.getCompany().getWebsite());

        dto.setJobRole(drive.getJobRole());
        dto.setDescription(drive.getDescription());
        dto.setCtc(drive.getCtc());
        dto.setLocation(drive.getLocation());
        dto.setDriveDate(drive.getDriveDate());
        dto.setApplicationDeadline(drive.getApplicationDeadline());
        dto.setStatus(drive.getStatus());
        dto.setCreatedAt(drive.getCreatedAt());

        long totalApplicants = applicationRepository.countByPlacementDriveId(drive.getId());
        dto.setTotalApplicants(totalApplicants);

        if (drive.getEligibilityCriteria() != null) {
            EligibilityCriteria ec = drive.getEligibilityCriteria();
            EligibilityCriteriaDto ecDto = new EligibilityCriteriaDto();
            ecDto.setMinimumCgpa(ec.getMinimumCgpa());
            ecDto.setMaximumBacklogs(ec.getMaximumBacklogs());
            ecDto.setAllowedDepartments(ec.getAllowedDepartments());
            ecDto.setAllowedYears(ec.getAllowedYears());
            ecDto.setMinimumTenthPercentage(ec.getMinimumTenthPercentage());
            ecDto.setMinimumIntermediatePercentage(ec.getMinimumIntermediatePercentage());
            ecDto.setRequiredSkills(ec.getRequiredSkills());
            dto.setEligibilityCriteria(ecDto);
        }

        // Student-specific context
        if (currentStudent != null) {
            EligibilityCheckResultDto eligibilityResult = eligibilityService.checkEligibility(currentStudent, drive.getEligibilityCriteria());
            dto.setIsEligible(eligibilityResult.isEligible());
            dto.setEligibilityReasons(eligibilityResult.getReasons());

            Optional<Application> appOpt = applicationRepository.findByStudentIdAndPlacementDriveId(currentStudent.getId(), drive.getId());
            if (appOpt.isPresent()) {
                dto.setHasApplied(true);
                dto.setApplicationStatus(appOpt.get().getStatus());
                dto.setApplicationId(appOpt.get().getId());
            } else {
                dto.setHasApplied(false);
            }
        }

        return dto;
    }
}
