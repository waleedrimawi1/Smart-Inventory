import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../AuthService/auth-service'



interface Inventory {
  name: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatTreeModule, MatButtonModule, MatIconModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent {
  role: string = '';
  user: any = {};
  dataSource: Inventory[] = [];

  childrenAccessor = (node: Inventory) => [];

  hasChild = (_: number, node: Inventory) => false;
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.role = this.authService.getRole();
    this.user = this.authService.getUser();
    if (this.role === 'MANAGER') {
      this.dataSource = ManagerSideBar;
    } else if (this.role === 'ADMIN') {
      this.dataSource = AdminSideBar;
    } else if (this.role === 'AGENT') {
      this.dataSource = AgentSideBar;
    } else {
      console.log('Role is undefined or invalid');

    }

  }



  onItemClick(itemName: string) {
    switch (itemName) {
      case 'Home':
        this.router.navigate(['']);
        break;
      case 'Products':
        this.router.navigate(['/products']);
        break;
      case 'Suppliers':
        this.router.navigate(['/suppliers']);
        break;
      case 'Orders':
        this.router.navigate(['/orders']);
        break;
      case 'Payments':
        this.router.navigate(['/payments']);
        break;
      case 'Users':
        this.router.navigate(['/users']);
        break;
      case 'Agent Visits':
        this.router.navigate(['/agent-visits']);
        break;
      case 'Reports':
        this.router.navigate(['/reports']);
        break;
      case 'Logout':
        this.authService.logout();
        break;
      default:
        break;
    }
  }
}

const ManagerSideBar: Inventory[] = [
  { "name": "Home" },
  { "name": "Products" },
  { "name": "Suppliers" },
  { "name": "Customers" },
  { "name": "Orders" },
  { "name": "Payments" },
  { "name": "Users" },
  { "name": "Agent Visits" },
  { "name": "Reports" },
  { "name": "Logout" }
];

const AdminSideBar: Inventory[] = [
  { "name": "Home" },
  { "name": "Products" },
  { "name": "Customers" },
  { "name": "Orders" },
  { "name": "Payments" },
  { "name": "Users" },
  { "name": "Agent Visits" },
  { "name": "Reports" },
  { "name": "Logout" }

];

const AgentSideBar: Inventory[] = [
  { "name": "Home" },
  { "name": "Products" },
  { "name": "Orders" },
  { "name": "Agent Visits" },
  { "name": "Logout" }

];




