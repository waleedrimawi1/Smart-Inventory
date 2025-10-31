import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl, ReactiveFormsModule ,AbstractControl, ValidationErrors,} from '@angular/forms';
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
  // Check if there are any products
  if (this.products.length === 0) {
    // If no products, set a custom error on the form
    this.orderForm.setErrors({ noProducts: true });
  } else {
    // Otherwise, create form controls for each product
    const quantityControls = this.products.map(p =>
      new FormControl(0, [  // Default value 0
        Validators.required,
        Validators.min(0), 
        Validators.max(p.stockQuantity) // Cannot exceed available stock
      ])
    );

    // Set the 'quantities' FormArray with the custom validator
    const quantitiesArray = new FormArray(quantityControls, this.atLeastOneQuantityValidator);
    this.orderForm.setControl('quantities', quantitiesArray);
  }
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
  if (this.products.length === 0) {
  this.orderForm.setErrors({ noProducts: true });
}
  if (this.orderForm.valid) {
    const formValue = this.orderForm.value;

    // Filter the items to include only those with a quantity greater than 0
    const items = this.products
      .map((p, i) => ({
        productId: p.productId,
        quantity: formValue.quantities[i]
      }))
      .filter(item => item.quantity > 0);  

    if (items.length > 0) {
      this.dialogRef.close({
        customerId: formValue.customerId,
        agentId: formValue.agentId,
        items
      });
    } else {
      console.error('At least one product must have a quantity greater than 0');
    }
  }
}




atLeastOneQuantityValidator(control: AbstractControl): ValidationErrors | null {
  if (control instanceof FormArray) {
    const hasAtLeastOneNonZeroQuantity = control.controls.some((c: AbstractControl) => c.value > 0);
    return hasAtLeastOneNonZeroQuantity ? null : { noQuantity: 'At least one product must have a quantity greater than zero.' };
  }
  return null;
}
}



