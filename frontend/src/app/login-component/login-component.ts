import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';


@Component({
  standalone: true,
  selector: 'app-login-component',
  imports: [NgStyle, ReactiveFormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css'
})
export class LoginComponent {
  emailTest = "shahd@example.com";
  passwordTest = "password123";
  wrongCredentials = false;
  error = '';

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);

  constructor() {
    this.email.valueChanges.subscribe(() => {
      this.wrongCredentials = false;
    });

    this.password.valueChanges.subscribe(() => {
      this.wrongCredentials = false;
    });
  }

  login() {
    if (this.email.valid && this.password.valid) {
      if (this.email.value === this.emailTest && this.password.value === this.passwordTest) {
        alert("Login successful");
      }
      else {
        this.error = 'Email or Password is Wrong';
        this.email.reset();
        this.password.reset();
        this.wrongCredentials = true;
      }
    }
    else {
      if (this.email.errors?.['required']) {
        this.error = 'Email is required';
      }
      else if (this.email.errors?.['email']) {
        this.error = 'Invalid email format';
      }
     else if (this.password.errors?.['required']) {
        this.error = 'Password is required';
      }
      else {
        this.error = 'Password is Wrong';
      }

      this.email.reset();
      this.password.reset();
      this.wrongCredentials = true;

    }
  }



}
