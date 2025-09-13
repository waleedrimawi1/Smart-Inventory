import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard-component/dashboard-component';
import { LoginComponent } from './login-component/login-component';
import { authGuard } from '../AuthGuard/auth-guard';  // Import AuthGuard

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard], 
  },
  {
    path: 'login',
    component: LoginComponent,  // Login route for users to log in
  },
  {
    path: '**',  // Wildcard for undefined routes
    redirectTo: '/login',  // Redirect to login if route not found
  }
];
