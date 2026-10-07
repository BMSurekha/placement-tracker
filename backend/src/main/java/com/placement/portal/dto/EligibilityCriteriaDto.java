package com.placement.portal.dto;

import jakarta.validation.constraints.*;

public class EligibilityCriteriaDto {

    @DecimalMin(value = "0.0", message = "Minimum CGPA cannot be negative")
    @DecimalMax(value = "10.0", message = "Minimum CGPA cannot exceed 10.0")
    private Double minimumCgpa;

    @Min(value = 0, message = "Maximum backlogs cannot be negative")
    private Integer maximumBacklogs;

    private String allowedDepartments; // e.g. "CSE,IT,ECE"

    private String allowedYears; // e.g. "3,4"

    @DecimalMin(value = "0.0", message = "Minimum 10th percentage must be at least 0")
    @DecimalMax(value = "100.0", message = "Minimum 10th percentage cannot exceed 100")
    private Double minimumTenthPercentage;

    @DecimalMin(value = "0.0", message = "Minimum Intermediate percentage must be at least 0")
    @DecimalMax(value = "100.0", message = "Minimum Intermediate percentage cannot exceed 100")
    private Double minimumIntermediatePercentage;

    private String requiredSkills; // e.g. "Java,SQL"

    public EligibilityCriteriaDto() {
    }

    public Double getMinimumCgpa() {
        return minimumCgpa;
    }

    public void setMinimumCgpa(Double minimumCgpa) {
        this.minimumCgpa = minimumCgpa;
    }

    public Integer getMaximumBacklogs() {
        return maximumBacklogs;
    }

    public void setMaximumBacklogs(Integer maximumBacklogs) {
        this.maximumBacklogs = maximumBacklogs;
    }

    public String getAllowedDepartments() {
        return allowedDepartments;
    }

    public void setAllowedDepartments(String allowedDepartments) {
        this.allowedDepartments = allowedDepartments;
    }

    public String getAllowedYears() {
        return allowedYears;
    }

    public void setAllowedYears(String allowedYears) {
        this.allowedYears = allowedYears;
    }

    public Double getMinimumTenthPercentage() {
        return minimumTenthPercentage;
    }

    public void setMinimumTenthPercentage(Double minimumTenthPercentage) {
        this.minimumTenthPercentage = minimumTenthPercentage;
    }

    public Double getMinimumIntermediatePercentage() {
        return minimumIntermediatePercentage;
    }

    public void setMinimumIntermediatePercentage(Double minimumIntermediatePercentage) {
        this.minimumIntermediatePercentage = minimumIntermediatePercentage;
    }

    public String getRequiredSkills() {
        return requiredSkills;
    }

    public void setRequiredSkills(String requiredSkills) {
        this.requiredSkills = requiredSkills;
    }
}
