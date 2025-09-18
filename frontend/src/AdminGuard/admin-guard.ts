import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../AuthService/auth-service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    return this.activateAdmin();
  }

  // Method to check if current user is Admin
  activateAdmin(): boolean {
    const userRole = this.authService.getRole();
    
    if (userRole === 'ADMIN') {
      return true;
    }
    
    // Redirect non-admin users
    this.router.navigate(['/dashboard']);
    return false;
  }

  // Method to check Admin permissions for UI visibility
  static canAdminAccess(authService: AuthService): boolean {
    return authService.getRole() === 'ADMIN';
  }
}
