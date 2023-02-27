import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Childscn11page6Component } from './childscn11page6.component';

describe('Childscn11page6Component', () => {
  let component: Childscn11page6Component;
  let fixture: ComponentFixture<Childscn11page6Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Childscn11page6Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Childscn11page6Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
