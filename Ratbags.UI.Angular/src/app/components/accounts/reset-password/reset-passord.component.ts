import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { ResetPasswordService } from '../../../services/account/reset-password.service';

@Component({
  selector: 'app-reset-passord',
  templateUrl: './reset-passord.component.html',
  styleUrl: './reset-passord.component.scss'
})
export class ResetPasswordComponent {
  form: FormGroup;
  submitted: boolean = false;
  
  get f() {
    return this.form.controls;
  }

  constructor(
    private formBuilder: FormBuilder,
    private resetPasswordService: ResetPasswordService) {
    this.form = new FormGroup({
      email: new FormControl ('', [Validators.required, Validators.email])
    });
  }

  onSubmit() {
    this.resetPasswordService
      .request(this.f['email'].value)
      .subscribe({
        next: response => {
          this.submitted = true;
          console.log('reset password url', response);
        }
      });
  }
}
