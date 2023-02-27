import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Childscn21Component } from './childscn21.component';

describe('Childscn21Component', () => {
  let component: Childscn21Component;
  let fixture: ComponentFixture<Childscn21Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Childscn21Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Childscn21Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
