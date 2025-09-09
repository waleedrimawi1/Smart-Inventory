package com.project.inventory.services;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.Map;
public interface InventoryService {

    public Map<String, Object> login(Map<String, String> request);

}