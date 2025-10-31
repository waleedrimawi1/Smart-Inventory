package com.project.inventory.serviceTests;

import com.project.inventory.dto.ProductDTO;
import com.project.inventory.entity.Product;
import com.project.inventory.entity.Supplier;
import com.project.inventory.mapper.ProductMapper;
import com.project.inventory.repository.ProductRepository;
import com.project.inventory.repository.SupplierRepository;
import com.project.inventory.services.ProductService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Sort;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProductServiceTests {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private SupplierRepository supplierRepository;

    @Mock
    private ProductMapper productMapper;

    @InjectMocks
    private ProductService productService;

    private Product product;
    private ProductDTO productDTO;
    private Supplier supplier;

    @BeforeEach
    void setUp() {
        supplier = new Supplier();
        supplier.setSupplierId(1L);
        supplier.setName("Test Supplier");

        product = new Product();
        product.setProductId(10L);
        product.setName("Test Product");
        product.setDescription("Test Description");
        product.setPrice(BigDecimal.valueOf(100));
        product.setStockQuantity(20);
        product.setCategory("Electronics");
        product.setSupplier(supplier);

        productDTO = new ProductDTO();
        productDTO.setProductId(10L);
        productDTO.setName("Test Product");
        productDTO.setDescription("Test Description");
        productDTO.setPrice(BigDecimal.valueOf(100));
        productDTO.setStockQuantity(20);
        productDTO.setCategory("Electronics");
        productDTO.setSupplierId(1L);
    }

    @Test
    void getAllProductsSuccess() {
        when(productRepository.findAll(Sort.by(Sort.Direction.ASC, "productId"))).thenReturn(List.of(product));
        when(productMapper.toDTO(product)).thenReturn(productDTO);

        List<ProductDTO> result = productService.getAllProducts();

        assertEquals(1, result.size());
        assertEquals(productDTO.getProductId(), result.get(0).getProductId());
        verify(productRepository, times(1)).findAll(any(Sort.class));
        verify(productMapper, times(1)).toDTO(product);
    }

    @Test
    void addProductSuccess() {
        when(productMapper.toEntity(productDTO)).thenReturn(product);
        when(productRepository.save(product)).thenReturn(product);
        when(productMapper.toDTO(product)).thenReturn(productDTO);

        ProductDTO result = productService.addProduct(productDTO);

        assertEquals(productDTO.getProductId(), result.getProductId());
        assertEquals(productDTO.getName(), result.getName());
        verify(productRepository, times(1)).save(product);
    }

    @Test
    void updateProductWithExistingSupplierSuccess() {
        when(productRepository.findById(productDTO.getProductId())).thenReturn(Optional.of(product));
        when(supplierRepository.findById(productDTO.getSupplierId())).thenReturn(Optional.of(supplier));
        when(productRepository.save(any(Product.class))).thenReturn(product);
        when(productMapper.toDTO(product)).thenReturn(productDTO);

        ProductDTO result = productService.updateProduct(productDTO);

        assertEquals(productDTO.getName(), result.getName());
        assertEquals(productDTO.getSupplierId(), result.getSupplierId());
        verify(productRepository, times(1)).save(product);
    }

    @Test
    void updateProductWithoutSupplierSuccess() {
        productDTO.setSupplierId(null); // no supplier update

        when(productRepository.findById(productDTO.getProductId())).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenReturn(product);
        when(productMapper.toDTO(product)).thenReturn(productDTO);

        ProductDTO result = productService.updateProduct(productDTO);

        assertEquals(productDTO.getName(), result.getName());
        assertNull(result.getSupplierId());
        verify(productRepository, times(1)).save(product);
        verify(supplierRepository, never()).findById(anyLong());
    }

    @Test
    void updateProductNotFound() {
        when(productRepository.findById(productDTO.getProductId())).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> productService.updateProduct(productDTO));

        assertTrue(ex.getMessage().contains("Product not found"));
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void updateProductSupplierNotFound() {
        when(productRepository.findById(productDTO.getProductId())).thenReturn(Optional.of(product));
        when(supplierRepository.findById(productDTO.getSupplierId())).thenReturn(Optional.empty());

        RuntimeException ex = assertThrows(RuntimeException.class,
                () -> productService.updateProduct(productDTO));

        assertTrue(ex.getMessage().contains("Supplier not found"));
        verify(productRepository, never()).save(any(Product.class));
    }

    @Test
    void deleteProductSuccess() {
        doNothing().when(productRepository).deleteById(product.getProductId());

        productService.deleteProduct(product.getProductId());

        verify(productRepository, times(1)).deleteById(product.getProductId());
    }
}
