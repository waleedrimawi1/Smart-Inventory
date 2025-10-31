package com.project.inventory.services;

import com.project.inventory.dto.ProductDTO;
import com.project.inventory.entity.Product;
import com.project.inventory.entity.Supplier;

import com.project.inventory.mapper.ProductMapper;
import com.project.inventory.repository.ProductRepository;
import com.project.inventory.repository.SupplierRepository;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;
    private final SupplierRepository supplierRepository;

    public ProductService(ProductRepository productRepository, ProductMapper productMapper,SupplierRepository  supplierRepository) {
        this.productRepository = productRepository;
        this.productMapper = productMapper;
        this.supplierRepository = supplierRepository;
    }

    public List<ProductDTO> getAllProducts() {
        List<Product> products = productRepository.findAll(Sort.by(Sort.Direction.ASC, "productId"));
        return products.stream()
                .map(productMapper::toDTO)
                .collect(Collectors.toList());
    }

    public ProductDTO addProduct(ProductDTO productDTO) {
        Product product = productMapper.toEntity(productDTO);
        product = productRepository.save(product);
        productDTO = productMapper.toDTO(product);
        return productDTO;
    }

    public Product updateProduct(Product product) {
        return productRepository.save(product);
    }

    public void deleteProduct(Long productId) {
        productRepository.deleteById(productId);
    }

    public ProductDTO updateProduct(ProductDTO productDTO) {
        Product existingProduct = productRepository.findById(productDTO.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productDTO.getProductId()));

        existingProduct.setName(productDTO.getName());
        existingProduct.setDescription(productDTO.getDescription());
        existingProduct.setPrice(productDTO.getPrice());
        existingProduct.setStockQuantity(productDTO.getStockQuantity());
        existingProduct.setCategory(productDTO.getCategory());

        if (productDTO.getSupplierId() != null) {
            Supplier supplier = supplierRepository.findById(productDTO.getSupplierId())
                    .orElseThrow(() -> new RuntimeException("Supplier not found with ID: " + productDTO.getSupplierId()));
            existingProduct.setSupplier(supplier);
        }

        existingProduct.setUpdatedAt(LocalDateTime.now());

        Product updatedProduct = productRepository.save(existingProduct);

        return productMapper.toDTO(updatedProduct);
    }





}
