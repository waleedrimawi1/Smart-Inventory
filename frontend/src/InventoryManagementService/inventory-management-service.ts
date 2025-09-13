import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { InventoryManagementApi } from '../InventoryManagementApi/inventory-management-api';

@Injectable({
  providedIn: 'root'
})
export class InventoryManagementService {

  constructor(private inventoryManagementApi: InventoryManagementApi) { }


  login(credentials: { email: string; password: string }): Observable<any> {
    return this.inventoryManagementApi.login(credentials);
  }

  
}
