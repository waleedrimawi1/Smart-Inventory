import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InventoryManagementApi } from '../InventoryManagementApi/inventory-management-api';
import { Product } from '../models';

@Injectable({
  providedIn: 'root'
})
export class InventoryManagementService {

  constructor(private inventoryManagementApi: InventoryManagementApi) { }


  login(credentials: { email: string; password: string }): Observable<any> {
    return this.inventoryManagementApi.login(credentials);
  }


  getProducts(): Observable<Product[]> {
    return this.inventoryManagementApi.getProducts();
  }

  addProduct(product: Product): Observable<Product> {
    return this.inventoryManagementApi.addProduct(product);
  }

  deleteProduct(productId: number): Observable<void> {
    return this.inventoryManagementApi.deleteProduct(productId);
  }

  updateProduct(product : Product): Observable<any> {
    return this.inventoryManagementApi.updateProduct(product);
  }

  searchProducts(searchTerm: string, allProducts: Product[]): Product[] {
    if (!searchTerm.trim()) {
      return [...allProducts];
    } else {
      const filterValue = searchTerm.toLowerCase().trim();
      return allProducts.filter(product =>
        product.name.toLowerCase().includes(filterValue) ||
        product.description.toLowerCase().includes(filterValue) ||
        product.category.toLowerCase().includes(filterValue) ||
        product.price.toString().includes(filterValue) ||
        product.stockQuantity.toString().includes(filterValue) ||
        product.supplierId.toString().includes(filterValue) ||
        product.productId?.toString().includes(filterValue)
      );
    }
  }
  
}
