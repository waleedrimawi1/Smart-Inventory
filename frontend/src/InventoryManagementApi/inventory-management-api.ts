import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryManagementApi {
    constructor(private http: HttpClient) { }

 chickEmailExists(email: string): Observable<boolean> {
    const params = new HttpParams().set('email', email);
    return this.http.get<boolean>('http://localhost:3020/api/auth/chickEmailExists', { params });
    
}

 login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>('http://localhost:3020/api/auth/login', credentials);
  }

}
