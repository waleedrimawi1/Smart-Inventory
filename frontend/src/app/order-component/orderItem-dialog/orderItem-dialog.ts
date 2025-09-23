import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { Product, OrderItem } from '../../../models';

@Component({
  selector: 'app-order-item-dialog',
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
  templateUrl: './orderItem-dialog.html',
  styleUrls: ['./orderItem-dialog.css']
})
export class OrderItemDialogComponent implements OnInit {
  orderForm: FormGroup;
  products: Product[] = [];
  orderItem: OrderItem | null = null;
  selectedProductStock: number | null = null;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<OrderItemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.products = data.products;
    this.orderItem = data.orderItem;

    this.orderForm = this.fb.group({
      product_id: [this.orderItem?.productId || null, Validators.required],
      price: [this.orderItem?.unitPrice || 0, [Validators.required, Validators.min(0.01)]],
      quantity: [this.orderItem?.quantity || 1, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.setSelectedProductStock(this.orderForm.value.product_id);

    this.orderForm.get('product_id')?.valueChanges.subscribe(productId => {
      const product = this.products.find(p => p.productId === productId);
      if (product) {
        this.orderForm.get('price')!.setValue(product.price);

        this.setSelectedProductStock(productId);
      }
    });
  }

  setSelectedProductStock(productId: number | null) {
    const product = this.products.find(p => p.productId === productId);
    this.selectedProductStock = product ? product.stockQuantity : null;

    const quantityControl = this.orderForm.get('quantity');
    if (quantityControl && product) {
      quantityControl.setValidators([
        Validators.required,
        Validators.min(1),
        Validators.max(product.stockQuantity)
      ]);
      quantityControl.updateValueAndValidity();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.orderForm.valid) {
      const formValue = this.orderForm.value;
      this.dialogRef.close({
        product_id: formValue.product_id,
        unit_price: formValue.price,
        quantity: formValue.quantity
      });
    }
  }
}
