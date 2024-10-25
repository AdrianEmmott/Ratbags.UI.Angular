import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RegisterService } from '../../../services/account/register.service';

import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  form: FormGroup;
  submitted = false;
  errorMessage: string | null = null;
  showPassword: boolean = false;
  registerSuccess: boolean = false;

  // icons
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private toastreService: ToastrService,
    private registerService: RegisterService) {
    this.form = new FormGroup(
      {
        firstName: new FormControl('', [Validators.required]),
        lastName: new FormControl('', [Validators.required]),
        email: new FormControl('', [Validators.required, Validators.email]),
        // password / confirm password controls/validation added by passwordConfirmation component
      }
    );
  }

  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.registerService
      .register(
        this.f['firstName'].value,
        this.f['lastName'].value,
        this.f['email'].value,
        this.f['password'].value)
      .subscribe({
        next: response => {
          this.registerSuccess = true;
          console.log('register confirm email url', response);
          this.router.navigate(['/register-confirm-email']);
        },
        error: error => {
          this.errorMessage = "An error occurred creating your account";
          this.toastreService.error("Sorry, there was an error creating your account");
          console.log(error);
        }
      });
  }

  onPasswordFormReady(passwordForm: FormGroup) {
    this.form.addControl('password', passwordForm.get('password'));
    this.form.addControl('confirmPassword', passwordForm.get('confirmPassword'));
  }

  togglePasswordVisibility(control: string) {
    this.showPassword = !this.showPassword;
  }
}
