package com.erp.student_erp.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.erp.student_erp.entity.User;
import com.erp.student_erp.repository.UserRepository;
import com.erp.student_erp.security.JwtService;
import com.erp.student_erp.service.AuthService;
import com.erp.student_erp.userDTO.LoginRequest;
import com.erp.student_erp.userDTO.OtpRequest;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthService authService;

    // ✅ REGISTER
    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody User user) {
        authService.register(user);
        return ResponseEntity.ok("Registration successful. Verify OTP.");
    }

    // ✅ SEND OTP
    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestBody OtpRequest request) {
        authService.sendOtp(request.getEmail());
        return ResponseEntity.ok("OTP sent successfully");
    }

    // ✅ VERIFY OTP
    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(@RequestBody OtpRequest request) {
        authService.verifyOtp(request.getEmail(), request.getOtp());
        return ResponseEntity.ok("Email verified successfully");
    }

    // ✅ LOGIN (FIXED)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(401).body("Invalid email");
        }

        User user = optionalUser.get();

        if (!user.isEmailVerified()) {
            return ResponseEntity.status(403).body("Email not verified");
        }

        if (!user.isEnabled()) {
            return ResponseEntity.status(403).body("Account disabled");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(401).body("Invalid password");
        }

        String token = jwtService.generateToken(
                user.getEmail(),
                user.getRole());

        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        response.put("role", user.getRole());

        return ResponseEntity.ok(response);
    }
}
