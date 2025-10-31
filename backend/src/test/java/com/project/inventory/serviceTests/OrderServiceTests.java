package com.project.inventory.serviceTests;
import com.project.inventory.services.OrderService;

import com.project.inventory.dto.OrderDTO;
import com.project.inventory.dto.OrderItemDTO;
import com.project.inventory.entity.*;
        import com.project.inventory.mapper.OrderItemMapper;
import com.project.inventory.mapper.OrderMapper;
import com.project.inventory.repository.*;
        import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
        import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTests {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderItemRepository orderItemRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private CustomerRepository customerRepository;
    @InjectMocks
    private OrderService orderService;
    private Order order;
    private OrderDTO orderDTO;
    private OrderItem orderItem;
    private OrderItemDTO orderItemDTO;
    private Customer customer;
    private User agent;
    private Product product;

    @BeforeEach
    void setUp() {
        customer = new Customer();
        customer.setCustomerId(1L);

        agent = new User();
        agent.setId(2L);

        product = new Product();
        product.setProductId(3L);

        orderItem = new OrderItem();
        orderItem.setOrderItemId(10L);
        orderItem.setProduct(product);
        orderItem.setQuantity(2);
        orderItem.setUnitPrice(BigDecimal.valueOf(100));
        orderItem.setTotalPrice(BigDecimal.valueOf(200));

        order = new Order();
        order.setOrderId(5L);
        order.setCustomer(customer);
        order.setAgent(agent);
        order.setOrderItems(List.of(orderItem));
        order.setTotalAmount(BigDecimal.valueOf(200));

        orderItem.setOrder(order);
        orderDTO = OrderMapper.toDTO(order);
        orderItemDTO = OrderItemMapper.toDTO(orderItem);
    }

    @Test
    void getOrdersSuccess() {
        when(orderRepository.findAll()).thenReturn(List.of(order));

        List<OrderDTO> result = orderService.getOrders();

        assertEquals(1, result.size());
        assertEquals(order.getOrderId(), result.get(0).getOrderId());
        verify(orderRepository, times(1)).findAll();
    }

    @Test
    void addOrderSuccess() {
        when(customerRepository.findById(orderDTO.getCustomerId())).thenReturn(Optional.of(customer));
        when(userRepository.findById(orderDTO.getAgentId())).thenReturn(Optional.of(agent));
        when(productRepository.findAllById(any())).thenReturn(List.of(product));
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        OrderDTO result = orderService.addOrder(orderDTO);

        assertEquals(order.getOrderId(), result.getOrderId());
        assertEquals(BigDecimal.valueOf(200), result.getTotalAmount());
        verify(orderRepository, times(1)).save(any(Order.class));
    }

    @Test
    void addOrderCustomerNotFound() {
        when(customerRepository.findById(orderDTO.getCustomerId())).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> orderService.addOrder(orderDTO));

        assertEquals("Customer not found", ex.getMessage());
    }

    @Test
    void updateOrderTypeAndStatusSuccess() {
        order.setOrderType("Regular Order");
        order.setStatus("Processing");

        // re-map the DTO so it matches the entity
        orderDTO = OrderMapper.toDTO(order);

        when(orderRepository.findById(order.getOrderId())).thenReturn(Optional.of(order));
        when(orderRepository.save(any(Order.class))).thenReturn(order);

        OrderDTO result = orderService.updateOrderTypeAndStatus(orderDTO);

        assertEquals(order.getOrderType(), result.getOrderType());
        assertEquals(order.getStatus(), result.getStatus());
        verify(orderRepository, times(1)).save(order);
    }


    @Test
    void updateOrderTypeAndStatusInvalidType() {
        orderDTO.setOrderType("Invalid");

        when(orderRepository.findById(order.getOrderId())).thenReturn(Optional.of(order));

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> orderService.updateOrderTypeAndStatus(orderDTO));

        assertEquals("Invalid order type", ex.getMessage());
    }

    @Test
    void deleteOrderByIdSuccess() {
        when(orderRepository.findById(order.getOrderId())).thenReturn(Optional.of(order));

        Boolean result = orderService.deleteOrderById(order.getOrderId());

        assertTrue(result);
        verify(orderRepository, times(1)).delete(order);
    }

    @Test
    void deleteOrderByIdNotFound() {
        when(orderRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> orderService.deleteOrderById(99L));
    }
    @Test
    void updateOrderItemSuccess() {
        OrderItemDTO updatedDTO = new OrderItemDTO();
        updatedDTO.setOrderItemId(orderItem.getOrderItemId());
        updatedDTO.setQuantity(5);
        updatedDTO.setUnitPrice(BigDecimal.valueOf(200));
        updatedDTO.setProductId(product.getProductId());
        updatedDTO.setOrderId(order.getOrderId());

        when(orderItemRepository.findById(orderItem.getOrderItemId()))
                .thenReturn(Optional.of(orderItem));
        when(productRepository.findById(product.getProductId()))
                .thenReturn(Optional.of(product));
        when(orderRepository.findById(order.getOrderId()))
                .thenReturn(Optional.of(order));
        when(orderItemRepository.save(any(OrderItem.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        OrderItemDTO result = orderService.updateOrderItem(updatedDTO);

        // --- Assert ---
        BigDecimal expectedTotal = updatedDTO.getUnitPrice()
                .multiply(BigDecimal.valueOf(updatedDTO.getQuantity()));
        assertEquals(updatedDTO.getQuantity(), result.getQuantity());
        assertEquals(0, expectedTotal.compareTo(result.getTotalPrice()));

        verify(orderItemRepository, times(1)).save(any(OrderItem.class));
    }


    @Test
    void deleteOrderItemSuccess() {
        Long orderItemId = 10L;

        OrderItemDTO orderItemDTO = new OrderItemDTO();
        orderItemDTO.setOrderItemId(orderItemId);

        OrderItem orderItem = new OrderItem();
        orderItem.setOrderItemId(orderItemId);

        Order order = new Order();
        order.setOrderId(5L);
        order.setOrderItems(new ArrayList<>());
        order.getOrderItems().add(orderItem);

        orderItem.setOrder(order);

        // Stubbing
        when(orderItemRepository.findById(orderItemId))
                .thenReturn(Optional.of(orderItem));
        doNothing().when(orderItemRepository).delete(orderItem);

        // Call service
        orderService.deleteOrderItem(orderItemDTO);

        // Verify interactions
        verify(orderItemRepository).delete(orderItem);
    }


    @Test
    void deleteOrderItemNotFound() {
        when(orderItemRepository.findById(orderItemDTO.getOrderItemId()))
                .thenReturn(Optional.empty());

        assertThrows(RuntimeException.class,
                () -> orderService.deleteOrderItem(orderItemDTO));

        verify(orderItemRepository, times(1)).findById(orderItemDTO.getOrderItemId());
    }

}
