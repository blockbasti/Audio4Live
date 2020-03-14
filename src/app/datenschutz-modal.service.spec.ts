import { TestBed } from '@angular/core/testing';

import { DatenschutzModalService } from './datenschutz-modal.service';

describe('DatenschutzModalService', () => {
  let service: DatenschutzModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatenschutzModalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
