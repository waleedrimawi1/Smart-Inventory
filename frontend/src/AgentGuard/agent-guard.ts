import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../AuthService/auth-service';  

export const agentGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);  
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.getRole() === 'AGENT') {
    return true; 
  }

  router.navigate(['/unauthorized']);
  return false;  
};
