import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../AuthService/auth-service'


interface Inventory {
  name: string;
  children?: Inventory[];
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

  childrenAccessor = (node: Inventory) => node.children ?? [];

  hasChild = (_: number, node: Inventory) => !!node.children && node.children.length > 0;
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
    this.role = this.authService.getRole();
    this.user = this.authService.getUser();
    if (this.role === 'MANAGER') {
      this.dataSource = ManagerSideBar;
    } else if (this.role === 'ADMIN') {
      this.dataSource = AdminSideBar;
    }else if (this.role === 'AGENT') {
      this.dataSource = AgentSideBar;
    } else{
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
      default:
        break;
    }
  }
}

const ManagerSideBar: Inventory[] = [
  { "name": "Home" },
  {
    "name": "Products",
    "children": [
      { "name": "Product List" },
      { "name": "Add Product" }
    ]
  },
  { "name": "Suppliers", "children": [{ "name": "Supplier List" }, { "name": "Add Supplier" }] },
  { "name": "Customers", "children": [{ "name": "Customer List" }, { "name": "Add Customer" }] },
  { "name": "Orders", "children": [{ "name": "Order List" }, { "name": "Add Order" }] },
  { "name": "Payments", "children": [{ "name": "Payment History" }, { "name": "Payment Schedule" }] },
  { "name": "Users", "children": [{ "name": "User Management" }, { "name": "Add User" }] },
  { "name": "Agent Visits", "children": [{ "name": "Agent Visit Logs" }, { "name": "Schedule Agent Visit" }] },
  { "name": "Reports", "children": [{ "name": "Sales Report" }, { "name": "Payment Summary" }] }
];

const AdminSideBar: Inventory[] = [
  { "name": "Home" },
  { "name": "Products", "children": [{ "name": "Product List" }, { "name": "Add Product" }] },
  { "name": "Customers", "children": [{ "name": "Customer List" }] },
  { "name": "Orders", "children": [{ "name": "Order List" }] },
  { "name": "Payments", "children": [{ "name": "Payment History" }, { "name": "Payment Schedule" }] },
  { "name": "Users", "children": [{ "name": "User Management" }] },
  { "name": "Agent Visits", "children": [{ "name": "Agent Visit Logs" }, { "name": "Schedule Agent Visit" }] },
  { "name": "Reports", "children": [{ "name": "Sales Report" }, { "name": "Payment Summary" }] }
];

const AgentSideBar: Inventory[] = [
  { "name": "Home" },
  { "name": "Products", "children": [{ "name": "Product List" }] },
  { "name": "Orders", "children": [{ "name": "Order List" }] },
  { "name": "Agent Visits", "children": [{ "name": "Agent Visit Logs" }] }
];




