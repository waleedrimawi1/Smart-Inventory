package com.project.inventory.services;

import com.project.inventory.dto.OrderDTO;
import com.project.inventory.dto.OrderItemDTO;
import com.project.inventory.entity.*;
import com.project.inventory.mapper.OrderMapper;
import com.project.inventory.repository.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;


@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;

    public OrderService(OrderRepository orderRepository, UserRepository userRepository, ProductRepository productRepository, CustomerRepository customerRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
    }

    public List<OrderDTO> getOrders() {
        List<Order> orders = orderRepository.findAll();
        return orders.stream()
                .map(OrderMapper::toDTO)
                .collect(Collectors.toList());


    }

    public OrderDTO addOrder(OrderDTO orderDTO) {
        Customer customer = customerRepository.findById(orderDTO.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        User agent = userRepository.findById(orderDTO.getAgentId())
                .orElseThrow(() -> new RuntimeException("Agent not found"));

        List<Product> products = productRepository.findAllById(
                orderDTO.getOrderItems().stream()
                        .map(OrderItemDTO::getProductId)
                        .collect(Collectors.toList())
        );

        Order order = OrderMapper.toEntity(orderDTO, customer, agent, products);

        BigDecimal totalAmount = order.getOrderItems().stream()
                .map(OrderItem::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setTotalAmount(totalAmount);

        Order savedOrder = orderRepository.save(order);

        return OrderMapper.toDTO(savedOrder);
    }

    public OrderDTO updateOrderTypeAndStatus(OrderDTO orderDTO) {
        Long orderId = orderDTO.getOrderId();
        String newType = orderDTO.getOrderType();
        String newStatus = orderDTO.getStatus();

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!List.of("Preorder", "Regular Order").contains(newType)) {
            throw new RuntimeException("Invalid order type");
        }

        if (newType.equals("Preorder") && !List.of("Pending", "Approved", "Cancelled").contains(newStatus)) {
            throw new RuntimeException("Invalid status for Preorder");
        }

        if (newType.equals("Regular Order") && !List.of("Processing", "Delivered", "Cancelled").contains(newStatus)) {
            throw new RuntimeException("Invalid status for Regular Order");
        }

        order.setOrderType(newType);
        order.setStatus(newStatus);

        orderRepository.save(order);

        return OrderMapper.toDTO(order);
    }


}


