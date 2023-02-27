import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Childscn10page4Component } from './childscn10page4.component';

describe('Childscn10page4Component', () => {
  let component: Childscn10page4Component;
  let fixture: ComponentFixture<Childscn10page4Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Childscn10page4Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Childscn10page4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
