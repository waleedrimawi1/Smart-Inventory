import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface CustomerData {
  customer_id: number;
  name: string;
  phone: string;
  address: string;
  currentBalance: number;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerApiService {
  private apiUrl = 'http://localhost:3020/api/customers';

  constructor(private http: HttpClient) {}

  // Method to get the stored token
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken'); // Replace with your token storage method
  }

  // Helper to add the Authorization header
  private getHeaders(): HttpHeaders {
    const token = this.getAuthToken();
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getAllCustomers(): Observable<CustomerData[]> {
    return this.http.get<CustomerData[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  createCustomer(customer: Omit<CustomerData, 'customer_id'>): Observable<CustomerData> {
    return this.http.post<CustomerData>(this.apiUrl, customer, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateCustomer(id: number, customer: Omit<CustomerData, 'customer_id'>): Observable<CustomerData> {
    return this.http.put<CustomerData>(`${this.apiUrl}/${id}`, customer, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    return throwError(() => new Error('API request failed'));
  }
}
