import { Component, OnInit } from '@angular/core';
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
import { AddCustomerDialogComponent } from './add-customer-dialog/add-customer-dialog';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog';
import { CustomerApiService, CustomerData } from '../services/customer-api.service';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule, 
    MatTableModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    DashboardComponent
  ],
  templateUrl: './customer.html',
  styleUrl: './customer.css'
})
export class CustomerComponent implements OnInit {
  displayedColumns: string[] = ['customer_id', 'name', 'phone', 'address', 'currentBalance', 'actions'];
  allCustomers: CustomerData[] = [];
  dataToDisplay: CustomerData[] = [];
  dataSource = new CustomerDataSource(this.dataToDisplay);
  searchTerm: string = '';

  constructor(private dialog: MatDialog, private customerApi: CustomerApiService) {}

  ngOnInit() {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerApi.getAllCustomers().subscribe({
      next: customers => {
        this.allCustomers = customers;
        this.dataToDisplay = [...customers];
        this.dataSource.setData(this.dataToDisplay);
      },
      error: error => {
        console.error('Error loading customers:', error);
        alert('Error loading customers: ' + error.message);
      }
    });
  }

  // Search (Client-side filtering)
  applyFilter() {
    if (!this.searchTerm.trim()) {
      this.dataToDisplay = [...this.allCustomers];
    } else {
      const filterValue = this.searchTerm.toLowerCase().trim();
      this.dataToDisplay = this.allCustomers.filter(customer => 
        customer.name.toLowerCase().includes(filterValue) ||
        customer.phone.toLowerCase().includes(filterValue) ||
        customer.address.toLowerCase().includes(filterValue) ||
        customer.customer_id.toString().includes(filterValue)
      );
    }
    this.dataSource.setData(this.dataToDisplay);
  }

  clearSearch() {
    this.searchTerm = '';
    this.applyFilter();
  }

  openAddCustomerDialog() {
    const dialogRef = this.dialog.open(AddCustomerDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      height: '450px',
      maxHeight: '80vh',
      data: { title: 'Add New Customer' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addCustomer(result);
      }
    });
  }

  addCustomer(newCustomer: Omit<CustomerData, 'customer_id'>) {
    this.customerApi.createCustomer(newCustomer).subscribe({
      next: customer => {
        this.allCustomers.push(customer);
        this.dataToDisplay = [...this.allCustomers];
        this.dataSource.setData(this.dataToDisplay);
      },
      error: error => {
        console.error('Error adding customer:', error);
        alert('Error adding customer: ' + error.message);
      }
    });
  }

  editCustomer(customer: CustomerData) {
    const dialogRef = this.dialog.open(AddCustomerDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      height: '450px',
      maxHeight: '80vh',
      data: { title: 'Edit Customer', customer: customer }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.customerApi.updateCustomer(customer.customer_id, result).subscribe({
          next: updatedCustomer => {
            const index = this.allCustomers.findIndex(c => c.customer_id === customer.customer_id);
            if (index !== -1) {
              this.allCustomers[index] = updatedCustomer;
              this.dataToDisplay = [...this.allCustomers];
              this.dataSource.setData(this.dataToDisplay);
            }
          },
          error: error => {
            console.error('Error updating customer:', error);
            alert('Error updating customer: ' + error.message);
          }
        });
      }
    });
  }

  deleteCustomer(customer: CustomerData) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirm Delete',
        message: `Are you sure you want to delete customer "${customer.name}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.performDelete(customer);
      }
    });
  }

  private performDelete(customer: CustomerData) {
    this.customerApi.deleteCustomer(customer.customer_id).subscribe({
      next: () => {
        this.allCustomers = this.allCustomers.filter(c => c.customer_id !== customer.customer_id);
        this.dataToDisplay = [...this.allCustomers];
        this.dataSource.setData(this.dataToDisplay);
      },
      error: error => {
        console.error('Error deleting customer:', error);
        alert('Error deleting customer: ' + error.message);
      }
    });
  }
}

// Data source for the customer table
export class CustomerDataSource extends DataSource<CustomerData> {
  private _data = new ReplaySubject<CustomerData[]>(1);

  constructor(initialData: CustomerData[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<CustomerData[]> {
    return this._data.asObservable();
  }

  disconnect(): void {
    this._data.complete();
  }

  setData(data: CustomerData[]): void {
    this._data.next(data);
  }
}