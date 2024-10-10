import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountsService } from '../../../services/account/accounts.service';
import { GoogleSigninService } from '../../../services/account/google-signin.service';

@Component({
  selector: 'app-google-sign-in-callback',
  templateUrl: './google-sign-in-callback.component.html',
  styleUrl: './google-sign-in-callback.component.scss'
})
export class GoogleSigninCallbackComponent implements OnInit {
  constructor(private router: Router,
    private toastrService: ToastrService,
    private accountsService: AccountsService,
    private googleSigninService: GoogleSigninService) {
  }

  ngOnInit() {
    this.googleSigninService.getGoogleToken()
      .subscribe({
        next: (token: any) => {
          this.accountsService.storeToken(token);

          var email = token['email'];

          this.accountsService.validateToken();

          if (email) {
            this.toastrService.success(`Signed in as ${email} via Google`);
          }

          this.router.navigate(['/']);
        }
      });
  }
}
