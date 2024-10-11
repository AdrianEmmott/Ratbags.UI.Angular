import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacebookSignInButtonComponent } from './facebook-sign-in-button.component';

describe('FacebookSignInButtonComponent', () => {
  let component: FacebookSignInButtonComponent;
  let fixture: ComponentFixture<FacebookSignInButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FacebookSignInButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FacebookSignInButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
