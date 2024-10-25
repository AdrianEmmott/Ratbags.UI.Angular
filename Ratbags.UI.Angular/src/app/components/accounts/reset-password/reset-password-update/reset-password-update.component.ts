import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { ResetPasswordService } from '../../../../services/account/reset-password.service';

@Component({
  selector: 'app-reset-password-update',
  templateUrl: './reset-password-update.component.html',
  styleUrl: './reset-password-update.component.scss'
})
export class ResetPasswordUpdateComponent implements OnInit {
  form: FormGroup;
  userId: string | undefined;
  token: string | undefined;
  passwordResetSuccess: boolean = false;

  get f() {
    return this.form.controls;
  }

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private resetPasswordService: ResetPasswordService) {
    this.form = new FormGroup({
      userId: new FormControl(this.userId, [Validators.required]),
      token: new FormControl(this.token, [Validators.required]),
    });
  }

  ngOnInit() {
    this.route.params
      .subscribe({
        next: params => {
          this.userId = params['user-id'];
          this.token = params['token'];

          this.f['userId'].setValue(this.userId);
          this.f['token'].setValue(this.token);
        }
      });
  }

  onSubmit() {
    if (this.userId && this.token) {
      this.resetPasswordService
        .update(this.userId, this.token, this.f['password'].value)
        .subscribe({
          next: (result: boolean) => {
            this.passwordResetSuccess = result
            console.log(result);
          }
        });
    }
  }

  onPasswordFormReady(passwordForm: FormGroup) {
    this.form.addControl('password', passwordForm.get('password'));
    this.form.addControl('confirmPassword', passwordForm.get('confirmPassword'));
  }
}
