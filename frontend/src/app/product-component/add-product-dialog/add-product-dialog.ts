import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-product-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-product-dialog.html',
  styleUrls: ['./add-product-dialog.css']
})
export class AddProductDialogComponent {
  productForm: FormGroup;
  isEditMode: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.isEditMode = data?.isEdit || false;
    if(this.data.product){
      console.log('Received product data for editing:', this.data.product);
    }

    // Updated form group with new fields
    this.productForm = this.formBuilder.group({
      name: [data?.product?.name || '', Validators.required],
      description: [data?.product?.description || '', Validators.required],
      price: [data?.product?.price || '', [Validators.required, Validators.min(0)]],
      stockQuantity: [data?.product?.stockQuantity || '', [Validators.required, Validators.min(0)]],
      category: [data?.product?.category || '', Validators.required],
      supplierId: [data?.product?.supplierId || '', [Validators.required, Validators.min(1)]],  

    });

    if(this.data.product){
      console.log('Received product data for editing 333 :', this.data.product);
    }

  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.productForm.valid) {
      const formValue = { ...this.productForm.value };
      formValue.supplierId = Number(formValue.supplierId);

      this.dialogRef.close(formValue);

    }
  }
}
