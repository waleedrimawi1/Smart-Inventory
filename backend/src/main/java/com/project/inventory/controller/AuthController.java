package com.project.inventory.controller;

import com.project.inventory.dto.LoginRequest;
import com.project.inventory.entity.User;
import com.project.inventory.repository.UserRepository;
import com.project.inventory.services.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    /**
     * Login endpoint - accepts email/password and returns JWT token
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Authenticate user
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
                )
            );

            // Load user details and generate token
            UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
            String token = jwtService.generateToken(userDetails);
            
            // Get user info
            User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

            // Create response
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("user", Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "fullName", user.getFullName(),
                "role", user.getRole().getName().name()
            ));

            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401)
                .body(Map.of("error", "Invalid email or password"));
        } catch (Exception e) {
            return ResponseEntity.status(500)
                .body(Map.of("error", "Authentication failed"));
        }
    }

    /**
     * Check if email exists - for registration validation
     */
    @PostMapping("/chickEmailExists")
    public ResponseEntity<Map<String, Boolean>> checkEmailExists(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        boolean exists = userRepository.existsByEmail(email);
        return ResponseEntity.ok(Map.of("exists", exists));
    }
}