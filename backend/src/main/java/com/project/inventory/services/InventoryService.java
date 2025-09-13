package com.project.inventory.services;

import com.project.inventory.entity.RoleEnum;
import com.project.inventory.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface InventoryService {

    public Map<String, Object> login(Map<String, String> request);
    public boolean isEmailTaken(String email);
    public List<User> getAllUsers();
    public Optional<User> getUserById(Integer id);
    public List<User> getUsersByRole(RoleEnum roleName);
    public User createUser(String fullName, String email, String password, String phone, RoleEnum roleEnum);
    public User updateUserRole(Integer userId, RoleEnum newRole);
    public void deleteUser(Integer userId);



    }