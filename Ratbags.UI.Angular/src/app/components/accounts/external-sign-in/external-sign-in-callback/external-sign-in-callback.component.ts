import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountsService } from '../../../../services/account/accounts.service';
import { ExternalSigninService } from '../../../../services/account/external-signin.service';
import { ExternalAuthenticationProvidersEnum } from '../../../../enums/external-authentication-providers.enum';

@Component({
  selector: 'app-external-sign-in-callback',
  templateUrl: './external-sign-in-callback.component.html',
  styleUrl: './external-sign-in-callback.component.scss'
})
export class ExternalSigninCallbackComponent implements OnInit {
  externalAuthenticationProvider: ExternalAuthenticationProvidersEnum;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastrService: ToastrService,
    private accountsService: AccountsService,
    private externalSigninService: ExternalSigninService) {
    this.externalAuthenticationProvider = ExternalAuthenticationProvidersEnum.None;
  }

  ngOnInit() {
    let providerName: string | null;

    this.route.paramMap
      .subscribe({
        next: params => {
          providerName = params.get('providerName') ?? ExternalAuthenticationProvidersEnum[ExternalAuthenticationProvidersEnum.None].toLowerCase();

          this.externalSigninService.getToken(providerName)
            .subscribe({
              next: (token: any) => {
                this.accountsService.storeToken(token);

                var email = token['email'];

                this.accountsService.validateToken();

                switch (providerName) {
                  case ExternalAuthenticationProvidersEnum[ExternalAuthenticationProvidersEnum.Facebook].toLowerCase():
                    providerName = 'Facebook';
                    break;
                  case ExternalAuthenticationProvidersEnum[ExternalAuthenticationProvidersEnum.Google].toLowerCase():
                    providerName = 'Google';
                    break;
                  default:
                    providerName = "an external service"
                    break;
                }

                if (email) {
                  this.toastrService.success(`Signed in as ${email} via ${providerName}`);
                }

                this.router.navigate(['/']);
              }
            });
        }
      });

    
  }
}
