import { Component } from '@angular/core';
import { NgStyle } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { LOGIN_CONSTANTS } from './login-component-constants';



@Component({
  standalone: true,
  selector: 'app-login-component',
  imports: [NgStyle, ReactiveFormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css'
})
export class LoginComponent {
  constants = LOGIN_CONSTANTS;

  emailTest = "shahd@example.com";
  passwordTest = "password123";
  emailExists = false;
  loggingIn = false;
  wrongPassword = false;
  error = '';

  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required]);

  constructor() {
    this.email.valueChanges.subscribe(() => {
      this.loggingIn = false;
      this.emailExists = false;
    });

    this.password.valueChanges.subscribe(() => {
      this.loggingIn = false;
      this.wrongPassword = false;
    });
  }

  login() {
    this.loggingIn = true;
    if (this.email.valid && this.password.valid) {
      if (this.email.value === this.emailTest) {
        this.emailExists = true;
        if (this.password.value === this.passwordTest) {
          alert("Login successful");
        }
         else {
          this.error = 'Password is Wrong';
        }
      }
       else {
          this.error = 'Email does not exist';
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

        // this.email.reset();
        // this.password.reset();

      }
    }



  }
