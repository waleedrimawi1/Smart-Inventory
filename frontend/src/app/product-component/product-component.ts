import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataSource } from '@angular/cdk/collections';
import { Observable, ReplaySubject } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from '../dashboard/dashboard';
import { AddProductDialogComponent } from './add-product-dialog/add-product-dialog';
import { InventoryManagementService } from '../../InventoryManagementService/inventory-management-service';
import { Product } from '../../models';


@Component({
  standalone: true,
  selector: 'app-product-component',
  imports: [CommonModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    DashboardComponent],
  templateUrl: './product-component.html',
  styleUrls: ['./product-component.css']
})
export class ProductComponent {
  displayedColumns: string[] = ['productId', 'name', 'description', 'price', 'stockQuantity', 'category', 'supplierId', 'actions'];
  products: Product[] = [];
  allProducts: Product[] = [];
  dataToDisplay: Product[] = [];
  dataSource = new ExampleDataSource(this.dataToDisplay);
  searchTerm: string = '';
  constructor(public dialog: MatDialog,
    private inventoryManagementService: InventoryManagementService) { }

  ngOnInit() {
    this.fetchProducts();
  }

  applyFilter() {
    this.dataToDisplay = this.inventoryManagementService.searchProducts(this.searchTerm, this.allProducts);
    this.dataSource.setData(this.dataToDisplay);  
  }


  openAddProductDialog() {
    const dialogRef = this.dialog.open(AddProductDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const newProduct: Product = {
          name: result.name,
          description: result.description,
          price: result.price,
          stockQuantity: result.stockQuantity,
          category: result.category,
          supplierId: result.supplierId
        };
        this.inventoryManagementService.addProduct(newProduct).subscribe(
          (response) => {
            console.log('Product added successfully:', response);
            this.allProducts.push(response);
            this.dataToDisplay = [...this.allProducts];
            this.dataSource.setData(this.allProducts);
            this.applyFilter(); // Reapply current filter
          },
          (error) => {
            console.error('Failed to add product:', error);
            if (error.status === 400) {
              if (error.error === 'Supplier not found') {
                alert('The supplier ID does not exist. Please check again. could not add product.');
              }

            }

          });
      }
    });
  }



  editProduct(product: Product) {
  const dialogRef = this.dialog.open(AddProductDialogComponent, {
    width: '600px',
    maxWidth: '90vw',
    data: { product: product, isEdit: true },
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      const updatedProduct: Product = { ...product, ...result }; 

      this.inventoryManagementService.updateProduct(updatedProduct).subscribe(
        (response) => {
          console.log('Product updated successfully:', response);

          const index = this.allProducts.findIndex(s => s.productId === product.productId);
          if (index !== -1) {
            this.allProducts[index] = updatedProduct; 
            this.dataToDisplay = [...this.allProducts]; 
            this.dataSource.setData(this.allProducts);
            this.applyFilter(); 
          }
        },
        (error) => {
          console.error('Failed to update product:', error);
          if (error.status === 400) {
            if (error.error === 'Supplier not found') {
              alert('The supplier ID does not exist. Please check again. could not update product.');
            }
          }
        }
      );
    }
  });
}



  deleteProduct(product: Product) {
    if (product.productId === undefined) {
      console.error('Cannot delete product: productId is undefined.');
      return;
    }
    if (confirm(`Are you sure you want to delete ${product.name}?`)) {
      this.inventoryManagementService.deleteProduct(product.productId).subscribe(
        () => {
          this.allProducts = this.allProducts.filter(s => s.productId !== product.productId);
          console.log('Product deleted successfully');

          this.dataToDisplay = [...this.allProducts];
          this.dataSource.setData(this.dataToDisplay);
          this.applyFilter(); // Reapply current filter
        },
        (error) => {
          console.error('Failed to delete product:', error);
        }
      );
    }
  }



  fetchProducts() {
    this.inventoryManagementService.getProducts().subscribe(
      (response) => {
        console.log('Products fetched successfully:', response);
        this.products = response;
        this.allProducts = [...this.products];
        this.dataToDisplay = [...this.products];
        this.dataSource.setData(this.dataToDisplay);
      },
      (error) => {
        console.error('Failed to fetch products:', error);
      }
    );
  }
}



class ExampleDataSource extends DataSource<Product> {
  private _dataStream = new ReplaySubject<Product[]>();

  constructor(initialData: Product[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<Product[]> {
    return this._dataStream;
  }

  disconnect() { }

  setData(data: Product[]) {
    this._dataStream.next(data);
  }
}
