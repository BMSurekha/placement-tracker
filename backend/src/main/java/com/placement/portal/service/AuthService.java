package com.placement.portal.service;

import com.placement.portal.dto.AuthResponse;
import com.placement.portal.dto.LoginRequest;
import com.placement.portal.dto.RegisterRequest;
import com.placement.portal.entity.Role;
import com.placement.portal.entity.Student;
import com.placement.portal.entity.User;
import com.placement.portal.exception.BadRequestException;
import com.placement.portal.exception.DuplicateResourceException;
import com.placement.portal.repository.StudentRepository;
import com.placement.portal.repository.UserRepository;
import com.placement.portal.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthService(AuthenticationManager authenticationManager,
                       UserRepository userRepository,
                       StudentRepository studentRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String token = tokenProvider.generateToken(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("User not found"));

        String studentId = null;
        String fullName = user.getEmail();

        if (user.getRole() == Role.ROLE_STUDENT) {
            Student student = studentRepository.findByUser(user).orElse(null);
            if (student != null) {
                studentId = student.getStudentId();
                fullName = student.getFullName();
            }
        } else {
            fullName = "Placement Officer";
        }

        return new AuthResponse(token, user.getId(), user.getEmail(), user.getRole().name(), studentId, fullName);
    }

    @Transactional
    public AuthResponse registerStudent(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email '" + request.getEmail() + "' is already registered");
        }

        if (studentRepository.existsByStudentId(request.getStudentId())) {
            throw new DuplicateResourceException("Student ID / Roll Number '" + request.getStudentId() + "' is already registered");
        }

        // Create User
        User user = new User();
        user.setEmail(request.getEmail().trim().toLowerCase());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.ROLE_STUDENT);
        User savedUser = userRepository.save(user);

        // Create Student Profile
        Student student = new Student();
        student.setUser(savedUser);
        student.setStudentId(request.getStudentId().trim().toUpperCase());
        student.setFullName(request.getFullName().trim());
        student.setPhone(request.getPhone());
        student.setDepartment(request.getDepartment().trim().toUpperCase());
        student.setYear(request.getYear());
        student.setCgpa(request.getCgpa());
        student.setBacklogs(request.getBacklogs() != null ? request.getBacklogs() : 0);
        student.setTenthPercentage(request.getTenthPercentage());
        student.setIntermediatePercentage(request.getIntermediatePercentage());
        student.setSkills(request.getSkills() != null ? request.getSkills().trim() : "");
        studentRepository.save(student);

        // Generate Token
        String token = tokenProvider.generateTokenFromUsername(savedUser.getEmail(), savedUser.getId(), savedUser.getRole().name());

        return new AuthResponse(token, savedUser.getId(), savedUser.getEmail(), savedUser.getRole().name(), student.getStudentId(), student.getFullName());
    }
}
