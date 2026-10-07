package com.placement.portal.dto;

import java.util.ArrayList;
import java.util.List;

public class EligibilityCheckResultDto {

    private boolean eligible;
    private List<String> reasons = new ArrayList<>();
    private List<CriterionDetail> criteriaDetails = new ArrayList<>();

    public EligibilityCheckResultDto() {
    }

    public EligibilityCheckResultDto(boolean eligible, List<String> reasons) {
        this.eligible = eligible;
        this.reasons = reasons;
    }

    public boolean isEligible() {
        return eligible;
    }

    public void setEligible(boolean eligible) {
        this.eligible = eligible;
    }

    public List<String> getReasons() {
        return reasons;
    }

    public void setReasons(List<String> reasons) {
        this.reasons = reasons;
    }

    public List<CriterionDetail> getCriteriaDetails() {
        return criteriaDetails;
    }

    public void setCriteriaDetails(List<CriterionDetail> criteriaDetails) {
        this.criteriaDetails = criteriaDetails;
    }

    public static class CriterionDetail {
        private String name;
        private String required;
        private String actual;
        private boolean passed;

        public CriterionDetail() {
        }

        public CriterionDetail(String name, String required, String actual, boolean passed) {
            this.name = name;
            this.required = required;
            this.actual = actual;
            this.passed = passed;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getRequired() {
            return required;
        }

        public void setRequired(String required) {
            this.required = required;
        }

        public String getActual() {
            return actual;
        }

        public void setActual(String actual) {
            this.actual = actual;
        }

        public boolean isPassed() {
            return passed;
        }

        public void setPassed(boolean passed) {
            this.passed = passed;
        }
    }
}
