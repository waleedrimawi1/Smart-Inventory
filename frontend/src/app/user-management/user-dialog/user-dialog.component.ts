import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserData } from '../../services/user-api.service';

export interface UserDialogData {
  mode: 'create' | 'edit';
  user?: UserData;
}

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './user-dialog.component.html',
  styleUrls: ['./user-dialog.component.css']
})
export class UserDialogComponent implements OnInit {
  userForm: FormGroup;
  isEditMode: boolean;
  roles = ['ADMIN', 'MANAGER', 'AGENT'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserDialogData | null
  ) {
    this.isEditMode = data?.mode === 'edit';
    this.userForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.isEditMode && this.data?.user) {
      this.populateForm(this.data.user);
    }
  }

  createForm(): FormGroup {
    if (this.isEditMode) {
      // Edit mode - all fields except password
      return this.fb.group({
        fullName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]+$/)]],
        role: ['', Validators.required]
      });
    } else {
      // Create mode - all fields including password
      return this.fb.group({
        fullName: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        phone: ['', [Validators.required, Validators.pattern(/^\+?[\d\s\-\(\)]+$/)]],
        role: ['', Validators.required]
      });
    }
  }

  populateForm(user: UserData): void {
    if (this.isEditMode) {
      this.userForm.patchValue({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role?.name || ''
      });
    }
  }

  onSubmit(): void {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      
      if (this.isEditMode) {
        // Return only role for edit mode
        this.dialogRef.close(formValue);
      } else {
        // Return all data for create mode
        this.dialogRef.close(formValue);
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getTitle(): string {
    return this.isEditMode ? 'Edit User' : 'Create New User';
  }

  getSubmitButtonText(): string {
    return this.isEditMode ? 'Update User' : 'Create User';
  }

  // Form field error helpers
  getFieldErrorMessage(fieldName: string): string {
    const field = this.userForm.get(fieldName);
    if (field?.hasError('required')) {
      return `${this.getFieldDisplayName(fieldName)} is required`;
    }
    if (field?.hasError('email')) {
      return 'Please enter a valid email address';
    }
    if (field?.hasError('minlength')) {
      const minLength = field.errors?.['minlength']?.requiredLength;
      return `${this.getFieldDisplayName(fieldName)} must be at least ${minLength} characters`;
    }
    if (field?.hasError('pattern')) {
      return 'Please enter a valid phone number';
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      fullName: 'Full Name',
      email: 'Email',
      password: 'Password',
      phone: 'Phone',
      role: 'Role'
    };
    return displayNames[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.userForm.get(fieldName);
    return !!(field?.invalid && (field?.dirty || field?.touched));
  }
}