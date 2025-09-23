package com.project.inventory.dto;

import com.project.inventory.entity.OrderItem;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class OrderDTO {

    private Long orderId;
    private Long customerId;
    private Long agentId;
    private LocalDate orderDate;
    private LocalDate deliveryDate;
    private String status;
    private String orderType;
    private BigDecimal totalAmount;
    private List<OrderItemDTO> orderItems;


    public OrderDTO() {
    }

    public OrderDTO(Long orderId, Long customerId, Long agentId, LocalDate orderDate, LocalDate deliveryDate, String status, String orderType, BigDecimal totalAmount, List<OrderItemDTO> orderItems) {
        this.orderId = orderId;
        this.customerId = customerId;
        this.agentId = agentId;
        this.orderDate = orderDate;
        this.deliveryDate = deliveryDate;
        this.status = status;
        this.orderType = orderType;
        this.totalAmount = totalAmount;
        this.orderItems = orderItems;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Long getAgentId() {
        return agentId;
    }

    public void setAgentId(Long agentId) {
        this.agentId = agentId;
    }

    public LocalDate getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDate orderDate) {
        this.orderDate = orderDate;
    }

    public LocalDate getDeliveryDate() {
        return deliveryDate;
    }

    public void setDeliveryDate(LocalDate deliveryDate) {
        this.deliveryDate = deliveryDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getOrderType() {
        return orderType;
    }

    public void setOrderType(String orderType) {
        this.orderType = orderType;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public List<OrderItemDTO> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItemDTO> orderItems) {
        this.orderItems = orderItems;
    }
}
