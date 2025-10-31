export interface Product {
  productId?: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  category: string;
  supplierId: number;

}

export interface Order {
  orderId?: number;
  customerId: number;
  agentId: number;
  orderDate: string;
  deliveryDate: string;
  status: string;
  orderType: string;
  totalAmount: number;
  orderItems: OrderItem[]; 
}

export interface OrderItem {
  orderId: number;
  orderItemId?: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Customer {
  customerId: number;
  name: string;
  phone: string;
  address: string;
}

export interface OrderDialogData {
  products: Product[];
  customers: Customer[];
  agents: User[];
}




export interface User {
  id?: number;
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  roleId: number;
}




