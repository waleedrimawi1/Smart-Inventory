package com.project.inventory.mapper;

import com.project.inventory.dto.OrderDTO;
import com.project.inventory.dto.OrderItemDTO;
import com.project.inventory.entity.Customer;
import com.project.inventory.entity.Order;
import com.project.inventory.entity.OrderItem;
import com.project.inventory.entity.Product;
import com.project.inventory.entity.User;

import java.util.List;
import java.util.stream.Collectors;

public class OrderMapper {

    // Map Order entity → OrderDTO
    public static OrderDTO toDTO(Order order) {
        if (order == null) return null;

        List<OrderItemDTO> itemDTOs = order.getOrderItems() == null ? List.of() :
                order.getOrderItems().stream()
                        .map(item -> {
                            OrderItemDTO dto = new OrderItemDTO(
                                    item.getOrderItemId(),
                                    item.getProduct() != null ? item.getProduct().getProductId() : null,
                                    item.getQuantity(),
                                    item.getUnitPrice(),
                                    item.getTotalPrice()
                            );
                            // Set parent orderId
                            dto.setOrderId(order.getOrderId());
                            return dto;
                        })
                        .collect(Collectors.toList());
        return new OrderDTO(
                order.getOrderId(),
                order.getCustomer() != null ? order.getCustomer().getCustomerId() : null,
                order.getAgent() != null ? order.getAgent().getId() : null,
                order.getOrderDate(),
                order.getDeliveryDate(),
                order.getStatus(),
                order.getOrderType(),
                order.getTotalAmount(),
                itemDTOs
        );
    }

    // Map OrderDTO → Order entity
    public static Order toEntity(OrderDTO dto, Customer customer, User agent, List<Product> products) {
        if (dto == null) return null;

        Order order = new Order();
        order.setOrderId(dto.getOrderId());
        order.setCustomer(customer);
        order.setAgent(agent);
        order.setOrderDate(dto.getOrderDate());
        order.setDeliveryDate(dto.getDeliveryDate());
        order.setStatus(dto.getStatus());
        order.setOrderType(dto.getOrderType());
        order.setTotalAmount(dto.getTotalAmount());

        // Map OrderItemDTOs → OrderItem entities
        if (dto.getOrderItems() != null && !dto.getOrderItems().isEmpty()) {
            List<OrderItem> items = dto.getOrderItems().stream()
                    .map(itemDTO -> {
                        OrderItem item = new OrderItem();
                        item.setOrder(order); // link to parent
                        item.setQuantity(itemDTO.getQuantity());
                        item.setUnitPrice(itemDTO.getUnitPrice());
                        item.setTotalPrice(itemDTO.getTotalPrice());

                        // Link Product entity if productId matches
                        if (itemDTO.getProductId() != null && products != null) {
                            products.stream()
                                    .filter(p -> p.getProductId().equals(itemDTO.getProductId()))
                                    .findFirst()
                                    .ifPresent(item::setProduct);
                        }

                        return item;
                    })
                    .collect(Collectors.toList());

            order.setOrderItems(items);
        }

        return order;
    }
}
