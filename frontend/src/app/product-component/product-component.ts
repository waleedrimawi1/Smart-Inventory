import { Component } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { Observable, ReplaySubject } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { DashboardComponent } from '../dashboard/dashboard';

export interface Product {
  productId: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  supplierId: number;

}

const products: Product[] = [
  { productId: 1, name: 'Product 1', description: 'Description 1', price: 10, stockQuantity: 100, category: 'Category 1', supplierId: 1 },
  { productId: 2, name: 'Product 2', description: 'Description 2', price: 20, stockQuantity: 200, category: 'Category 2', supplierId: 2 },
  { productId: 3, name: 'Product 3', description: 'Description 3', price: 30, stockQuantity: 300, category: 'Category 3', supplierId: 3 },
  { productId: 4, name: 'Product 4', description: 'Description 4', price: 40, stockQuantity: 400, category: 'Category 4', supplierId: 4 },
];

@Component({
  standalone: true,
  selector: 'app-product-component',
  imports: [MatButtonModule, MatTableModule,DashboardComponent],
  templateUrl: './product-component.html',
  styleUrls: ['./product-component.css']
})
export class ProductComponent {
  displayedColumns: string[] = ['productId', 'name', 'description', 'price', 'stockQuantity', 'category', 'supplierId',  'update', 'delete'];
  dataToDisplay = [...products];
  dataSource = new ExampleDataSource(this.dataToDisplay);

  addData() {
    const randomElementIndex = Math.floor(Math.random() * products.length);
    this.dataToDisplay = [...this.dataToDisplay, products[randomElementIndex]];
    this.dataSource.setData(this.dataToDisplay);
  }

  removeData() {
    this.dataToDisplay = this.dataToDisplay.slice(0, -1);
    this.dataSource.setData(this.dataToDisplay);
  }



  onUpdate(element: any): void {
    console.log('Action clicked for update:', element);
  }

  onDelete(element: any): void {
    console.log('Action clicked for delete:', element);
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

  disconnect() {}

  setData(data: Product[]) {
    this._dataStream.next(data);
  }
}
