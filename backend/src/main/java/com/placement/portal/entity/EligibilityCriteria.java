package com.placement.portal.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "eligibility_criteria")
public class EligibilityCriteria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "placement_drive_id", unique = true, nullable = false)
    @JsonBackReference
    private PlacementDrive placementDrive;

    @Column(name = "minimum_cgpa")
    private Double minimumCgpa;

    @Column(name = "maximum_backlogs")
    private Integer maximumBacklogs;

    @Column(name = "allowed_departments", length = 500)
    private String allowedDepartments; // Comma separated e.g. "CSE,IT,ECE"

    @Column(name = "allowed_years", length = 50)
    private String allowedYears; // Comma separated e.g. "3,4"

    @Column(name = "minimum_tenth_percentage")
    private Double minimumTenthPercentage;

    @Column(name = "minimum_intermediate_percentage")
    private Double minimumIntermediatePercentage;

    @Column(name = "required_skills", length = 500)
    private String requiredSkills; // Comma separated e.g. "Java,SQL"

    public EligibilityCriteria() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public PlacementDrive getPlacementDrive() {
        return placementDrive;
    }

    public void setPlacementDrive(PlacementDrive placementDrive) {
        this.placementDrive = placementDrive;
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
