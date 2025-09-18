package com.project.inventory.mapper;

import com.project.inventory.entity.Product;
import com.project.inventory.dto.ProductDTO;
import com.project.inventory.entity.Supplier;
import com.project.inventory.repository.SupplierRepository;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Component
public class ProductMapper {
    private static final Logger logger = LoggerFactory.getLogger(ProductMapper.class);
    private final SupplierRepository supplierRepository;

    public ProductMapper(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }


    // Convert Product entity to ProductDTO
    public ProductDTO toDTO(Product product) {
        if (product == null) {
            return null;
        }

        ProductDTO productDTO = new ProductDTO();
        productDTO.setProductId(product.getProductId());
        productDTO.setName(product.getName());
        productDTO.setDescription(product.getDescription());
        productDTO.setPrice(product.getPrice());
        productDTO.setStockQuantity(product.getStockQuantity());
        productDTO.setCategory(product.getCategory());
        if (product.getSupplier() != null) {
            productDTO.setSupplierId(product.getSupplier().getSupplierId());
        } else {
            productDTO.setSupplierId(null);  // Or another default value if required
        }        logger.info("Received productDTO 2: {}", productDTO.toString());


        return productDTO;
    }


    public Product toEntity(ProductDTO productDTO) {
        if (productDTO == null) {
            return null;
        }

        Product product = new Product();
        product.setProductId(productDTO.getProductId());
        product.setName(productDTO.getName());
        product.setDescription(productDTO.getDescription());
        product.setPrice(productDTO.getPrice());
        product.setStockQuantity(productDTO.getStockQuantity());
        product.setCategory(productDTO.getCategory());

        if (productDTO.getSupplierId() != null) {
            Supplier supplier = supplierRepository.findById(productDTO.getSupplierId())
                    .orElseThrow(() -> new RuntimeException("Supplier not found for id: " + productDTO.getSupplierId()));
            product.setSupplier(supplier);
        }

        if (product.getProductId() == null) {
            product.setCreatedAt(LocalDateTime.now());
        }
        product.setUpdatedAt(LocalDateTime.now());

        return product;
    }

}
