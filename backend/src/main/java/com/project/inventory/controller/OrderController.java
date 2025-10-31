package com.project.inventory.controller;

import com.project.inventory.dto.OrderDTO;
import com.project.inventory.dto.OrderItemDTO;
import com.project.inventory.dto.ProductDTO;
import com.project.inventory.services.OrderService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RequestMapping("/api/orders")
@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class OrderController {
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);

    private final OrderService orderService;
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping("/getOrders")
    public ResponseEntity<?> getOrders() {
        try {
            List<OrderDTO> orders = orderService.getOrders();  // return plain list from service
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            logger.error("Error occurred while fetching orders", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while fetching orders. Please try again later.");
        }
    }

    @PostMapping("/addOrder")
    public ResponseEntity<?> addOrder(@RequestBody OrderDTO orderDTO) {
        try {
            OrderDTO createdOrder = orderService.addOrder(orderDTO);
            return ResponseEntity.ok(createdOrder);
        } catch (RuntimeException ex) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred"));
        }
    }


    @PutMapping("/updateStatusAndType")
    public ResponseEntity<?> updateOrderTypeAndStatus(@RequestBody OrderDTO orderDTO) {
        try {
            OrderDTO updatedOrder = orderService.updateOrderTypeAndStatus(orderDTO);
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException ex) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred"));
        }
    }

    @DeleteMapping("/deleteOrder")
    public ResponseEntity<?> deleteOrderById(@RequestBody OrderDTO orderDTO) {
        try {
            boolean deleted = orderService.deleteOrderById(orderDTO.getOrderId());

            if (deleted) {
                return ResponseEntity.ok(Map.of("message", "Order deleted successfully"));
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Order not found"));
            }
        } catch (DataIntegrityViolationException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Cannot delete order because of related records"));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred"));
        }
    }

    @PutMapping("/updateOrderItem")
    public ResponseEntity<?> updateOrderItem(@RequestBody OrderItemDTO orderItemDTO) {
        try {
            OrderItemDTO updatedOrderItem = orderService.updateOrderItem(orderItemDTO);

            return ResponseEntity.ok(updatedOrderItem);
        } catch (RuntimeException ex) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "An unexpected error occurred"));
        }


    }
    @DeleteMapping("/deleteOrderItem")
    public ResponseEntity<?> deleteOrderItem(@RequestBody OrderItemDTO orderItemDTO) {
        try {
            orderService.deleteOrderItem(orderItemDTO);
            return ResponseEntity.ok(Map.of("message", "Order item deleted successfully"));
        } catch (RuntimeException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", ex.getMessage()));
        } catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Unexpected error"));
        }
    }




















}
