import { TestBed } from '@angular/core/testing';

import { FocusManagementService } from './focus-management-service';

describe('FocusManagementService', () => {
  let service: FocusManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FocusManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
