import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoogleSigninCallbackComponent } from './google-sign-in-callback.component';

describe('GoogleSigninCallbackComponent', () => {
  let component: GoogleSigninCallbackComponent;
  let fixture: ComponentFixture<GoogleSigninCallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GoogleSigninCallbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoogleSigninCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
