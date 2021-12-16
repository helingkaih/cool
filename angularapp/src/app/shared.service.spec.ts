import { TestBed } from '@angular/core/testing';

import { SharedService } from './shared.service';

describe('SharedService', () => {
  let service: SharedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SharedService);
    console.log('service', service)
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
