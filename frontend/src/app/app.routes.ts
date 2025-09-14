import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { LoginComponent } from './login-component/login-component';
import { AddUserComponent } from '../app/add-user/add-user';  
import { authGuard } from '../AuthGuard/auth-guard';  
import { managerGuard } from '../ManagerGuard/manager-guard';  

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
    path: 'add-user',
    component: AddUserComponent,
    canActivate: [authGuard, managerGuard],  
  },
  {
    path: '**', 
    redirectTo: '/login',  
  }
];
