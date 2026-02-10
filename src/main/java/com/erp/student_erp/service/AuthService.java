package com.erp.student_erp.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.erp.student_erp.entity.User;
import com.erp.student_erp.repository.UserRepository;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // ✅ REGISTER
    public void register(User user) {

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(user.getRole() == null ? "ROLE_STUDENT" : user.getRole());

        user.setEnabled(false);
        user.setEmailVerified(false);

        userRepository.save(user);
    }

    // ✅ SEND OTP
    public void sendOtp(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String otp = String.valueOf(new Random().nextInt(900000) + 100000);

        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));

        userRepository.save(user);

        System.out.println("OTP = " + otp); // replace with email service
    }

    // ✅ VERIFY OTP (FIXED)
    public void verifyOtp(String email, String otp) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getOtp() == null || !user.getOtp().equals(otp)) {
            throw new RuntimeException("Invalid OTP");
        }

        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP expired");
        }

        user.setEmailVerified(true);
        user.setEnabled(true);
        user.setOtp(null);
        user.setOtpExpiry(null);

        userRepository.save(user);
    }
}
