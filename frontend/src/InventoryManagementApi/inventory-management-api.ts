import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryManagementApi {
    constructor(private http: HttpClient) { }


login(credentials: { email: string; password: string }) {
  return this.http.post<any>('http://localhost:3020/api/auth/login', credentials, { withCredentials: true });
 
}
}