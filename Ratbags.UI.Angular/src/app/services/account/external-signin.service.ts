import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { AppConfigService } from '../app-config.service';
import { AccountsService } from './accounts.service';

@Injectable({
  providedIn: 'root'
})
export class ExternalSigninService {
  private apiUrl = `${this.appConfigService.apiBaseUrl}`;

  constructor(private http: HttpClient,
    private router: Router,
    private appConfigService: AppConfigService,
    private accountsService: AccountsService) { }

  signin(providerName: string) {
    window.location.href = `${this.apiUrl}/api/accounts/external-authentication/sign-in/${providerName.toLowerCase()}`;
  }

  getToken(providerName: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/api/accounts/external-authentication/token/${providerName}`, { withCredentials: true })
      .pipe(
        tap((response) => {
          console.log('external signing response', response);
          this.accountsService.storeToken(response.jwt);
        }),
        // validateToken is actually a side effect
        // but we still want to return the original response from the http.get
        // (and not the return from validateToken)
        switchMap(response => this.accountsService.validateToken()
          .pipe(
            map(
              () => response
            )
          )
        )
      );
  }
}
