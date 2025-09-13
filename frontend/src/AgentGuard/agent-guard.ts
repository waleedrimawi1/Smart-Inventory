import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../AuthService/auth-service';

@Injectable({
  providedIn: 'root'
})
export class AgentGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    return this.activateAgent();
  }

  // Method to check if current user is Agent
  activateAgent(): boolean {
    const userRole = this.authService.getRole();
    if (userRole === 'AGENT') {
      return true;
    }
    this.router.navigate(['/dashboard']);
    return false;
  }

  // Method to check Agent permissions for UI visibility
  static canAgentAccess(authService: AuthService): boolean {
    return authService.getRole() === 'AGENT';
  }
}
