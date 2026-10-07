package com.placement.portal.controller;

import com.placement.portal.dto.ApiResponse;
import com.placement.portal.dto.ApplicationDto;
import com.placement.portal.dto.ApplicationStatusUpdateDto;
import com.placement.portal.service.ApplicationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAuthority('ROLE_OFFICER')")
    public ResponseEntity<ApiResponse<ApplicationDto>> updateApplicationStatus(@PathVariable Long id,
                                                                               @Valid @RequestBody ApplicationStatusUpdateDto dto) {
        ApplicationDto updated = applicationService.updateApplicationStatus(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Application status updated successfully", updated));
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('ROLE_OFFICER')")
    public ResponseEntity<ApiResponse<List<ApplicationDto>>> getAllApplications() {
        List<ApplicationDto> all = applicationService.getAllApplications();
        return ResponseEntity.ok(ApiResponse.success("All applications retrieved successfully", all));
    }
}
