import { Routes } from '@angular/router';

import { ManagerGuard } from '../ManagerGuard/manager-guard';  
import { DashboardComponent } from './dashboard/dashboard';
import { ProductComponent } from './product-component/product-component';
import { Supplier } from './supplier/supplier';
import { LoginComponent } from './login-component/login-component';
import { AddUserComponent } from '../app/add-user/add-user';  
import { authGuard } from '../AuthGuard/auth-guard';  
import { PreordersComponent } from '../app/preorders/preorders';
import { AgentGuard } from '../AgentGuard/agent-guard';
import { OrderComponent } from '../app/order-component/order-component' // Adjust the import path if needed
export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard], 
  },
  {
    path: 'login',
    component: LoginComponent,  
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
   {path: 'orders',
    component: OrderComponent,
    canActivate: [ManagerGuard]
  },
  
  {
    path: '**', 
    redirectTo: '/unauthorized',  
  }

];
