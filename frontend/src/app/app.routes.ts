import { Routes } from '@angular/router';

import { ManagerGuard } from '../ManagerGuard/manager-guard';  
import { DashboardComponent } from './dashboard/dashboard';
import { ProductComponent } from './product-component/product-component';
import { Supplier } from './supplier/supplier';
import { CustomerComponent } from './customer/customer';
import { LoginComponent } from './login-component/login-component';
import { authGuard } from '../AuthGuard/auth-guard';  
import { PreordersComponent } from '../app/preorders/preorders';
import { AgentGuard } from '../AgentGuard/agent-guard';
import { AdminGuard } from '../AdminGuard/admin-guard';
import { UserManagementComponent } from './user-management/user-management';
import { O } from '@angular/cdk/keycodes';
import { OrderComponent } from './order-component/order-component';

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
  {
    path: 'customers',
    component: CustomerComponent,
    canActivate: [ManagerGuard],
  },
   { path: 'orders',
    component: OrderComponent,
    canActivate: [ManagerGuard]
  },
  
  {
    path: 'users',
    component: UserManagementComponent,
    canActivate: [ManagerGuard],
  },
  {
    path: '**', 
    redirectTo: '/unauthorized',  
  }

];
