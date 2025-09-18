package com.project.inventory.controller;

import com.project.inventory.dto.ProductDTO;
import com.project.inventory.services.ProductService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RequestMapping("/api/products")
@RestController
@CrossOrigin(origins = "http://localhost:4200")
public class ProductController {
    final ProductService productService;
    private static final Logger logger = LoggerFactory.getLogger(ProductController.class);


    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ROLE_MANAGER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> getAllProducts() {
        try {
            List<ProductDTO> products = productService.getAllProducts();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            logger.error("Error occurred while fetching products", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while fetching products. Please try again later.");
        }
    }



    @PostMapping("/addProduct")
    public ResponseEntity<?> addProduct(@RequestBody ProductDTO productDTO) {
        try {
            System.out.println("Received productDTO: " + productDTO);
            ProductDTO productDTO1 = productService.addProduct(productDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(productDTO1);
        } catch (RuntimeException e) {
            logger.error("Error occurred while adding product", e);

            if (e.getMessage().contains("Supplier not found")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Supplier not found");
            }
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("An error occurred while processing your request.");
        } catch (Exception e) {
            logger.error("Unexpected error occurred while adding product", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Server error.");
        }
    }



    @DeleteMapping("/deleteProduct/{productId}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long productId) {
        try {
            productService.deleteProduct(productId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            logger.error("Error occurred while deleting product", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while deleting the product.");
        }
    }



    @PutMapping("/updateProduct")
    public ResponseEntity<?> updateProduct(@RequestBody ProductDTO productDTO) {
        try {
            ProductDTO updatedProductDTO = productService.updateProduct(productDTO);
            return ResponseEntity.status(HttpStatus.OK).body(updatedProductDTO);
        } catch (RuntimeException e) {
            logger.error("Error occurred while updating product", e);
            if (e.getMessage().contains("Supplier not found")) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Supplier not found");
            }
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while updating the product.");
        }
    }


}







