import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  user: any = {};
  role: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.loadUserInfo();
  }

  loadUserInfo() {
    this.user = this.authService.getCurrentUser();
    this.role = this.authService.getUserRole();
    console.log('Dashboard loaded for user:', this.user);
  }

  logout() {
    this.authService.logout();
  }

  // Navigation methods for Manager
  navigateToSystemSettings() {
    // Will implement after creating the component
    console.log('Navigate to System Settings');
  }

  navigateToInventoryManagement() {
    console.log('Navigate to Inventory Management');
  }

  navigateToReports() {
    console.log('Navigate to Reports');
  }

  // Navigation methods for Admin
  navigateToPendingOrders() {
    console.log('Navigate to Pending Orders');
  }

  navigateToOrderApproval() {
    console.log('Navigate to Order Approval');
  }

  // Navigation methods for Agent
  navigateToPreorders() {
    console.log('Navigate to Preorders');
  }

  navigateToFinalOrders() {
    console.log('Navigate to Final Orders');
  }

  navigateToPaymentCollection() {
    console.log('Navigate to Payment Collection');
  }
}
