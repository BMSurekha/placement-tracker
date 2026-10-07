package com.placement.portal.dto;

public class ApplyRequestDto {
    private String remarks;

    public ApplyRequestDto() {
    }

    public ApplyRequestDto(String remarks) {
        this.remarks = remarks;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }
}
