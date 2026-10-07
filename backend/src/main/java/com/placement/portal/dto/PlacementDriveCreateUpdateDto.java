package com.placement.portal.dto;

import com.placement.portal.entity.DriveStatus;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;

import java.time.LocalDate;

public class PlacementDriveCreateUpdateDto {

    @NotNull(message = "Company ID is required")
    private Long companyId;

    @NotBlank(message = "Job Role is required")
    private String jobRole;

    private String description;

    @NotNull(message = "CTC is required")
    @DecimalMin(value = "0.0", message = "CTC cannot be negative")
    private Double ctc;

    private String location;

    @NotNull(message = "Drive Date is required")
    private LocalDate driveDate;

    @NotNull(message = "Application Deadline is required")
    private LocalDate applicationDeadline;

    private DriveStatus status = DriveStatus.OPEN;

    @Valid
    private EligibilityCriteriaDto eligibilityCriteria;

    public PlacementDriveCreateUpdateDto() {
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getJobRole() {
        return jobRole;
    }

    public void setJobRole(String jobRole) {
        this.jobRole = jobRole;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Double getCtc() {
        return ctc;
    }

    public void setCtc(Double ctc) {
        this.ctc = ctc;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDate getDriveDate() {
        return driveDate;
    }

    public void setDriveDate(LocalDate driveDate) {
        this.driveDate = driveDate;
    }

    public LocalDate getApplicationDeadline() {
        return applicationDeadline;
    }

    public void setApplicationDeadline(LocalDate applicationDeadline) {
        this.applicationDeadline = applicationDeadline;
    }

    public DriveStatus getStatus() {
        return status;
    }

    public void setStatus(DriveStatus status) {
        this.status = status;
    }

    public EligibilityCriteriaDto getEligibilityCriteria() {
        return eligibilityCriteria;
    }

    public void setEligibilityCriteria(EligibilityCriteriaDto eligibilityCriteria) {
        this.eligibilityCriteria = eligibilityCriteria;
    }
}
