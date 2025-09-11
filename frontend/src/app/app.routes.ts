import { Routes } from '@angular/router';
import { LoginComponent } from './login-component/login-component';
import { DashboardComponent } from './dashboard/dashboard';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard] 
  },
  { path: '**', redirectTo: '/login' }
];
