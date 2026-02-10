package com.erp.student_erp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import com.erp.student_erp.entity.User;
import com.erp.student_erp.repository.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

        @Autowired
        private UserRepository userRepository;

        @Override
        public UserDetails loadUserByUsername(String email)
                        throws UsernameNotFoundException {

                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

                return org.springframework.security.core.userdetails.User
                                .withUsername(user.getEmail())
                                .password(user.getPassword())
                                .authorities(user.getRole())
                                .disabled(!user.isEnabled())
                                .build();
        }
}
