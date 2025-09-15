import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../AuthService/auth-service';
import { AdminGuard } from '../../AdminGuard/admin-guard';
import { ManagerGuard } from '../../ManagerGuard/manager-guard';
import { AgentGuard } from '../../AgentGuard/agent-guard';
import { PreordersComponent } from '../preorders/preorders';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, PreordersComponent],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  user: any = {};
  role: string | null = null;
  sidebarCollapsed = false;
  currentView = 'home'; // Default view

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadUserInfo();
  }

  loadUserInfo() {
    this.user = this.authService.getUser();
    this.role = this.authService.getRole();
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  logout() {
    this.authService.logout();
  }

  // Set current view instead of navigation
  setCurrentView(view: string) {
    this.currentView = view;
  }

  // Permission methods
  canManagerAccess(): boolean {
    return ManagerGuard.canManagerAccess(this.authService);
  }

  canAdminAccess(): boolean {
    return AdminGuard.canAdminAccess(this.authService);
  }

  canAgentAccess(): boolean {
    return AgentGuard.canAgentAccess(this.authService);
  }

  // Helper methods for welcome page
  getCurrentDate(): string {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getLastLoginTime(): string {
    return '2 hours ago';
  }
}