import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface UserData {
  id?: number;
  fullName: string;
  email: string;
  password?: string;
  phone: string;
  role: {
    id: number;
    name: string;
  };
}

export interface UserCreateRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  role: string;
}

export interface UserUpdateRequest {
  fullName: string;
  email: string;
  password?: string;
  phone: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  private apiUrl = 'http://localhost:3020/api/users';

  constructor(private http: HttpClient) { }

  // Method to get the stored token
  private getAuthToken(): string | null {
    return localStorage.getItem('authToken');
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

  // Error handling method
  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    return throwError(() => error);
  }

  getAllUsers(): Observable<UserData[]> {
    return this.http.get<UserData[]>(this.apiUrl, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getUserById(id: number): Observable<UserData> {
    return this.http.get<UserData>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  getUsersByRole(roleName: string): Observable<UserData[]> {
    return this.http.get<UserData[]>(`${this.apiUrl}/role/${roleName}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  createUser(userData: UserCreateRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, userData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  updateUser(id: number, userData: UserUpdateRequest): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, userData, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(catchError(this.handleError));
  }
}