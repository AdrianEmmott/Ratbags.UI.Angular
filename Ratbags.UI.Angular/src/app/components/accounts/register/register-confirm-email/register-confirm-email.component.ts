import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { AccountsRegisterService } from '../../../../services/account/accounts-register.service';

@Component({
  selector: 'app-register-confirm-email',
  templateUrl: './register-confirm-email.component.html',
  styleUrl: './register-confirm-email.component.scss'
})
export class RegisterConfirmEmailComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private registerService: AccountsRegisterService) {
  }

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap(params => { // switchMap over mergeMap in case the user clicks the link multiple times...
          const userId = params.get('user-id');
          const token = params.get('token');

          return this.registerService.confirmEmail(userId!, token!);
        })
      )
      .subscribe({
        next: response => {
          console.log(response);
        },
        error: err => {
          console.error('error confirming email:', err);
        }
      });
  }
}
