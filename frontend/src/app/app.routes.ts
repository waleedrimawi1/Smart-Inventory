import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
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
    component: LoginComponent,  
  },
  {
    path: '**', 
    redirectTo: '/login',  
  }
];
