import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth'; // No .service suffix

export const agentGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.isAgent()) {
    return true;
  }
  
  if (authService.isLoggedIn()) {
    router.navigate(['/dashboard']);
  } else {
    router.navigate(['/login']);
  }
  return false;
};
