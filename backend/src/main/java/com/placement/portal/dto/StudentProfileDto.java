package com.placement.portal.dto;

import jakarta.validation.constraints.*;

public class StudentProfileDto {

    private Long id;
    private Long userId;
    private String email;

    @NotBlank(message = "Student ID / Roll Number is required")
    private String studentId;

    @NotBlank(message = "Full Name is required")
    private String fullName;

    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be a valid 10-digit number")
    private String phone;

    @NotBlank(message = "Department is required")
    private String department;

    @NotNull(message = "Year is required")
    @Min(value = 1, message = "Year must be at least 1")
    @Max(value = 4, message = "Year cannot exceed 4")
    private Integer year;

    @NotNull(message = "CGPA is required")
    @DecimalMin(value = "0.0", message = "CGPA cannot be negative")
    @DecimalMax(value = "10.0", message = "CGPA cannot exceed 10.0")
    private Double cgpa;

    @Min(value = 0, message = "Backlogs cannot be negative")
    private Integer backlogs = 0;

    @DecimalMin(value = "0.0", message = "10th percentage must be at least 0")
    @DecimalMax(value = "100.0", message = "10th percentage cannot exceed 100")
    private Double tenthPercentage;

    @DecimalMin(value = "0.0", message = "Intermediate percentage must be at least 0")
    @DecimalMax(value = "100.0", message = "Intermediate percentage cannot exceed 100")
    private Double intermediatePercentage;

    private String skills;

    private String resumeUrl;

    public StudentProfileDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Double getCgpa() {
        return cgpa;
    }

    public void setCgpa(Double cgpa) {
        this.cgpa = cgpa;
    }

    public Integer getBacklogs() {
        return backlogs;
    }

    public void setBacklogs(Integer backlogs) {
        this.backlogs = backlogs;
    }

    public Double getTenthPercentage() {
        return tenthPercentage;
    }

    public void setTenthPercentage(Double tenthPercentage) {
        this.tenthPercentage = tenthPercentage;
    }

    public Double getIntermediatePercentage() {
        return intermediatePercentage;
    }

    public void setIntermediatePercentage(Double intermediatePercentage) {
        this.intermediatePercentage = intermediatePercentage;
    }

    public String getSkills() {
        return skills;
    }

    public void setSkills(String skills) {
        this.skills = skills;
    }

    public String getResumeUrl() {
        return resumeUrl;
    }

    public void setResumeUrl(String resumeUrl) {
        this.resumeUrl = resumeUrl;
    }
}
