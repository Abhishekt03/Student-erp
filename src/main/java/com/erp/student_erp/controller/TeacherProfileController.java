package com.erp.student_erp.controller;

import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.erp.student_erp.entity.User;
import com.erp.student_erp.repository.UserRepository;

@RestController
@RequestMapping("/api/teacher/profile")
@PreAuthorize("hasAuthority('ROLE_TEACHER')")
public class TeacherProfileController {

    private final UserRepository userRepository;

    public TeacherProfileController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<?> profile(Authentication auth) {

        if (auth == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());
        response.put("dob", user.getDob());
        response.put("phone", user.getPhone());
        response.put("address", user.getAddress());

        return ResponseEntity.ok(response);
    }

    @GetMapping("/photo")
    public ResponseEntity<byte[]> getPhoto(Authentication auth) throws IOException {

        if (auth == null) {
            return ResponseEntity.status(401).build();
        }

        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        byte[] photo = user.getPhoto();

        if (photo == null) {
            InputStream is = getClass()
                    .getResourceAsStream("/static/images/default.png");
            photo = is.readAllBytes();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_PNG)
                .body(photo);
    }

    @PostMapping("/photo")
    public ResponseEntity<?> uploadPhoto(
            @RequestParam("photo") MultipartFile file,
            Authentication auth) throws IOException {

        if (auth == null) {
            return ResponseEntity.status(401).body("Unauthorized");
        }

        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setPhoto(file.getBytes());
        userRepository.save(user);

        return ResponseEntity.ok("Photo updated successfully");
    }
}
