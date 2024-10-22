import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsavedChangesPromptComponent } from './unsaved-changes-prompt.component';

describe('UnsavedChangesPromptComponent', () => {
  let component: UnsavedChangesPromptComponent;
  let fixture: ComponentFixture<UnsavedChangesPromptComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UnsavedChangesPromptComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnsavedChangesPromptComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
