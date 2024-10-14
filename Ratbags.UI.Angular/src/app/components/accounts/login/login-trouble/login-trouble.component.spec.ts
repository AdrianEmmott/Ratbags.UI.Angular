import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginTroubleComponent } from './login-trouble.component';

describe('LoginTroubleComponent', () => {
  let component: LoginTroubleComponent;
  let fixture: ComponentFixture<LoginTroubleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginTroubleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginTroubleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
