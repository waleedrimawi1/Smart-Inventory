package com.project.inventory.mapper;

import com.project.inventory.dto.OrderItemDTO;
import com.project.inventory.entity.OrderItem;
import com.project.inventory.entity.Order;
import com.project.inventory.entity.Product;

import java.util.List;
import java.util.stream.Collectors;

public class OrderItemMapper {

    public static OrderItemDTO toDTO(OrderItem orderItem) {
        if (orderItem == null) return null;

        OrderItemDTO dto = new OrderItemDTO();
        dto.setOrderItemId(orderItem.getOrderItemId());
        dto.setOrderId(orderItem.getOrder().getOrderId());
        dto.setProductId(orderItem.getProduct().getProductId());
        dto.setQuantity(orderItem.getQuantity());
        dto.setUnitPrice(orderItem.getUnitPrice());
        dto.setTotalPrice(orderItem.getTotalPrice());

        return dto;
    }

    // Convert DTO → Entity
    public static OrderItem toEntity(OrderItemDTO dto, Order order, Product product) {
        if (dto == null) return null;

        OrderItem orderItem = new OrderItem();
        orderItem.setOrder(order);
        orderItem.setProduct(product);
        orderItem.setQuantity(dto.getQuantity());
        orderItem.setUnitPrice(dto.getUnitPrice());
        orderItem.setTotalPrice(dto.getTotalPrice()); // or let entity recalc

        return orderItem;
    }


}
