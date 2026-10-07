package com.placement.portal.dto;

import java.util.ArrayList;
import java.util.List;

public class OfficerDashboardDto {

    private long totalStudentsCount;
    private long totalCompaniesCount;
    private long activeDrivesCount;
    private long totalApplicationsCount;
    private long shortlistedCount;
    private long selectedCount;

    private List<ApplicationDto> recentApplications = new ArrayList<>();
    private List<PlacementDriveDto> activeDrives = new ArrayList<>();

    public OfficerDashboardDto() {
    }

    public long getTotalStudentsCount() {
        return totalStudentsCount;
    }

    public void setTotalStudentsCount(long totalStudentsCount) {
        this.totalStudentsCount = totalStudentsCount;
    }

    public long getTotalCompaniesCount() {
        return totalCompaniesCount;
    }

    public void setTotalCompaniesCount(long totalCompaniesCount) {
        this.totalCompaniesCount = totalCompaniesCount;
    }

    public long getActiveDrivesCount() {
        return activeDrivesCount;
    }

    public void setActiveDrivesCount(long activeDrivesCount) {
        this.activeDrivesCount = activeDrivesCount;
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

    public List<PlacementDriveDto> getActiveDrives() {
        return activeDrives;
    }

    public void setActiveDrives(List<PlacementDriveDto> activeDrives) {
        this.activeDrives = activeDrives;
    }
}
