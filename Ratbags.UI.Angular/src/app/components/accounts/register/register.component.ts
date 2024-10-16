import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountsRegisterService } from '../../../services/account/accounts-register.service';

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

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private toastreService: ToastrService,
    private registerService: AccountsRegisterService) {
    this.form = new FormGroup(
      {
        email: new FormControl('', [Validators.required, Validators.email]),
        // password / confirm password controls/validation added by passwordConfirmation component
      }
    );
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

    this.registerService
      .register(this.f['email'].value, this.f['password'].value)
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
