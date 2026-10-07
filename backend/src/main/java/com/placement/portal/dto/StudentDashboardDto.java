package com.placement.portal.dto;

import java.util.ArrayList;
import java.util.List;

public class StudentDashboardDto {

    private String studentName;
    private String studentRollNo;
    private String department;
    private Double cgpa;

    private long availableDrivesCount;
    private long eligibleDrivesCount;
    private long totalApplicationsCount;
    private long shortlistedCount;
    private long selectedCount;

    private List<ApplicationDto> recentApplications = new ArrayList<>();
    private List<PlacementDriveDto> recommendedDrives = new ArrayList<>();

    public StudentDashboardDto() {
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentRollNo() {
        return studentRollNo;
    }

    public void setStudentRollNo(String studentRollNo) {
        this.studentRollNo = studentRollNo;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public Double getCgpa() {
        return cgpa;
    }

    public void setCgpa(Double cgpa) {
        this.cgpa = cgpa;
    }

    public long getAvailableDrivesCount() {
        return availableDrivesCount;
    }

    public void setAvailableDrivesCount(long availableDrivesCount) {
        this.availableDrivesCount = availableDrivesCount;
    }

    public long getEligibleDrivesCount() {
        return eligibleDrivesCount;
    }

    public void setEligibleDrivesCount(long eligibleDrivesCount) {
        this.eligibleDrivesCount = eligibleDrivesCount;
    }

    public long getTotalApplicationsCount() {
        return totalApplicationsCount;
    }

    public void setTotalApplicationsCount(long totalApplicationsCount) {
        this.totalApplicationsCount = totalApplicationsCount;
    }

    public long getShortlistedCount() {
        return shortlistedCount;
    }

    public void setShortlistedCount(long shortlistedCount) {
        this.shortlistedCount = shortlistedCount;
    }

    public long getSelectedCount() {
        return selectedCount;
    }

    public void setSelectedCount(long selectedCount) {
        this.selectedCount = selectedCount;
    }

    public List<ApplicationDto> getRecentApplications() {
        return recentApplications;
    }

    public void setRecentApplications(List<ApplicationDto> recentApplications) {
        this.recentApplications = recentApplications;
    }

    public List<PlacementDriveDto> getRecommendedDrives() {
        return recommendedDrives;
    }

    public void setRecommendedDrives(List<PlacementDriveDto> recommendedDrives) {
        this.recommendedDrives = recommendedDrives;
    }
}
