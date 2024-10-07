import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../../../services/account.service'; // Create an AuthService to handle the API call
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  @Input() showForgotPassword: boolean = true;
  @Input() showRegister: boolean = true;

  form: FormGroup;
  submitted = false;
  errorMessage: string | null = null;
  returnUrl: string = '/';

  constructor(private fb: FormBuilder,
    private authService: AccountService,
    private router: Router,
    private route: ActivatedRoute) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.route.queryParams
      .subscribe({
        next: params => {
          this.returnUrl = params['returnUrl'] || '/';
        }
      });
  }

  // form controls
  get f() {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    // Call the AuthService to send the login request
    this.authService.login(this.f['email'].value, this.f['password'].value)
      .subscribe({
        next: response => {
          console.log(response);
          this.router.navigate([this.returnUrl]);
        },
        error: error => {
          console.log(error);
        }
      });
  }
}
