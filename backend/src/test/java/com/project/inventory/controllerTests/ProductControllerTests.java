package com.project.inventory.controllerTests;

import com.project.inventory.controller.ProductController;
import com.project.inventory.dto.ProductDTO;
import com.project.inventory.services.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
        import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductControllerTests {

    @Mock
    private ProductService productService;

    @InjectMocks
    private ProductController productController;

    private ProductDTO productDTO;

    @BeforeEach
    void setUp() {
        productDTO = new ProductDTO();
        productDTO.setProductId(1L);
        productDTO.setName("Test Product");
        productDTO.setPrice(BigDecimal.valueOf(100));
    }

    @Test
    void getAllProductsSuccess() {
        List<ProductDTO> products = Arrays.asList(productDTO);
        when(productService.getAllProducts()).thenReturn(products);

        ResponseEntity<?> response = productController.getAllProducts();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(products, response.getBody());
        verify(productService, times(1)).getAllProducts();
    }

    @Test
    void getAllProductsException() {
        when(productService.getAllProducts()).thenThrow(new RuntimeException("DB error"));

        ResponseEntity<?> response = productController.getAllProducts();

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("An error occurred"));
        verify(productService, times(1)).getAllProducts();
    }

    @Test
    void addProductSuccess() {
        when(productService.addProduct(productDTO)).thenReturn(productDTO);

        ResponseEntity<?> response = productController.addProduct(productDTO);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(productDTO, response.getBody());
        verify(productService, times(1)).addProduct(productDTO);
    }

    @Test
    void addProductSupplierNotFound() {
        when(productService.addProduct(productDTO)).thenThrow(new RuntimeException("Supplier not found"));

        ResponseEntity<?> response = productController.addProduct(productDTO);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Supplier not found", response.getBody());
        verify(productService, times(1)).addProduct(productDTO);
    }

    @Test
    void addProductOtherException() {
        when(productService.addProduct(productDTO)).thenThrow(new RuntimeException("Other error"));

        ResponseEntity<?> response = productController.addProduct(productDTO);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("An error occurred"));
        verify(productService, times(1)).addProduct(productDTO);
    }

    @Test
    void deleteProductSuccess() {
        doNothing().when(productService).deleteProduct(1L);

        ResponseEntity<?> response = productController.deleteProduct(1L);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(productService, times(1)).deleteProduct(1L);
    }

    @Test
    void deleteProductException() {
        doThrow(new RuntimeException("DB error")).when(productService).deleteProduct(1L);

        ResponseEntity<?> response = productController.deleteProduct(1L);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("An error occurred"));
        verify(productService, times(1)).deleteProduct(1L);
    }

    @Test
    void updateProductSuccess() {
        // Arrange
        ProductDTO productDTO = new ProductDTO();
        productDTO.setProductId(1L);
        productDTO.setName("Old Name");
        productDTO.setPrice(BigDecimal.valueOf(100));

        ProductDTO updatedDTO = new ProductDTO();
        updatedDTO.setProductId(1L);
        updatedDTO.setName("New Name");  // new value
        updatedDTO.setPrice(BigDecimal.valueOf(150)); // new value

        when(productService.updateProduct(productDTO)).thenReturn(updatedDTO);

        // Act
        ResponseEntity<?> response = productController.updateProduct(productDTO);

        // Assert
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(updatedDTO, response.getBody());  // verify updated values
        verify(productService, times(1)).updateProduct(productDTO);
    }

    @Test
    void updateProductSupplierNotFound() {
        when(productService.updateProduct(productDTO)).thenThrow(new RuntimeException("Supplier not found"));

        ResponseEntity<?> response = productController.updateProduct(productDTO);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("Supplier not found", response.getBody());
        verify(productService, times(1)).updateProduct(productDTO);
    }

    @Test
    void updateProductOtherException() {
        when(productService.updateProduct(productDTO)).thenThrow(new RuntimeException("Other error"));

        ResponseEntity<?> response = productController.updateProduct(productDTO);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertTrue(response.getBody().toString().contains("An error occurred"));
        verify(productService, times(1)).updateProduct(productDTO);
    }
}

