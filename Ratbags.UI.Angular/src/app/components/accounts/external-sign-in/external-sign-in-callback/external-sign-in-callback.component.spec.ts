import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalSigninCallbackComponent } from './external-sign-in-callback.component';

describe('ExternalSigninCallbackComponent', () => {
  let component: ExternalSigninCallbackComponent;
  let fixture: ComponentFixture<ExternalSigninCallbackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExternalSigninCallbackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalSigninCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
