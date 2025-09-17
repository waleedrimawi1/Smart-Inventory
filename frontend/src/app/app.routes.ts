import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard';
import { ProductComponent } from './product-component/product-component';
import { Supplier } from './supplier/supplier';
import { LoginComponent } from './login-component/login-component';
import { AddUserComponent } from '../app/add-user/add-user';  
import { authGuard } from '../AuthGuard/auth-guard';  
import { ManagerGuard } from '../ManagerGuard/manager-guard';  

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
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
    canActivate: [ManagerGuard],  
  },
  {
    path: 'products',
    component: ProductComponent,
    canActivate: [ManagerGuard], 
  },
  {
    path: 'suppliers',
    component: Supplier,
    canActivate: [ManagerGuard],
  },
  {
    path: '**', 
    redirectTo: '/login',  
  }
];
