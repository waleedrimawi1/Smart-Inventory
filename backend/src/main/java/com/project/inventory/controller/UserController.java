package com.project.inventory.controller;

import com.project.inventory.entity.Role;
import com.project.inventory.entity.RoleEnum;
import com.project.inventory.entity.User;
import com.project.inventory.repository.RoleRepository;
import com.project.inventory.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RequestMapping("/api/users")
@RestController
public class UserController {
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserController(
            UserRepository userRepository,
            RoleRepository roleRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<?> getUserById(@PathVariable Integer id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(userOpt.get());
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<?> createUser(@RequestBody Map<String, String> request) {
        try {
            String fullName = request.get("fullName");
            String email = request.get("email");
            String password = request.get("password");
            String phone = request.get("phone");
            String roleName = request.get("role");

            // Check if user already exists
            if (userRepository.existsByEmail(email)) {
                return ResponseEntity.badRequest().body("Email already exists");
            }

            // Get role
            RoleEnum roleEnum = RoleEnum.valueOf(roleName.toUpperCase());
            
            // Role hierarchy check: Only MANAGER can create ADMIN users
            if (roleEnum == RoleEnum.ADMIN && !hasRole("MANAGER")) {
                return ResponseEntity.badRequest().body("Only MANAGER can create ADMIN users");
            }
            
            // Only MANAGER can create other MANAGER users
            if (roleEnum == RoleEnum.MANAGER && !hasRole("MANAGER")) {
                return ResponseEntity.badRequest().body("Only MANAGER can create other MANAGER users");
            }

            Optional<Role> roleOpt = roleRepository.findByName(roleEnum);
            if (roleOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Role not found");
            }

            // Create new user
            User user = new User();
            user.setFullName(fullName);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setPhone(phone);
            user.setRole(roleOpt.get());

            User savedUser = userRepository.save(user);
            
            return ResponseEntity.ok(Map.of(
                "message", "User created successfully",
                "userId", savedUser.getId()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("User creation failed: " + e.getMessage());
        }
    }

    private boolean hasRole(String role) {
        return org.springframework.security.core.context.SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getAuthorities()
                .stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_" + role));
    }

    @GetMapping("/role/{roleName}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable String roleName) {
        try {
            RoleEnum roleEnum = RoleEnum.valueOf(roleName.toUpperCase());
            List<User> users = userRepository.findByRoleName(roleEnum);
            return ResponseEntity.ok(users);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> updateUserRole(@PathVariable Integer id, @RequestBody Map<String, String> request) {
        try {
            Optional<User> userOpt = userRepository.findById(id);
            if (userOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            String roleName = request.get("role");
            RoleEnum roleEnum = RoleEnum.valueOf(roleName.toUpperCase());
            
            // Only MANAGER can change roles (highest authority)
            Optional<Role> roleOpt = roleRepository.findByName(roleEnum);
            if (roleOpt.isEmpty()) {
                return ResponseEntity.badRequest().body("Role not found");
            }

            User user = userOpt.get();
            user.setRole(roleOpt.get());
            userRepository.save(user);

            return ResponseEntity.ok(Map.of("message", "User role updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Role update failed: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> deleteUser(@PathVariable Integer id) {
        try {
            if (!userRepository.existsById(id)) {
                return ResponseEntity.notFound().build();
            }

            // Only MANAGER can delete users (highest authority)
            userRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("User deletion failed: " + e.getMessage());
        }
    }
}

