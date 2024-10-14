import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-password-confirmation',
  templateUrl: './password-confirmation.component.html',
  styleUrl: './password-confirmation.component.scss'
})
export class PasswordConfirmationComponent implements OnInit {
  @Output() formReady = new EventEmitter<FormGroup>();

  passwordConfirmationForm: FormGroup | any;
  showPassword: boolean = false;

  // icons
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  get f() {
    return this.passwordConfirmationForm.controls;
  }

  constructor(private formBuilder: FormBuilder) {

  }

  ngOnInit() {
    this.passwordConfirmationForm = new FormGroup(
      {
        password: new FormControl('',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d)(?=.*[!@#$%^&*]).{8,}$/)
          ]),

        confirmPassword: new FormControl('',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d)(?=.*[!@#$%^&*]).{8,}$/)
          ]),
      },
      {
        validators: this.confirmPasswordsMatchValidator,
      }
    );

    this.passwordConfirmationForm.updateValueAndValidity();

    this.formReady.emit(this.passwordConfirmationForm);

  }

  confirmPasswordsMatchValidator(control: AbstractControl) {
    return control.get('password')?.value === control.get('confirmPassword')?.value ?
      null : { mismatch: true };
  }

  // confirmPasswordValidator seems wobbly when passing entire form to a parent component
  // - so fire this on keyup of the textboxes
  triggerPasswordMatchValidation() {
    this.passwordConfirmationForm.updateValueAndValidity();
  }

  togglePasswordVisibility(control: string) {
    this.showPassword = !this.showPassword;
  }
}
