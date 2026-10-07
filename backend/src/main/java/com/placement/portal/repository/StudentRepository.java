package com.placement.portal.repository;

import com.placement.portal.entity.Student;
import com.placement.portal.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUser(User user);
    Optional<Student> findByUserId(Long userId);
    Optional<Student> findByStudentId(String studentId);
    boolean existsByStudentId(String studentId);
}
