import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountsLoginService } from '../../../services/account/accounts-login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  @Input() showForgotPassword: boolean = true;
  @Input() showRegister: boolean = true;
  @Input() redirectToHomePageAfterLogin: boolean = false;

  form: FormGroup;
  submitted = false;
  errorMessage: string | null = null;
  returnUrl: string = '/';

  constructor(private fb: FormBuilder,
    private loginService: AccountsLoginService,
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
          console.log(error);
        }
      });
  }
}
