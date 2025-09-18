package com.project.inventory.services;

import com.project.inventory.entity.User;
import com.project.inventory.repository.RoleRepository;
import com.project.inventory.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }


    public Map<String, Object> login(Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");

            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                return Map.of("message", "User not found");
            }

            User user = userOpt.get();
            if (!passwordEncoder.matches(password, user.getPassword())) {
                return Map.of("message", "Invalid password");
            }

            return Map.of(
                    "message", "Login successful",
                    "user", Map.of(
                            "id", user.getId(),
                            "fullName", user.getFullName(),
                            "email", user.getEmail(),
                            "role", user.getRole().getName().toString()
                    )
            );
        } catch (Exception e) {
            return Map.of("message", "Login failed: " + e.getMessage());
        }
    }

    public boolean isEmailTaken(String email) {
        return userRepository.existsByEmail(email);
    }
}
