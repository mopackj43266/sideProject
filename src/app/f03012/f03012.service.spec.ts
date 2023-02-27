import { TestBed } from '@angular/core/testing';

import { F03012Service } from './f03012.service';

describe('F03012Service', () => {
  let service: F03012Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(F03012Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
