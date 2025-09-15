package com.project.inventory.configs;

import com.project.inventory.services.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // Step 1: Get the Authorization header from request
        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        // Step 2: Check if Authorization header exists and starts with "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Step 3: Extract JWT token (remove "Bearer " prefix)
        jwt = authHeader.substring(7);
        
        try {
            // Step 4: Extract username from JWT token
            userEmail = jwtService.extractUsername(jwt);
        } catch (Exception e) {
            filterChain.doFilter(request, response);
            return;
        }

        // Step 5: Check if user exists and is not already authenticated
        if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            
            try {
                // Step 6: Load user details from database
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                
                // Step 7: Validate JWT token
                if (jwtService.isTokenValid(jwt, userDetails)) {
                    
                    // Step 8: Create authentication token for Spring Security
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );
                    
                    // Step 9: Add request details
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    
                    // Step 10: Tell Spring Security the user is authenticated
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            } catch (Exception e) {
                // User not found or other error, continue without authentication
            }
        }
        
        // Step 11: Continue to next filter or controller
        filterChain.doFilter(request, response);
    }
}
