import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../AuthService/auth-service';

@Injectable({
  providedIn: 'root'
})
export class ManagerGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    return this.activateManager();
  }

  // Method to check if current user is Manager
  activateManager(): boolean {
    const userRole = this.authService.getRole();
    
    if (userRole === 'MANAGER') {
      return true;
    }
    
    return false;
  }

  // Method to check Manager permissions for UI visibility
  static canManagerAccess(authService: AuthService): boolean {
    return authService.getRole() === 'MANAGER';
  }
}
