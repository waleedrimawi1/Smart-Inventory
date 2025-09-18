import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface SupplierData {
  supplier_id: number;
  name: string;
  phone: string;
  address: string;
}

@Injectable({
  providedIn: 'root'
})
export class SupplierApiService {
  private apiUrl = 'http://localhost:3020/api/suppliers';

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

  getAllSuppliers(): Observable<SupplierData[]> {
    return this.http.get<SupplierData[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  createSupplier(supplier: any): Observable<SupplierData> {
    return this.http.post<SupplierData>(this.apiUrl, supplier, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateSupplier(id: number, supplier: any): Observable<SupplierData> {
    return this.http.put<SupplierData>(`${this.apiUrl}/${id}`, supplier, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteSupplier(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    return throwError(() => new Error('API request failed'));
  }
}
