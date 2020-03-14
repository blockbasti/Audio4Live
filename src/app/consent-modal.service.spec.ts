import { TestBed } from '@angular/core/testing';

import { ConsentModalService } from './consent-modal.service';

describe('ConsentModalService', () => {
  let service: ConsentModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsentModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
