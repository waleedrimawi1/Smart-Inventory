import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {}

  isLoggedIn(): boolean {
    return !!localStorage.getItem('user');  
  }

  getUser(): any {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }

  getRole(): string {
    const user = this.getUser();
    return user?.role || ''; 
  }
}
