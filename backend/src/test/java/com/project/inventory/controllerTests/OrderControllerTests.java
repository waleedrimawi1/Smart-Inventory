package com.project.inventory.controllerTests;
import com.project.inventory.controller.OrderController;
import com.project.inventory.dto.OrderDTO;
import com.project.inventory.dto.OrderItemDTO;
import com.project.inventory.services.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class OrderControllerTests {

    @Mock
    private OrderService orderService;

    @InjectMocks
    private OrderController orderController;

    private OrderDTO orderDTO;
    private OrderItemDTO orderItemDTO;

    @BeforeEach
    void setUp() {
        orderDTO = new OrderDTO();
        orderDTO.setOrderId(1L);
        orderDTO.setStatus("Pending");

        orderItemDTO = new OrderItemDTO();
        orderItemDTO.setOrderId(1L);
        orderItemDTO.setProductId(101L);
        orderItemDTO.setQuantity(2);
    }

    @Test
    void getOrdersSuccess() {
        when(orderService.getOrders()).thenReturn(List.of(orderDTO));

        ResponseEntity<?> response = orderController.getOrders();

        verify(orderService, times(1)).getOrders();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(List.of(orderDTO), response.getBody());
    }

    @Test
    void getOrdersFailure() {
        when(orderService.getOrders()).thenThrow(new RuntimeException());

        ResponseEntity<?> response = orderController.getOrders();

        verify(orderService, times(1)).getOrders();
        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertEquals("An error occurred while fetching orders. Please try again later.", response.getBody());
    }

    @Test
    void addOrderSuccess() {
        when(orderService.addOrder(any(OrderDTO.class))).thenReturn(orderDTO);

        ResponseEntity<?> response = orderController.addOrder(orderDTO);

        verify(orderService, times(1)).addOrder(orderDTO);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(orderDTO, response.getBody());
    }

    @Test
    void addOrderRuntimeError() {
        when(orderService.addOrder(any(OrderDTO.class))).thenThrow(new RuntimeException("Bad request"));

        ResponseEntity<?> response = orderController.addOrder(orderDTO);

        verify(orderService, times(1)).addOrder(orderDTO);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals(Map.of("error", "Bad request"), response.getBody());
    }

    @Test
    void updateOrderTypeAndStatusSuccess() {
        when(orderService.updateOrderTypeAndStatus(any(OrderDTO.class))).thenReturn(orderDTO);

        ResponseEntity<?> response = orderController.updateOrderTypeAndStatus(orderDTO);

        verify(orderService, times(1)).updateOrderTypeAndStatus(orderDTO);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(orderDTO, response.getBody());
    }

    @Test
    void deleteOrderByIdSuccess() {
        when(orderService.deleteOrderById(orderDTO.getOrderId())).thenReturn(true);

        ResponseEntity<?> response = orderController.deleteOrderById(orderDTO);

        verify(orderService, times(1)).deleteOrderById(orderDTO.getOrderId());
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(Map.of("message", "Order deleted successfully"), response.getBody());
    }

    @Test
    void deleteOrderByIdNotFound() {
        when(orderService.deleteOrderById(orderDTO.getOrderId())).thenReturn(false);

        ResponseEntity<?> response = orderController.deleteOrderById(orderDTO);

        verify(orderService, times(1)).deleteOrderById(orderDTO.getOrderId());
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals(Map.of("error", "Order not found"), response.getBody());
    }

    @Test
    void deleteOrderByIdConflict() {
        when(orderService.deleteOrderById(orderDTO.getOrderId())).thenThrow(new DataIntegrityViolationException("constraint"));

        ResponseEntity<?> response = orderController.deleteOrderById(orderDTO);

        verify(orderService, times(1)).deleteOrderById(orderDTO.getOrderId());
        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertEquals(Map.of("error", "Cannot delete order because of related records"), response.getBody());
    }

    @Test
    void updateOrderItemSuccess() {
        when(orderService.updateOrderItem(any(OrderItemDTO.class))).thenReturn(orderItemDTO);

        ResponseEntity<?> response = orderController.updateOrderItem(orderItemDTO);

        verify(orderService, times(1)).updateOrderItem(orderItemDTO);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(orderItemDTO, response.getBody());
    }

    @Test
    void deleteOrderItemSuccess() {
        doNothing().when(orderService).deleteOrderItem(orderItemDTO);

        ResponseEntity<?> response = orderController.deleteOrderItem(orderItemDTO);

        verify(orderService, times(1)).deleteOrderItem(orderItemDTO);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(Map.of("message", "Order item deleted successfully"), response.getBody());
    }

    @Test
    void deleteOrderItemNotFound() {
        doThrow(new RuntimeException("Order item not found")).when(orderService).deleteOrderItem(orderItemDTO);

        ResponseEntity<?> response = orderController.deleteOrderItem(orderItemDTO);

        verify(orderService, times(1)).deleteOrderItem(orderItemDTO);
        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertEquals(Map.of("error", "Order item not found"), response.getBody());
    }
}
