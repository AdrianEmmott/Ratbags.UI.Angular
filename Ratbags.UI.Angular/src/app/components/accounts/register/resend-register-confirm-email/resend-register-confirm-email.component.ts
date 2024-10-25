import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { RegisterService } from '../../../../services/account/register.service';

@Component({
  selector: 'app-resend-register-confirm-email',
  templateUrl: './resend-register-confirm-email.component.html',
  styleUrl: './resend-register-confirm-email.component.scss'
})
export class ResendRegisterConfirmEmailComponent {
  form: FormGroup;
  submitted: boolean = false;

  get f() {
    return this.form.controls;
  }

  constructor(
    private router: Router,
    private toastrService: ToastrService,
    private registerService: RegisterService
  ) {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  onSubmit() {
    this.registerService.resendConfirmEmail(this.f['email'].value)
      .subscribe(
        {
          next:
            (response: any) => {
              console.log(response);
              this.submitted = true;
              this.router.navigate(['/register-confirm-email']);
            },
          error: error => {
            this.toastrService.error("There was an error resending the email");
          }
        }
      );
  }
}
