package com.project.inventory.services;

import com.project.inventory.controller.ProductController;
import com.project.inventory.dto.OrderDTO;
import com.project.inventory.dto.OrderItemDTO;
import com.project.inventory.entity.*;
import com.project.inventory.mapper.OrderMapper;
import com.project.inventory.mapper.OrderItemMapper;
import com.project.inventory.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

@Transactional // applies to all methods in this class
@Service
public class OrderService {
    private static final Logger logger = LoggerFactory.getLogger(OrderService.class);

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final OrderItemRepository orderItemRepository;

    public OrderService(OrderRepository orderRepository, UserRepository userRepository, ProductRepository productRepository, CustomerRepository customerRepository, OrderItemRepository orderItemRepository) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.customerRepository = customerRepository;
        this.orderItemRepository = orderItemRepository;
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

    public Boolean deleteOrderById(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        orderRepository.delete(order);
        return true;
    }

    public OrderItemDTO updateOrderItem(OrderItemDTO orderItemDTO){
        OrderItem orderItem = orderItemRepository.findById(orderItemDTO.getOrderItemId())
                .orElseThrow(() -> new RuntimeException("OrderItem not found"));

        Product product = productRepository.findById(orderItemDTO.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Order order = orderRepository.findById(orderItemDTO.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found"));
        logger.info("Order ID: {}", order.getOrderId());

        orderItem.setProduct(product);
        orderItem.setOrder(order);
        orderItem.setQuantity(orderItemDTO.getQuantity());
        orderItem.setUnitPrice(orderItemDTO.getUnitPrice());
        orderItem.setTotalPrice(orderItem.getUnitPrice().multiply(BigDecimal.valueOf(orderItem.getQuantity())));
        orderItemRepository.save(orderItem);

        return OrderItemMapper.toDTO(orderItem);

    }

    public void deleteOrderItem(OrderItemDTO orderItemDTO) {
        OrderItem orderItem = orderItemRepository.findById(orderItemDTO.getOrderItemId())
                .orElseThrow(() -> new RuntimeException("OrderItem not found"));

        Order order = orderItem.getOrder();

        orderItemRepository.delete(orderItem);

        if (order.getOrderItems().isEmpty()) {
            orderRepository.delete(order);
        }
    }







}


