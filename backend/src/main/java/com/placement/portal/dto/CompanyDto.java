package com.placement.portal.dto;

import java.time.LocalDateTime;

public class CompanyDto {
    private Long id;
    private String name;
    private String logo;
    private String industry;
    private String description;
    private String website;
    private String location;
    private LocalDateTime createdAt;
    private long activeDrivesCount;

    public CompanyDto() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public long getActiveDrivesCount() {
        return activeDrivesCount;
    }

    public void setActiveDrivesCount(long activeDrivesCount) {
        this.activeDrivesCount = activeDrivesCount;
    }
}
