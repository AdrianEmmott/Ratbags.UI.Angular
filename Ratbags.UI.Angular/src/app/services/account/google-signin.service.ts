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
export class GoogleSigninService {
  private apiUrl = `${this.appConfigService.apiBaseUrl}/api/accounts/google`;

  // nosey sods and blabber-mouths
  private tokenValidSubject = new BehaviorSubject<boolean>(false);
  validateToken$ = this.tokenValidSubject.asObservable();

  constructor(private http: HttpClient,
    private router: Router,
    private appConfigService: AppConfigService,
    private accountsService: AccountsService) { }

  signin() {
    window.location.href = `${this.apiUrl}/sign-in`;
  }

  getGoogleToken(): Observable<any> {
    return this.http.get<{ token: any }>(`${this.apiUrl}/token`, { withCredentials: true })
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
