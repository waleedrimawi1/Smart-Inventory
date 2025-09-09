package com.project.inventory.controller;

import com.project.inventory.entity.Role;
import com.project.inventory.entity.RoleEnum;
import com.project.inventory.entity.User;
import com.project.inventory.repository.RoleRepository;
import com.project.inventory.repository.UserRepository;
import com.project.inventory.services.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/auth")
@RestController
public class AuthController {
    private final InventoryService inventoryService;

    public AuthController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        try {
            Map<String, Object> loginResponse = inventoryService.login(request);

            if (loginResponse.containsKey("message") && loginResponse.get("message").equals("User not found")
                    || loginResponse.get("message").equals("Invalid password")) {
                return ResponseEntity.badRequest().body(loginResponse);
            }

            return ResponseEntity.ok(loginResponse);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Login failed: " + e.getMessage()));
        }
    }




    }