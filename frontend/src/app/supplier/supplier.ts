import { Component, Inject, OnInit } from '@angular/core';
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
import { AddSupplierDialogComponent } from './add-supplier-dialog/add-supplier-dialog';
import { ConfirmDialogComponent } from '../shared/components/confirm-dialog/confirm-dialog.component';
import { SupplierApiService } from '../services/supplier-api.service';

export interface SupplierData {
  supplier_id: number;
  name: string;
  phone: string;
  address: string;
}

@Component({
  selector: 'app-supplier',
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
  templateUrl: './supplier.html',
  styleUrl: './supplier.css'
})
export class Supplier implements OnInit {
  displayedColumns: string[] = ['supplier_id', 'name', 'phone', 'address', 'actions'];
  allSuppliers: SupplierData[] = [];
  dataToDisplay: SupplierData[] = [];
  dataSource = new SupplierDataSource(this.dataToDisplay);
  searchTerm: string = '';

  constructor(private dialog: MatDialog, private supplierApi: SupplierApiService) {}

  ngOnInit() {
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.supplierApi.getAllSuppliers().subscribe({
      next: suppliers => {
        this.allSuppliers = suppliers;
        this.dataToDisplay = [...suppliers];
        this.dataSource.setData(this.dataToDisplay);
      },
      error: error => {
        console.error('Error loading suppliers:', error);
        alert('Error loading suppliers: ' + error.message);
      }
    });
  }

  // Search (Client-side filtering)
  applyFilter() {
    if (!this.searchTerm.trim()) {
      // If search is empty, show all suppliers
      this.dataToDisplay = [...this.allSuppliers];
    } else {
      // Filter suppliers based on search term (client-side)
      const filterValue = this.searchTerm.toLowerCase().trim();
      this.dataToDisplay = this.allSuppliers.filter(supplier => 
        supplier.name.toLowerCase().includes(filterValue) ||
        supplier.phone.toLowerCase().includes(filterValue) ||
        supplier.address.toLowerCase().includes(filterValue) ||
        supplier.supplier_id.toString().includes(filterValue)
      );
    }
    this.dataSource.setData(this.dataToDisplay);
  }

  // Clear search
  clearSearch() {
    this.searchTerm = '';
    this.applyFilter(); // Use client-side filter to show all suppliers
  }

  // Open dialog to add new supplier
  openAddSupplierDialog() {
    const dialogRef = this.dialog.open(AddSupplierDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addSupplier(result);
      }
    });
  }

  // Add new supplier to the list
  addSupplier(newSupplier: SupplierData) {
    this.supplierApi.createSupplier(newSupplier).subscribe({
      next: supplier => {
        this.allSuppliers.push(supplier);
        this.dataToDisplay = [...this.allSuppliers];
        this.dataSource.setData(this.dataToDisplay);
        this.searchTerm = '';
      },
      error: error => {
        console.error('Error creating supplier:', error);
        alert('Error creating supplier: ' + error.message);
      }
    });
  }

  // Edit supplier
  editSupplier(supplier: SupplierData) {
    const dialogRef = this.dialog.open(AddSupplierDialogComponent, {
      width: '600px',
      maxWidth: '90vw',
      data: { supplier: supplier, isEdit: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.supplierApi.updateSupplier(supplier.supplier_id, result).subscribe({
          next: updatedSupplier => {
            const index = this.allSuppliers.findIndex(s => s.supplier_id === supplier.supplier_id);
            if (index !== -1) {
              this.allSuppliers[index] = updatedSupplier;
              this.dataToDisplay = [...this.allSuppliers];
              this.dataSource.setData(this.dataToDisplay);
              this.applyFilter(); // Reapply current filter if any
            }
          },
          error: error => {
            console.error('Error updating supplier:', error);
            alert('Error updating supplier: ' + error.message);
          }
        });
      }
    });
  }

  // Delete supplier with confirmation dialog
  deleteSupplier(supplier: SupplierData) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete supplier',
        message: `Would you like to delete ${supplier.name}?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // User confirmed deletion
        this.performDelete(supplier);
      }
    });
  }

  // Perform the actual deletion
  private performDelete(supplier: SupplierData) {
    this.supplierApi.deleteSupplier(supplier.supplier_id).subscribe({
      next: () => {
        this.allSuppliers = this.allSuppliers.filter(s => s.supplier_id !== supplier.supplier_id);
        this.dataToDisplay = [...this.allSuppliers];
        this.dataSource.setData(this.dataToDisplay);
        this.applyFilter(); // Reapply current filter if any
      },
      error: error => {
        console.error('Error deleting supplier:', error);
        alert('Error deleting supplier: ' + error.message);
      }
    });
  }
}

class SupplierDataSource extends DataSource<SupplierData> {
  private _dataStream = new ReplaySubject<SupplierData[]>();

  constructor(initialData: SupplierData[]) {
    super();
    this.setData(initialData);
  }

  connect(): Observable<SupplierData[]> {
    return this._dataStream;
  }

  disconnect() {}

  setData(data: SupplierData[]) {
    this._dataStream.next(data);
  }
}
