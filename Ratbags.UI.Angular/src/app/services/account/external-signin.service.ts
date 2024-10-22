import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { AppConfigService } from '../app-config.service';
import { Router } from '@angular/router';
import { AccountsService } from './accounts.service';
import { TokenWrapper } from '../../interfaces/token-wrapper';

@Injectable({
  providedIn: 'root'
})
export class ExternalSigninService {
  private apiUrl = `${this.appConfigService.apiBaseUrl}/api/accounts/external-authentication`;

  constructor(private http: HttpClient,
    private router: Router,
    private appConfigService: AppConfigService,
    private accountsService: AccountsService) { }

  signin(providerName: string) {
    window.location.href = `${this.apiUrl}/sign-in/${providerName.toLowerCase()}`;
  }

  getToken(providerName: string): Observable<any> {
    return this.http.get<{ token: any }>(`${this.apiUrl}/token/${providerName}`, { withCredentials: true })
      .pipe(
        map(
          response => response as TokenWrapper
        ),
        tap((response: TokenWrapper) => {
          this.accountsService.storeToken(response);
        })
      );
  }
}
