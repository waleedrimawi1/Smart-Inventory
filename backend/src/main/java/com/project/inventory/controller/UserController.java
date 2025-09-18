package com.project.inventory.controller;

import com.project.inventory.entity.RoleEnum;
import com.project.inventory.entity.User;
import com.project.inventory.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequestMapping("/api/users")
@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class UserController {
    final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }
    @GetMapping
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
    
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        return userService.getUserById(id)
                .map(user -> ResponseEntity.ok(user))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/role/{roleName}")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<List<User>> getUsersByRole(@PathVariable String roleName) {
        try {
            RoleEnum roleEnum = RoleEnum.valueOf(roleName.toUpperCase());
            List<User> users = userService.getUsersByRole(roleEnum);
            return ResponseEntity.ok(users);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PostMapping("/create")
    @PreAuthorize("hasRole('MANAGER') or hasRole('ADMIN')")
    public ResponseEntity<?> createUser(@RequestBody Map<String, String> request) {
        try {
            String fullName = request.get("fullName");
            String email = request.get("email");
            String password = request.get("password");
            String phone = request.get("phone");
            RoleEnum roleEnum = RoleEnum.valueOf(request.get("role").toUpperCase());
            
            // Delegate to service
            User user = userService.createUser(fullName, email, password, phone, roleEnum);
            
            return ResponseEntity.ok(Map.of(
                "message", "User created successfully",
                "userId", user.getId()
            ));
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "User creation failed"));
        }
    }
    
    @PutMapping("/{id}/role")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id,
                                          @RequestBody Map<String, String> request) {
        try {
            RoleEnum newRole = RoleEnum.valueOf(request.get("role").toUpperCase());
            User updatedUser = userService.updateUserRole(id, newRole);
            
            return ResponseEntity.ok(Map.of(
                "message", "User role updated successfully",
                "userId", updatedUser.getId(),
                "newRole", updatedUser.getRole().getName().toString()
            ));
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Role update failed"));
        }
    }
    
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok(Map.of("message", "User deleted successfully"));
            
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "User deletion failed"));
        }
    }
}

