import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common'; // For ngClass

@Component({
  standalone: true,
  selector: 'app-add-user',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-user.html',
  styleUrls: ['./add-user.css']
})
export class AddUserComponent {
  addUserForm: FormGroup;
  roles = ['Admin', 'User', 'Manager']; // List of roles

  constructor(private fb: FormBuilder) {
    this.addUserForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', [Validators.required]],
      role: ['', Validators.required]  // Ensuring role is required
    });
  }
    get username() {
    return this.addUserForm.get('username');
  }

  onSubmit() {
    if (this.addUserForm.valid) {
      console.log('Form submitted:', this.addUserForm.value);
    } else {
      console.log('Form is invalid');
    }
  }                

  

}
