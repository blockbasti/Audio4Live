import { TestBed } from '@angular/core/testing';

import { DatenschutzModalServiceService } from './datenschutz-modal-service.service';

describe('DatenschutzModalServiceService', () => {
  let service: DatenschutzModalServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatenschutzModalServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
