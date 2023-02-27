import { ComponentFixture, TestBed } from '@angular/core/testing';

import { F03018addComponent } from './f03018add.component';

describe('F03018addComponent', () => {
  let component: F03018addComponent;
  let fixture: ComponentFixture<F03018addComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ F03018addComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(F03018addComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
