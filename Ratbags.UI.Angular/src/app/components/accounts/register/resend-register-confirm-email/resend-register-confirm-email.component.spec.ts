import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResendRegisterConfirmEmailComponent } from './resend-register-confirm-email.component';

describe('ResendRegisterConfirmEmailComponent', () => {
  let component: ResendRegisterConfirmEmailComponent;
  let fixture: ComponentFixture<ResendRegisterConfirmEmailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResendRegisterConfirmEmailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResendRegisterConfirmEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
