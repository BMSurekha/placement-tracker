package com.placement.portal.controller;

import com.placement.portal.dto.*;
import com.placement.portal.entity.DriveStatus;
import com.placement.portal.entity.Role;
import com.placement.portal.entity.Student;
import com.placement.portal.repository.StudentRepository;
import com.placement.portal.security.UserPrincipal;
import com.placement.portal.service.ApplicationService;
import com.placement.portal.service.EligibilityService;
import com.placement.portal.service.PlacementDriveService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/drives")
public class PlacementDriveController {

    private final PlacementDriveService driveService;
    private final ApplicationService applicationService;
    private final EligibilityService eligibilityService;
    private final StudentRepository studentRepository;

    public PlacementDriveController(PlacementDriveService driveService,
                                    ApplicationService applicationService,
                                    EligibilityService eligibilityService,
                                    StudentRepository studentRepository) {
        this.driveService = driveService;
        this.applicationService = applicationService;
        this.eligibilityService = eligibilityService;
        this.studentRepository = studentRepository;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<PlacementDriveDto>>> getAllDrives(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long studentUserId = null;
        if (userPrincipal != null && userPrincipal.getRole() == Role.ROLE_STUDENT) {
            studentUserId = userPrincipal.getId();
        }
        List<PlacementDriveDto> drives = driveService.getAllDrives(studentUserId);
        return ResponseEntity.ok(ApiResponse.success("Placement drives retrieved successfully", drives));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PlacementDriveDto>> getDriveById(@PathVariable Long id,
                                                                       @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long studentUserId = null;
        if (userPrincipal != null && userPrincipal.getRole() == Role.ROLE_STUDENT) {
            studentUserId = userPrincipal.getId();
        }
        PlacementDriveDto drive = driveService.getDriveById(id, studentUserId);
        return ResponseEntity.ok(ApiResponse.success("Placement drive retrieved successfully", drive));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_OFFICER')")
    public ResponseEntity<ApiResponse<PlacementDriveDto>> createDrive(@Valid @RequestBody PlacementDriveCreateUpdateDto dto) {
        PlacementDriveDto created = driveService.createDrive(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Placement drive created successfully", created));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_OFFICER')")
    public ResponseEntity<ApiResponse<PlacementDriveDto>> updateDrive(@PathVariable Long id,
                                                                      @Valid @RequestBody PlacementDriveCreateUpdateDto dto) {
        PlacementDriveDto updated = driveService.updateDrive(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Placement drive updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_OFFICER')")
    public ResponseEntity<ApiResponse<Void>> deleteDrive(@PathVariable Long id) {
        driveService.deleteDrive(id);
        return ResponseEntity.ok(ApiResponse.success("Placement drive deleted or closed successfully"));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_OFFICER')")
    public ResponseEntity<ApiResponse<PlacementDriveDto>> updateStatus(@PathVariable Long id,
                                                                       @RequestParam DriveStatus status) {
        PlacementDriveDto updated = driveService.updateStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Placement drive status updated to " + status, updated));
    }

    @GetMapping("/{id}/eligibility")
    public ResponseEntity<ApiResponse<EligibilityCheckResultDto>> checkEligibility(@PathVariable Long id,
                                                                                   @AuthenticationPrincipal UserPrincipal userPrincipal) {
        PlacementDriveDto drive = driveService.getDriveById(id, userPrincipal.getId());
        Student student = studentRepository.findByUserId(userPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Student profile not found"));

        EligibilityCheckResultDto result = new EligibilityCheckResultDto(
                Boolean.TRUE.equals(drive.getIsEligible()),
                drive.getEligibilityReasons()
        );
        return ResponseEntity.ok(ApiResponse.success("Eligibility checked", result));
    }

    @PostMapping("/{id}/apply")
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    public ResponseEntity<ApiResponse<ApplicationDto>> applyToDrive(@PathVariable Long id,
                                                                    @AuthenticationPrincipal UserPrincipal userPrincipal,
                                                                    @RequestBody(required = false) ApplyRequestDto request) {
        ApplicationDto application = applicationService.applyToDrive(id, userPrincipal.getId(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success("Application submitted successfully!", application));
    }

    @GetMapping("/{id}/applications")
    @PreAuthorize("hasAuthority('ROLE_OFFICER')")
    public ResponseEntity<ApiResponse<List<ApplicationDto>>> getApplicants(@PathVariable Long id) {
        List<ApplicationDto> applicants = applicationService.getDriveApplications(id);
        return ResponseEntity.ok(ApiResponse.success("Drive applicants retrieved successfully", applicants));
    }
}
