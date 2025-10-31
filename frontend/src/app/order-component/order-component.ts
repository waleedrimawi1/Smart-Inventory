import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataSource } from '@angular/cdk/collections';
import { Observable, ReplaySubject } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { DashboardComponent } from '../dashboard/dashboard';
import { OrderDialogComponent } from './order-dialog/order-dialog';
import { ConfirmDialogComponent } from '../supplier/confirm-dialog/confirm-dialog';
import { OrderItemDialogComponent } from './orderItem-dialog/orderItem-dialog';
import { CdkTableModule } from '@angular/cdk/table';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { Product,Order,OrderItem,Customer,User} from '../../models';
import { InventoryManagementService } from '../../InventoryManagementService/inventory-management-service';


@Component({
  standalone: true,
  selector: 'app-order-component',
  imports: [CommonModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTooltipModule,
    FormsModule,
    DashboardComponent,
    CdkTableModule
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({
        height: '0px',
        minHeight: '0',
        visibility: 'hidden',
      })),
      state('expanded', style({
        height: '*',
        visibility: 'visible',
      })),
      transition('expanded <=> collapsed', animate('300ms ease-in-out')),
    ]),
  ],

  templateUrl: './order-component.html',
  styleUrl: './order-component.css'
})

export class OrderComponent {

  columnsToDisplay: string[] = ['orderId', 'customerId', 'agentId', 'orderDate', 'deliveryDate', 'status', 'orderType'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay,'totalAmount', 'approve', 'actions'];
  columnLabels: { [key: string]: string } = {
  orderId: 'Order ID',
  customerId: 'Customer ID',
  agentId: 'Agent ID',
  orderDate: 'Order Date',
  deliveryDate: 'Delivery Date',
  status: 'Status',
  orderType: 'Order Type',
};
  product: Product[] = [];
  expandedElement: Order | null = null;
  orderItemDisplayedColumns: string[] = ['orderItem_id', 'product_id', 'quantity', 'unit_price', 'total_price', 'actions'];
  products: Product[] = [];
  orders: Order[] = [];
  constructor(public dialog: MatDialog,
    private inventoryManagementService: InventoryManagementService) { }

  filteredOrders: Order[] = [];
  searchTerm: string = '';

  customers: Customer[] = [
    { customerId: 4, name: 'Customer A', phone: '123-456-7890', address: '123 Main St' },
    { customerId: 5, name: 'Customer B', phone: '987-654-3210', address: '456 Elm St' },
    { customerId: 6, name: 'Customer C', phone: '555-555-5555', address: '789 Oak St' } 
  ];

  agents: User[] = [
  { id: 5, fullName: 'Agent X', email: 'agentX@example.com', password: 'secret', phone: '123-456-7890', roleId: 3 },
  { id: 6, fullName: 'Agent Y', email: 'agentY@example.com', password: 'secret', phone: '234-567-8901', roleId: 3 },
  { id: 7, fullName: 'Agent Z', email: 'agentZ@example.com', password: 'secret', phone: '345-678-9012', roleId: 3 },
  { id: 8, fullName: 'Agent W', email: 'agentW@example.com', password: 'secret', phone: '456-789-0123', roleId: 3 },
  { id: 9, fullName: 'Agent V', email: 'agentV@example.com', password: 'secret', phone: '567-890-1234', roleId: 3 }
];

orderTypes: string[] = ['Preorder', 'Regular Order'];

statuses: { [key: string]: string[] } = {
  'Preorder': ['Pending', 'Approved', 'Cancelled'],
  'Regular Order': ['Processing', 'Delivered', 'Cancelled']
};
  ngOnInit() {
    this.fetchOrders();
    this.fetchProducts();
  }




  toggleOrderItems(order: Order): void {
    this.expandedElement = this.expandedElement === order ? null : order;
  }

  applyFilter() {
    const term = this.searchTerm.trim().toLowerCase();
    this.filteredOrders = this.orders.filter(order =>
      order?.orderId?.toString().includes(term) ||
      order.customerId.toString().includes(term) ||
      order.agentId.toString().includes(term) ||
      order.orderDate.toLowerCase().includes(term) ||
      order.deliveryDate.toLowerCase().includes(term) ||
      order.status.toLowerCase().includes(term) ||
      order.orderType.toLowerCase().includes(term) ||
      order.totalAmount.toString().includes(term)
    );
    
  }



openAddOrderDialog() {
  const dialogRef = this.dialog.open(OrderDialogComponent, {
    width: '600px',
    maxWidth: '90vw',
    data: { 
      products: this.products, 
      customers: this.customers, 
      agents: this.agents
    }
  });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.updateStockQuantity(result.items);
        const orderItems = this.addOrderItems(result.orderId, result.items);

        const newOrder: Order = {
          customerId: result.customerId,
          agentId: result.agentId,
          status: "Pending",
          orderType: "Preorder",
          orderDate: new Date().toISOString().split('T')[0], // current date
          deliveryDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0], // one week later
          totalAmount: 0, // will be calculated in backend
          orderItems: orderItems
        };
        this.inventoryManagementService.addOrder(newOrder).subscribe(
          (response) => {
            const order = response; // Update with response from backend
            console.log('Order added successfully:', order);
            this.orders.push(order);
            this.filteredOrders = [...this.orders];
            this.applyFilter(); 
          },
          (error) => {
            console.error('Failed to add order:', error);
          }
        );

      }
    });
  }

addOrderItems(orderId: number, items: { productId: number; quantity: number }[]): OrderItem[] {
  const orderItems: OrderItem[] = [];

  items.forEach(item => {
    const product = this.products.find(p => p.productId === item.productId);
    if (product) {
      const unitPrice = product.price * 1.15; // 15% markup snapshot

      const newOrderItem: OrderItem = {
        orderId: orderId,
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: unitPrice,
        totalPrice: item.quantity * unitPrice
      };

      orderItems.push(newOrderItem);
    }
  });

  return orderItems;
}



  updateStockQuantity(items: { productId: number; quantity: number }[]) {
    items.forEach(item => {
      const product = this.products.find(p => p.productId === item.productId);
      if (product) {
        product.stockQuantity -= item.quantity;
      }
    });
  }


  deleteOrder(order: Order) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete Order',
        message: `Would you like to delete order ${order.orderId}?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // User confirmed deletion
        this.performDelete(order);
      }
    });
  }

  performDelete(order: Order) {
    const index = this.orders.findIndex(o => o.orderId === order.orderId);
    if (index !== -1) {
      this.orders.splice(index, 1);
      this.applyFilter();
    }
  }
  isExpanded(element: Order) {
    return this.expandedElement === element;
  }

  toggle(element: Order) {
    this.expandedElement = this.isExpanded(element) ? null : element;
  }

 editOrderItem(item: OrderItem) {
  const dialogRef = this.dialog.open(OrderItemDialogComponent, {
    width: '600px',
    maxWidth: '90vw',
    data: { 
      products: this.products,  
      OrderItem : item                
    }
  });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle the updated order item here
        console.log('Updated order item:', result);
      }
    }); 
  }

  cancelOrder(order : Order){

  }




  deleteOrderItem(item: OrderItem) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Delete Order Item',
        message: `Would you like to delete order item ${item.orderItemId}?`,
        confirmText: 'Delete',
        cancelText: 'Cancel'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === true) {
        // User confirmed deletion
     //   this.performDeleteOrderItem(item);
        
      }
    });
  }

  // performDeleteOrderItem(item: OrderItem) {
  //   const index = this.orderItems.findIndex(oi => oi.orderItemId === item.orderItemId);
  //   if (index !== -1) {
  //     this.orderItems.splice(index, 1);
  //     this.applyFilter();
  //   }
  // }

  approveOrder(order: Order) {
    if(order.orderType === 'Preorder'){
      order.orderType = 'Regular Order';
      order.status = 'Processing';
    } 
    this.inventoryManagementService.updateOrderStatusAndType(order).subscribe(
      (response) => {
        console.log('Order status and type updated successfully:', response);
        const index = this.orders.findIndex(o => o.orderId === order.orderId);      
        if (index !== -1) { 
          this.orders[index] = response;
          this.filteredOrders = [...this.orders];
        }
        this.applyFilter(); 
      },
      (error) => {
        console.error('Failed to update order status and type:', error);
      }
    );
    
  }

  fetchProducts() {
    this.inventoryManagementService.getProducts().subscribe(
      (response) => {
        console.log('Products fetched successfully:', response);
        this.products = response;

      },
      (error) => {
        console.error('Failed to fetch products:', error);
      }
    );
  }

  fetchOrders() {
    this.inventoryManagementService.getOrders().subscribe(
      (response) => {
        this.orders = response;
        console.log('Orders fetched successfully:', this.orders);
        this.filteredOrders = [...this.orders];
      },
      (error) => {
        console.error('Failed to fetch orders:', error);
      }
    );
  }
}




