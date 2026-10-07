package com.placement.portal.controller;

import com.placement.portal.dto.ApiResponse;
import com.placement.portal.dto.ApplicationDto;
import com.placement.portal.dto.StudentDashboardDto;
import com.placement.portal.dto.StudentProfileDto;
import com.placement.portal.security.UserPrincipal;
import com.placement.portal.service.ApplicationService;
import com.placement.portal.service.DashboardService;
import com.placement.portal.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/students")
public class StudentController {

    private final StudentService studentService;
    private final ApplicationService applicationService;
    private final DashboardService dashboardService;

    public StudentController(StudentService studentService,
                             ApplicationService applicationService,
                             DashboardService dashboardService) {
        this.studentService = studentService;
        this.applicationService = applicationService;
        this.dashboardService = dashboardService;
    }

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<StudentProfileDto>> getProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        StudentProfileDto profile = studentService.getProfile(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Profile fetched successfully", profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<StudentProfileDto>> updateProfile(@AuthenticationPrincipal UserPrincipal userPrincipal,
                                                                        @Valid @RequestBody StudentProfileDto dto) {
        StudentProfileDto updated = studentService.updateProfile(userPrincipal.getId(), dto);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", updated));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<StudentDashboardDto>> getDashboard(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        StudentDashboardDto dashboard = dashboardService.getStudentDashboard(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Dashboard data fetched successfully", dashboard));
    }

    @GetMapping("/applications")
    public ResponseEntity<ApiResponse<List<ApplicationDto>>> getApplications(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        List<ApplicationDto> applications = applicationService.getStudentApplications(userPrincipal.getId());
        return ResponseEntity.ok(ApiResponse.success("Applications fetched successfully", applications));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ROLE_OFFICER')")
    public ResponseEntity<ApiResponse<List<StudentProfileDto>>> getAllStudents() {
        List<StudentProfileDto> students = studentService.getAllStudents();
        return ResponseEntity.ok(ApiResponse.success("All students fetched successfully", students));
    }
}
