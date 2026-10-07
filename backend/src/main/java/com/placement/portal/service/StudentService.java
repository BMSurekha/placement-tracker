package com.placement.portal.service;

import com.placement.portal.dto.StudentProfileDto;
import com.placement.portal.entity.Student;
import com.placement.portal.exception.DuplicateResourceException;
import com.placement.portal.exception.ResourceNotFoundException;
import com.placement.portal.repository.StudentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    @Transactional(readOnly = true)
    public StudentProfileDto getProfile(Long userId) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user ID: " + userId));
        return mapToDto(student);
    }

    @Transactional
    public StudentProfileDto updateProfile(Long userId, StudentProfileDto dto) {
        Student student = studentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found for user ID: " + userId));

        // If roll number changed, verify uniqueness
        if (!student.getStudentId().equalsIgnoreCase(dto.getStudentId().trim())
                && studentRepository.existsByStudentId(dto.getStudentId().trim())) {
            throw new DuplicateResourceException("Student ID / Roll Number '" + dto.getStudentId() + "' is already in use");
        }

        student.setStudentId(dto.getStudentId().trim().toUpperCase());
        student.setFullName(dto.getFullName().trim());
        student.setPhone(dto.getPhone());
        student.setDepartment(dto.getDepartment().trim().toUpperCase());
        student.setYear(dto.getYear());
        student.setCgpa(dto.getCgpa());
        student.setBacklogs(dto.getBacklogs() != null ? dto.getBacklogs() : 0);
        student.setTenthPercentage(dto.getTenthPercentage());
        student.setIntermediatePercentage(dto.getIntermediatePercentage());
        student.setSkills(dto.getSkills() != null ? dto.getSkills().trim() : "");
        student.setResumeUrl(dto.getResumeUrl() != null ? dto.getResumeUrl().trim() : null);

        Student updated = studentRepository.save(student);
        return mapToDto(updated);
    }

    @Transactional(readOnly = true)
    public List<StudentProfileDto> getAllStudents() {
        return studentRepository.findAll().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    public StudentProfileDto mapToDto(Student student) {
        StudentProfileDto dto = new StudentProfileDto();
        dto.setId(student.getId());
        dto.setUserId(student.getUser().getId());
        dto.setEmail(student.getUser().getEmail());
        dto.setStudentId(student.getStudentId());
        dto.setFullName(student.getFullName());
        dto.setPhone(student.getPhone());
        dto.setDepartment(student.getDepartment());
        dto.setYear(student.getYear());
        dto.setCgpa(student.getCgpa());
        dto.setBacklogs(student.getBacklogs());
        dto.setTenthPercentage(student.getTenthPercentage());
        dto.setIntermediatePercentage(student.getIntermediatePercentage());
        dto.setSkills(student.getSkills());
        dto.setResumeUrl(student.getResumeUrl());
        return dto;
    }
}
