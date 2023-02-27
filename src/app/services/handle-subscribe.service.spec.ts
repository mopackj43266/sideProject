import { TestBed } from '@angular/core/testing';

import { HandleSubscribeService } from './handle-subscribe.service';

describe('HandleSubscribeService', () => {
  let service: HandleSubscribeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HandleSubscribeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
