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
}