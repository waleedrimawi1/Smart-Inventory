import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../AuthService/auth-service';

interface Product {
  id: number;
  name: string;
  price: number;
  stockQuantity: number;
}

interface PreorderItem {
  productId: number;
  productName: string;
  price: number;
  quantity: number;
  total: number;
}

interface Customer {
  id: number;
  name: string;
  address: string;
  phone: string;
}

@Component({
  selector: 'app-preorders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './preorders.html',
  styleUrls: ['./preorders.css']
})
export class PreordersComponent implements OnInit {
  customers: Customer[] = [];
  products: Product[] = [];
  selectedCustomer: Customer | null = null;
  preorderItems: PreorderItem[] = [];
  selectedProductId: number = 0;
  selectedQuantity: number = 1;
  totalAmount: number = 0;
  agentId: number = 0;

  constructor(
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.loadAgentData();
    this.loadCustomers();
    this.loadProducts();
  }

  loadAgentData() {
    const user = this.authService.getUser();
    this.agentId = user?.id || 0;
  }

  loadCustomers() {
    this.customers = [
      { id: 1, name: 'Al-Rashid Store', address: 'Main Street 123', phone: '0123456789' },
      { id: 2, name: 'City Mart', address: 'Second Street 456', phone: '0987654321' },
      { id: 3, name: 'Corner Shop', address: 'Third Avenue 789', phone: '0555666777' },
      { id: 4, name: 'Family Market', address: 'Fourth Road 101', phone: '0444555666' }
    ];
  }

  loadProducts() {
    this.products = [
      { id: 1, name: 'Rice 5kg', price: 25.50, stockQuantity: 100 },
      { id: 2, name: 'Sugar 2kg', price: 8.75, stockQuantity: 200 },
      { id: 3, name: 'Oil 1L', price: 12.00, stockQuantity: 150 },
      { id: 4, name: 'Flour 10kg', price: 35.00, stockQuantity: 80 },
      { id: 5, name: 'Tea Boxes', price: 15.25, stockQuantity: 120 },
      { id: 6, name: 'Coffee 500g', price: 22.50, stockQuantity: 90 }
    ];
  }

  selectCustomer(customer: Customer) {
    this.selectedCustomer = customer;
  }

  getSelectedProduct(): Product | null {
    return this.products.find(p => p.id === this.selectedProductId) || null;
  }

  addToPreorder() {
    if (this.selectedProductId === 0 || this.selectedQuantity <= 0) {
      alert('Please select a product and enter valid quantity');
      return;
    }

    const product = this.getSelectedProduct();
    if (!product) {
      alert('Please select a valid product');
      return;
    }

    if (this.selectedQuantity > product.stockQuantity) {
      alert(`Only ${product.stockQuantity} items available in stock`);
      return;
    }

    // Check if product already exists in preorder
    const existingItem = this.preorderItems.find(item => item.productId === this.selectedProductId);
    
    if (existingItem) {
      existingItem.quantity += this.selectedQuantity;
      existingItem.total = existingItem.quantity * existingItem.price;
    } else {
      const newItem: PreorderItem = {
        productId: product.id,
        productName: product.name,
        price: product.price,
        quantity: this.selectedQuantity,
        total: product.price * this.selectedQuantity
      };
      this.preorderItems.push(newItem);
    }

    this.calculateTotal();
    this.resetForm();
  }

  removeFromPreorder(index: number) {
    this.preorderItems.splice(index, 1);
    this.calculateTotal();
  }

  updateQuantity(index: number, newQuantity: number) {
    if (newQuantity <= 0) {
      this.removeFromPreorder(index);
      return;
    }

    const item = this.preorderItems[index];
    const product = this.products.find(p => p.id === item.productId);
    
    if (product && newQuantity > product.stockQuantity) {
      alert(`Only ${product.stockQuantity} items available in stock`);
      return;
    }

    item.quantity = newQuantity;
    item.total = item.price * item.quantity;
    this.calculateTotal();
  }

  calculateTotal() {
    this.totalAmount = this.preorderItems.reduce((sum, item) => sum + item.total, 0);
  }

  resetForm() {
    this.selectedProductId = 0;
    this.selectedQuantity = 1;
  }

  submitPreorder() {
    if (!this.selectedCustomer) {
      alert('Please select a customer');
      return;
    }

    if (this.preorderItems.length === 0) {
      alert('Please add at least one item to the preorder');
      return;
    }

    const preorderData = {
      customerId: this.selectedCustomer.id,
      customerName: this.selectedCustomer.name,
      agentId: this.agentId,
      items: this.preorderItems,
      totalAmount: this.totalAmount,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
      agentName: this.authService.getUser()?.fullName || 'Unknown Agent'
    };

    console.log('Preorder submitted:', preorderData);
    
    // Here you would send to API
    // this.preorderService.createPreorder(preorderData).subscribe(...)
    
    alert('✅ Preorder submitted successfully!\nIt will be sent to admin for approval.');
    this.clearPreorder();
  }

  clearPreorder() {
    this.selectedCustomer = null;
    this.preorderItems = [];
    this.totalAmount = 0;
    this.resetForm();
  }
}
