import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(private router: Router) {}

  getCurrentUser() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }

  getUserRole(): string | null {
    const user = this.getCurrentUser();
    return user ? user.role : null;
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  isManager(): boolean {
    return this.getUserRole() === 'MANAGER';
  }

  isAdmin(): boolean {
    return this.getUserRole() === 'ADMIN';
  }

  isAgent(): boolean {
    return this.getUserRole() === 'AGENT';
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}
