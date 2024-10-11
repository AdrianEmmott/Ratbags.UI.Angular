import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountsLoginService } from '../../../services/account/accounts-login.service';

import { faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { ExternalSigninService } from '../../../services/account/external-signin.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  @Input() showForgotPassword: boolean = true;
  @Input() showRegister: boolean = true;
  @Input() redirectToHomePageAfterLogin: boolean = false;
  
  @Input() showExternalSigninButtons: boolean = false;
  @Input() showExternalSigninLink: boolean = false;

  form: FormGroup;
  submitted = false;
  showPassword: boolean = false;
  errorMessage: string | null = null;
  returnUrl: string = '/';

  // icons
  faEye = faEye;
  faEyeSlash = faEyeSlash;

  constructor(private fb: FormBuilder,
    private loginService: AccountsLoginService,
    private externalSigninService: ExternalSigninService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get f() {
    return this.form.controls;
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe({
        next: params => {
          this.returnUrl = params['returnUrl'] || '/';
        }
      });
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    this.loginService.login(this.f['email'].value, this.f['password'].value)
      .subscribe({
        next: response => {
          if (this.redirectToHomePageAfterLogin) {
            this.router.navigate(['/']);
          }

          if (this.returnUrl !== '/') {
            this.router.navigate([this.returnUrl]);
          }

          this.toastr.success('Logged in as ' + this.f['email'].value);
        },
        error: error => {
          this.toastr.error('Sorry, there was an error logging in. Please check your credentials and try again');
        }
      });
  }

  togglePasswordVisibility(control: string) {
    this.showPassword = !this.showPassword;
  }

  facebookExternalSignin(providerName: string) {
    this.externalSigninService.signin(providerName);
  }
}
