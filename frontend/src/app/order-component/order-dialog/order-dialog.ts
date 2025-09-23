import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { Product, Customer, OrderDialogData, User } from '../../../models';

@Component({
  selector: 'app-order-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
  ],
  templateUrl: './order-dialog.html',
  styleUrls: ['./order-dialog.css']
})
export class OrderDialogComponent implements OnInit {
  orderForm: FormGroup;
  products: Product[] = [];
  customers: Customer[] = [];
  agents: User[] = [];

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<OrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrderDialogData
  ) {
    this.products = data.products;
    this.customers = data.customers;
    this.agents = data.agents;

    this.orderForm = this.fb.group({
      customerId: ['', [Validators.required, Validators.min(1)]],
      agentId: ['', [Validators.required, Validators.min(1)]],
      quantities: this.fb.array([])
    });
  }

  ngOnInit() {
    const quantityControls = this.products.map(p =>
      new FormControl(1, [
        Validators.required,
        Validators.min(1),
        Validators.max(p.stockQuantity)
      ])
    );
    this.orderForm.setControl('quantities', new FormArray(quantityControls));
  }

  get quantities(): FormArray {
    return this.orderForm.get('quantities') as FormArray;
  }

  getQuantityControl(i: number): FormControl {
    return this.quantities.at(i) as FormControl;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

onSave(): void {
  if (this.orderForm.valid) {
    const formValue = this.orderForm.value;

    const items = this.products.map((p, i) => ({
      productId: p.productId,
      quantity: formValue.quantities[i]
    }));

    this.dialogRef.close({
      customerId: formValue.customerId,
      agentId: formValue.agentId,
      items
    });
  }
}
}
