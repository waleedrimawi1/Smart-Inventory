package com.project.inventory.controller;

import com.project.inventory.entity.Role;
import com.project.inventory.entity.RoleEnum;
import com.project.inventory.entity.User;
import com.project.inventory.repository.RoleRepository;
import com.project.inventory.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RequestMapping("/api/auth")
@RestController
public class AuthController {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            String email = request.get("email");
            String password = request.get("password");

            Optional<User> userOpt = userRepository.findByEmail(email);
            if (userOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("User not found");
            }

            User user = userOpt.get();
            if (!passwordEncoder.matches(password, user.getPassword())) {
                return ResponseEntity.badRequest().body("Invalid password");
            }

            return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "user", Map.of(
                    "id", user.getId(),
                    "fullName", user.getFullName(),
                    "email", user.getEmail(),
                    "role", user.getRole().getName().toString()
                )
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Login failed: " + e.getMessage());
        }
    }
}