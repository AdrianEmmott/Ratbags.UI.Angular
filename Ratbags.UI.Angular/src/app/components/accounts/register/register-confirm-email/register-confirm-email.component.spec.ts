import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterConfirmEmailComponent } from './register-confirm-email.component';

describe('RegisterConfirmEmailComponent', () => {
  let component: RegisterConfirmEmailComponent;
  let fixture: ComponentFixture<RegisterConfirmEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterConfirmEmailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterConfirmEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
