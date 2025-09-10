package com.project.inventory.service;

import com.project.inventory.entity.Role;
import com.project.inventory.entity.RoleEnum;
import com.project.inventory.entity.User;
import com.project.inventory.repository.RoleRepository;
import com.project.inventory.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Integer id) {
        return userRepository.findById(id);
    }

    public List<User> getUsersByRole(RoleEnum roleName) {
        return userRepository.findByRoleName(roleName);
    }

    public User createUser(String fullName, String email, String password,
                           String phone, RoleEnum roleEnum) {

        // Business Logic: Check if email already exists
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists");
        }

        // Business Logic: Validate role hierarchy
        validateRoleCreationPermission(roleEnum);

        // Get role entity
        Role role = roleRepository.findByName(roleEnum)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleEnum));

        // Create user
        User user = new User();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setPhone(phone);
        user.setRole(role);

        return userRepository.save(user);
    }

    public User updateUserRole(Integer userId, RoleEnum newRole) {
        // Business Logic: Only MANAGER can update roles
        if (!hasRole("MANAGER")) {
            throw new RuntimeException("Only MANAGER can update user roles");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Role role = roleRepository.findByName(newRole)
                .orElseThrow(() -> new RuntimeException("Role not found: " + newRole));

        user.setRole(role);
        return userRepository.save(user);
    }

    public void deleteUser(Integer userId) {
        // Business Logic: Only MANAGER can delete users
        if (!hasRole("MANAGER")) {
            throw new RuntimeException("Only MANAGER can delete users");
        }

        if (!userRepository.existsById(userId)) {
            throw new RuntimeException("User not found");
        }

        userRepository.deleteById(userId);
    }

    // Private helper methods for business logic
    private void validateRoleCreationPermission(RoleEnum roleToCreate) {
        if (roleToCreate == RoleEnum.ADMIN && !hasRole("MANAGER")) {
            throw new RuntimeException("Only MANAGER can create ADMIN users");
        }

        if (roleToCreate == RoleEnum.MANAGER && !hasRole("MANAGER")) {
            throw new RuntimeException("Only MANAGER can create other MANAGER users");
        }
    }

    private boolean hasRole(String role) {
        return SecurityContextHolder.getContext()
                .getAuthentication()
                .getAuthorities()
                .stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_" + role));
    }
}