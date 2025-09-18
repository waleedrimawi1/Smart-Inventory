import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { LOGIN_CONSTANTS } from './login-component-constants';
import { InventoryManagementService } from '../../InventoryManagementService/inventory-management-service';
import { Router } from '@angular/router';


@Component({
  standalone: true,
  selector: 'app-login-component',
  imports: [NgStyle, ReactiveFormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css'
})
export class LoginComponent {
  constants = LOGIN_CONSTANTS;
  emailExists = true;
  loggingIn = false;
  wrongPassword = false;
  error = '';

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);

  constructor(
    private inventoryManagementService: InventoryManagementService,
    private router: Router
  ) {
    this.email.valueChanges.subscribe(() => {
      this.loggingIn = false;
      this.emailExists = true;;
      this.error = '';
    });

    this.password.valueChanges.subscribe(() => {
      this.loggingIn = false;
      this.wrongPassword = false;
      this.error = '';
    });
  }

  login() {
    this.error = '';
    this.loggingIn = true;

    if (this.email.valid && this.password.valid) {
      const credentials = {
        email: this.email.value as string,
        password: this.password.value as string,
      };

      this.inventoryManagementService.login(credentials).subscribe(
        (response) => {
          console.log('Login successful:', response);

          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('role', response.user.role);
          localStorage.setItem('username', response.user.fullName);

          this.router.navigate(['/dashboard']);


        },
        error => {
          console.error('Login failed:', error);

          if (error.status === 400) {
            if (error.error.error === 'User not found') {
              this.error = 'The email does not exist. Please check again.';
              this.emailExists = false;
            } else if (error.error.error === 'Invalid password') {
              this.error = 'The password you entered is incorrect.';
              this.wrongPassword = true;
            }
  
          } else {
            this.error = 'An error occurred during login. Please try again later.';
          }
        }
      );
    } else {
      if (this.email.errors?.['required']) {
        this.error = 'Email is required';
      } else if (this.email.errors?.['email']) {
        this.error = 'Invalid email format';
      } else if (this.password.errors?.['required']) {
        this.error = 'Password is required';
      }
    }
  }
}
