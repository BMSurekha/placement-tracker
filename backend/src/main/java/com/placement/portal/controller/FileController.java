package com.placement.portal.controller;

import com.placement.portal.dto.ApiResponse;
import com.placement.portal.entity.Student;
import com.placement.portal.exception.BadRequestException;
import com.placement.portal.exception.ResourceNotFoundException;
import com.placement.portal.repository.StudentRepository;
import com.placement.portal.security.UserPrincipal;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;

@RestController
@RequestMapping("/api")
public class FileController {

    private final Path uploadDir = Paths.get("uploads", "resumes").toAbsolutePath().normalize();
    private final StudentRepository studentRepository;

    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList("pdf", "jpg", "jpeg", "png");

    public FileController(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
        try {
            Files.createDirectories(uploadDir);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory for resumes", e);
        }
    }

    @PostMapping("/students/resume")
    public ResponseEntity<ApiResponse<String>> uploadResume(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam("file") MultipartFile file) {

        if (file == null || file.isEmpty()) {
            throw new BadRequestException("Please select a file to upload");
        }

        Student student = studentRepository.findByUserId(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        String originalFilename = StringUtils.cleanPath(file.getOriginalFilename() != null ? file.getOriginalFilename() : "resume.pdf");

        // Validate extension
        String extension = "";
        int dotIdx = originalFilename.lastIndexOf('.');
        if (dotIdx > 0) {
            extension = originalFilename.substring(dotIdx + 1).toLowerCase();
        }

        if (!ALLOWED_EXTENSIONS.contains(extension)) {
            throw new BadRequestException("Invalid file format. Only PDF, JPG, and PNG files are allowed.");
        }

        // Limit file size (10 MB max)
        if (file.getSize() > 10 * 1024 * 1024) {
            throw new BadRequestException("File size exceeds 10MB limit.");
        }

        try {
            String sanitizedStudentId = student.getStudentId().replaceAll("[^a-zA-Z0-9_-]", "_");
            String newFilename = "resume_" + sanitizedStudentId + "_" + System.currentTimeMillis() + "." + extension;

            Path targetLocation = uploadDir.resolve(newFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // Construct viewable URL path
            String fileUrl = "/api/files/resumes/" + newFilename;
            student.setResumeUrl(fileUrl);
            studentRepository.save(student);

            return ResponseEntity.ok(ApiResponse.success("Resume uploaded successfully!", fileUrl));
        } catch (IOException ex) {
            throw new RuntimeException("Failed to store file: " + ex.getMessage(), ex);
        }
    }

    @DeleteMapping("/students/resume")
    public ResponseEntity<ApiResponse<Void>> deleteResume(
            @AuthenticationPrincipal UserPrincipal userPrincipal) {

        Student student = studentRepository.findByUserId(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Student profile not found"));

        if (student.getResumeUrl() != null && !student.getResumeUrl().isBlank()) {
            String currentUrl = student.getResumeUrl();
            if (currentUrl.startsWith("/api/files/resumes/")) {
                String filename = currentUrl.substring("/api/files/resumes/".length());
                try {
                    Path filePath = uploadDir.resolve(filename).normalize();
                    Files.deleteIfExists(filePath);
                } catch (IOException ignored) {
                }
            }
            student.setResumeUrl(null);
            studentRepository.save(student);
        }

        return ResponseEntity.ok(ApiResponse.success("Resume removed successfully", null));
    }

    @GetMapping("/files/resumes/{filename:.+}")
    public ResponseEntity<Resource> viewResume(@PathVariable String filename) {
        try {
            Path filePath = uploadDir.resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                throw new ResourceNotFoundException("Resume file not found: " + filename);
            }

            // Determine content type based on extension
            String contentType = "application/octet-stream";
            String lower = filename.toLowerCase();
            if (lower.endsWith(".pdf")) {
                contentType = "application/pdf";
            } else if (lower.endsWith(".jpg") || lower.endsWith(".jpeg")) {
                contentType = "image/jpeg";
            } else if (lower.endsWith(".png")) {
                contentType = "image/png";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                    .header(HttpHeaders.CACHE_CONTROL, "no-cache, no-store, must-revalidate")
                    .body(resource);

        } catch (MalformedURLException ex) {
            throw new ResourceNotFoundException("Resume file path error: " + filename);
        }
    }
}
