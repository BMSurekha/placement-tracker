package com.placement.portal.service;

import com.placement.portal.dto.EligibilityCheckResultDto;
import com.placement.portal.dto.EligibilityCheckResultDto.CriterionDetail;
import com.placement.portal.entity.EligibilityCriteria;
import com.placement.portal.entity.Student;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class EligibilityService {

    public EligibilityCheckResultDto checkEligibility(Student student, EligibilityCriteria criteria) {
        EligibilityCheckResultDto result = new EligibilityCheckResultDto();
        if (criteria == null) {
            result.setEligible(true);
            return result;
        }

        List<String> reasons = new ArrayList<>();
        List<CriterionDetail> details = new ArrayList<>();

        // 1. CGPA Check
        if (criteria.getMinimumCgpa() != null) {
            double actualCgpa = student.getCgpa() != null ? student.getCgpa() : 0.0;
            boolean passed = actualCgpa >= criteria.getMinimumCgpa();
            details.add(new CriterionDetail(
                    "Minimum CGPA",
                    ">= " + criteria.getMinimumCgpa(),
                    String.valueOf(actualCgpa),
                    passed
            ));
            if (!passed) {
                reasons.add("Required CGPA: " + criteria.getMinimumCgpa() + ", Your CGPA: " + actualCgpa);
            }
        }

        // 2. Maximum Backlogs Check
        if (criteria.getMaximumBacklogs() != null) {
            int actualBacklogs = student.getBacklogs() != null ? student.getBacklogs() : 0;
            boolean passed = actualBacklogs <= criteria.getMaximumBacklogs();
            details.add(new CriterionDetail(
                    "Maximum Backlogs",
                    "<= " + criteria.getMaximumBacklogs(),
                    String.valueOf(actualBacklogs),
                    passed
            ));
            if (!passed) {
                reasons.add("Maximum allowed backlogs: " + criteria.getMaximumBacklogs() + ", Your backlogs: " + actualBacklogs);
            }
        }

        // 3. Department Check
        if (criteria.getAllowedDepartments() != null && !criteria.getAllowedDepartments().trim().isEmpty()) {
            Set<String> allowedDepts = Arrays.stream(criteria.getAllowedDepartments().split(","))
                    .map(String::trim)
                    .map(String::toUpperCase)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toSet());

            String studentDept = student.getDepartment() != null ? student.getDepartment().trim().toUpperCase() : "";
            boolean passed = allowedDepts.contains(studentDept);
            details.add(new CriterionDetail(
                    "Allowed Departments",
                    String.join(", ", allowedDepts),
                    studentDept.isEmpty() ? "Not specified" : studentDept,
                    passed
            ));
            if (!passed) {
                reasons.add("Required department: " + String.join(" / ", allowedDepts) + ", Your department: " + (studentDept.isEmpty() ? "Not specified" : studentDept));
            }
        }

        // 4. Academic Year Check
        if (criteria.getAllowedYears() != null && !criteria.getAllowedYears().trim().isEmpty()) {
            Set<String> allowedYears = Arrays.stream(criteria.getAllowedYears().split(","))
                    .map(String::trim)
                    .map(s -> s.replaceAll("[^0-9]", ""))
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toSet());

            String studentYearStr = student.getYear() != null ? String.valueOf(student.getYear()) : "";
            boolean passed = allowedYears.contains(studentYearStr);
            details.add(new CriterionDetail(
                    "Eligible Academic Year",
                    String.join(", ", allowedYears) + " Year",
                    studentYearStr.isEmpty() ? "Not specified" : studentYearStr + " Year",
                    passed
            ));
            if (!passed) {
                reasons.add("Required year: " + String.join(" / ", allowedYears) + " Year, Your year: " + (studentYearStr.isEmpty() ? "Not specified" : studentYearStr + " Year"));
            }
        }

        // 5. 10th Percentage Check
        if (criteria.getMinimumTenthPercentage() != null) {
            double actualTenth = student.getTenthPercentage() != null ? student.getTenthPercentage() : 0.0;
            boolean passed = actualTenth >= criteria.getMinimumTenthPercentage();
            details.add(new CriterionDetail(
                    "10th Grade Percentage",
                    ">= " + criteria.getMinimumTenthPercentage() + "%",
                    actualTenth + "%",
                    passed
            ));
            if (!passed) {
                reasons.add("Required 10th percentage: " + criteria.getMinimumTenthPercentage() + "%, Your percentage: " + actualTenth + "%");
            }
        }

        // 6. Intermediate / Diploma Percentage Check
        if (criteria.getMinimumIntermediatePercentage() != null) {
            double actualInter = student.getIntermediatePercentage() != null ? student.getIntermediatePercentage() : 0.0;
            boolean passed = actualInter >= criteria.getMinimumIntermediatePercentage();
            details.add(new CriterionDetail(
                    "Intermediate/Diploma Percentage",
                    ">= " + criteria.getMinimumIntermediatePercentage() + "%",
                    actualInter + "%",
                    passed
            ));
            if (!passed) {
                reasons.add("Required Intermediate/Diploma percentage: " + criteria.getMinimumIntermediatePercentage() + "%, Your percentage: " + actualInter + "%");
            }
        }

        // 7. Required Skills Check
        if (criteria.getRequiredSkills() != null && !criteria.getRequiredSkills().trim().isEmpty()) {
            List<String> requiredSkillList = Arrays.stream(criteria.getRequiredSkills().split(","))
                    .map(String::trim)
                    .filter(s -> !s.isEmpty())
                    .toList();

            Set<String> studentSkillSet = student.getSkills() != null
                    ? Arrays.stream(student.getSkills().split(","))
                    .map(String::trim)
                    .map(String::toLowerCase)
                    .filter(s -> !s.isEmpty())
                    .collect(Collectors.toSet())
                    : Collections.emptySet();

            List<String> missingSkills = new ArrayList<>();
            for (String req : requiredSkillList) {
                if (!studentSkillSet.contains(req.toLowerCase())) {
                    missingSkills.add(req);
                }
            }

            boolean passed = missingSkills.isEmpty();
            details.add(new CriterionDetail(
                    "Required Skills",
                    String.join(", ", requiredSkillList),
                    student.getSkills() != null && !student.getSkills().trim().isEmpty() ? student.getSkills() : "None listed",
                    passed
            ));
            if (!passed) {
                reasons.add("Missing required skill(s): " + String.join(", ", missingSkills));
            }
        }

        result.setEligible(reasons.isEmpty());
        result.setReasons(reasons);
        result.setCriteriaDetails(details);
        return result;
    }
}
