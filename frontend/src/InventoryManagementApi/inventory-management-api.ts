import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderItem, Product } from '../models';
import { tap } from 'rxjs/operators';  

@Injectable({
  providedIn: 'root'
})
export class InventoryManagementApi {
    constructor(private http: HttpClient) { }

login(credentials: { email: string; password: string }) {
  return this.http.post<any>('http://localhost:3020/api/auth/login', credentials).pipe(
    tap((response) => {
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        console.log('Token stored in localStorage,response.token:', response.token);
        
      }
    })
  );
}




getProducts(): Observable<Product[]> {
  const token = localStorage.getItem('authToken');  
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`  
  });

  return this.http.get<Product[]>('http://localhost:3020/api/products', { headers });
}


addProduct(product: Product): Observable<Product> {
   const token = localStorage.getItem('authToken');  // Retrieve the token from localStorage
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`  // Include the token in the Authorization header
  });

  return this.http.post<Product>('http://localhost:3020/api/products/addProduct', product, { headers });

}

deleteProduct(productId: number): Observable<void> {
   const token = localStorage.getItem('authToken');  
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}` 
  });

  return this.http.delete<void>(`http://localhost:3020/api/products/deleteProduct/${productId}`, { headers });
}

updateProduct(product : Product): Observable<any> {
   const token = localStorage.getItem('authToken'); 
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`  
  });

  return this.http.put<any>(`http://localhost:3020/api/products/updateProduct`, product, { headers });
}


getOrders(): Observable<Order[]> {
  const token = localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  return this.http.get<Order[]>(`http://localhost:3020/api/orders/getOrders`, { headers });
}

addOrder(order: Order): Observable<Order> {
  const token = localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  return this.http.post<Order>(`http://localhost:3020/api/orders/addOrder`, order, { headers });


}

updateOrderStatusAndType(order : Order): Observable<Order> {
  const token = localStorage.getItem('authToken');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });


  return this.http.put<Order>(`http://localhost:3020/api/orders/updateStatusAndType`, order, { headers });
}
}