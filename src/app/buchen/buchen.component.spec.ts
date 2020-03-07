import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuchenComponent } from './buchen.component';

describe('BuchenComponent', () => {
  let component: BuchenComponent;
  let fixture: ComponentFixture<BuchenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuchenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuchenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
