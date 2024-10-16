import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { AccountsRegisterService } from '../../../../services/account/accounts-register.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register-confirm-email',
  templateUrl: './register-confirm-email.component.html',
  styleUrl: './register-confirm-email.component.scss'
})
export class RegisterConfirmEmailComponent implements OnInit {
  registerSuccess: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: ToastrService,
    private registerService: AccountsRegisterService) {
  }

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap(params => { // switchMap over mergeMap in case the user clicks the link multiple times...
          let userId = params.get('user-id');
          let token = params.get('token');

          if (userId && token) {
            return this.registerService.confirmEmail(userId!, token!);
          }

          return of(null);
        })
      )
      .subscribe({
        next: response => {
          if (response === true) {
            console.log('confirmEmail response', response);
            this.registerSuccess = true;
          }
          console.log('response', response);
        },
        error: err => {
          this.toastrService.error("Sorry, there was an error confirming your email address");
          console.error('error confirming email:', err);
        }
      });
  }
}
