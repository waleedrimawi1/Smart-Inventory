import { TestBed } from '@angular/core/testing';

import { InventoryManagementApi } from './inventory-management-api';

describe('InventoryManagementApi', () => {
  let service: InventoryManagementApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryManagementApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
