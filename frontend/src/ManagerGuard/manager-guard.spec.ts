import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { ManagerGuard } from './manager-guard';

describe('managerGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => ManagerGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
