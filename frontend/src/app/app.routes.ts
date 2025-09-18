import { Routes } from '@angular/router';
import { managerGuard } from '../ManagerGuard/manager-guard';  
import { DashboardComponent } from './dashboard/dashboard';
import { ProductComponent } from './product-component/product-component';
import { Supplier } from './supplier/supplier';
import { LoginComponent } from './login-component/login-component';
import { AddUserComponent } from '../app/add-user/add-user';  
import { authGuard } from '../AuthGuard/auth-guard';  

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
    path: 'products',
    component: ProductComponent,
    canActivate: [managerGuard], 
  },
  {
    path: 'suppliers',
    component: Supplier,
    canActivate: [managerGuard],
  },
  {
    path: '**', 
    redirectTo: '/login',  
  }

];
