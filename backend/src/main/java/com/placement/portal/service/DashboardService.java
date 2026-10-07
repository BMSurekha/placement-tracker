package com.placement.portal.service;

import com.placement.portal.dto.ApplicationDto;
import com.placement.portal.dto.OfficerDashboardDto;
import com.placement.portal.dto.PlacementDriveDto;
import com.placement.portal.dto.StudentDashboardDto;
import com.placement.portal.entity.ApplicationStatus;
import com.placement.portal.entity.DriveStatus;
import com.placement.portal.entity.Student;
import com.placement.portal.exception.ResourceNotFoundException;
import com.placement.portal.repository.ApplicationRepository;
import com.placement.portal.repository.CompanyRepository;
import com.placement.portal.repository.PlacementDriveRepository;
import com.placement.portal.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final PlacementDriveRepository driveRepository;
    private final ApplicationRepository applicationRepository;
    private final PlacementDriveService driveService;
    private final ApplicationService applicationService;

    public DashboardService(StudentRepository studentRepository,
                            CompanyRepository companyRepository,
                            PlacementDriveRepository driveRepository,
                            ApplicationRepository applicationRepository,
                            PlacementDriveService driveService,
                            ApplicationService applicationService) {
        this.studentRepository = studentRepository;
        this.companyRepository = companyRepository;
        this.driveRepository = driveRepository;
        this.applicationRepository = applicationRepository;
        this.driveService = driveService;
        this.applicationService = applicationService;
    }

    @Transactional(readOnly = true)
    public StudentDashboardDto getStudentDashboard(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found for user ID: " + userId));

        StudentDashboardDto dto = new StudentDashboardDto();
        dto.setStudentName(student.getFullName());
        dto.setStudentRollNo(student.getStudentId());
        dto.setDepartment(student.getDepartment());
        dto.setCgpa(student.getCgpa());

        List<PlacementDriveDto> allDrives = driveService.getAllDrives(userId);

        long availableDrives = allDrives.stream()
                .filter(d -> d.getStatus() == DriveStatus.OPEN)
                .count();
        dto.setAvailableDrivesCount(availableDrives);

        long eligibleDrives = allDrives.stream()
                .filter(d -> Boolean.TRUE.equals(d.getIsEligible()))
                .count();
        dto.setEligibleDrivesCount(eligibleDrives);

        dto.setTotalApplicationsCount(applicationRepository.countByStudentId(student.getId()));
        dto.setShortlistedCount(applicationRepository.countByStudentIdAndStatus(student.getId(), ApplicationStatus.SHORTLISTED));
        dto.setSelectedCount(applicationRepository.countByStudentIdAndStatus(student.getId(), ApplicationStatus.SELECTED));

        // Recent applications (up to 5)
        List<ApplicationDto> studentApps = applicationService.getStudentApplications(userId);
        dto.setRecentApplications(studentApps.stream().limit(5).collect(Collectors.toList()));

        // Recommended drives: drives where student is eligible and has not applied yet
        List<PlacementDriveDto> recommended = allDrives.stream()
                .filter(d -> d.getStatus() == DriveStatus.OPEN && Boolean.TRUE.equals(d.getIsEligible()) && !Boolean.TRUE.equals(d.getHasApplied()))
                .limit(4)
                .collect(Collectors.toList());
        dto.setRecommendedDrives(recommended);

        return dto;
    }

    @Transactional(readOnly = true)
    public OfficerDashboardDto getOfficerDashboard() {
        OfficerDashboardDto dto = new OfficerDashboardDto();

        dto.setTotalStudentsCount(studentRepository.count());
        dto.setTotalCompaniesCount(companyRepository.count());
        dto.setActiveDrivesCount(driveRepository.countByStatus(DriveStatus.OPEN));
        dto.setTotalApplicationsCount(applicationRepository.count());
        dto.setShortlistedCount(applicationRepository.countByStatus(ApplicationStatus.SHORTLISTED));
        dto.setSelectedCount(applicationRepository.countByStatus(ApplicationStatus.SELECTED));

        // Recent applications (up to 8)
        List<ApplicationDto> allApps = applicationService.getAllApplications();
        dto.setRecentApplications(allApps.stream().sorted((a, b) -> b.getAppliedAt().compareTo(a.getAppliedAt())).limit(8).collect(Collectors.toList()));

        // Active drives (up to 6)
        List<PlacementDriveDto> allDrives = driveService.getAllDrives(null);
        dto.setActiveDrives(allDrives.stream().filter(d -> d.getStatus() == DriveStatus.OPEN).limit(6).collect(Collectors.toList()));

        return dto;
    }
}
