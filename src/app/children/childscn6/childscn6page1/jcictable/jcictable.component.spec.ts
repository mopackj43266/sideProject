import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JcictableComponent } from './jcictable.component';

describe('JcictableComponent', () => {
  let component: JcictableComponent;
  let fixture: ComponentFixture<JcictableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JcictableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JcictableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
