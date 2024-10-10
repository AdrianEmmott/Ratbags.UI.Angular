import { Component, OnInit } from '@angular/core';
import { AccountsRegisterService } from '../../../services/account/accounts-register.service';
import { AbstractControl, AbstractControlOptions, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';

import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  errorMessage: string | null = null;
  showPassword: boolean = false;
  registerSuccess: boolean = false;

  // icons
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  constructor(private formBuilder: FormBuilder,
    private registerService: AccountsRegisterService) {
    this.form = new FormGroup(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=[^A-Z]*[A-Z])(?=[^a-z]*[a-z])(?=\D*\d)(?=.*[!@#$%^&*]).{8,}$/)]),
        confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      },
      {
        validators: this.confirmPasswordValidator,
      }
    );
  }

  confirmPasswordValidator(control: AbstractControl) {
    return control.get('password')?.value === control.get('confirmPassword')?.value ?
      null : { mismatch: true };
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit() {
    
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.registerService.register(this.f['email'].value, this.f['password'].value)
      .subscribe({
        next: response => {
          this.registerSuccess = true;
        },
        error: error => {
          this.errorMessage = "An error occured creating your account";
          console.log(error);
        }
      });
  }

  togglePasswordVisibility(control: string) {
    this.showPassword = !this.showPassword;
  }
}
