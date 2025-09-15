import { Routes } from '@angular/router';
import { LoginComponent } from './login-component/login-component';
import { DashboardComponent } from './dashboard/dashboard';
import { authGuard } from '../AuthGuard/auth-guard';
import { PreordersComponent } from './preorders/preorders';
import { AgentGuard } from '../AgentGuard/agent-guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard] 
  },
  {
    path: 'agent/preorders',
    component: PreordersComponent,
    canActivate: [authGuard, AgentGuard]
  },
  { path: '**', redirectTo: '/dashboard' }
];
