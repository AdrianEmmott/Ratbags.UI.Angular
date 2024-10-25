import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { AppConfigService } from '../app-config.service';
import { Router } from '@angular/router';
import { TokenWrapper } from '../../interfaces/token-wrapper';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  private apiUrl = `${this.appConfigService.apiBaseUrl}/api/accounts`;

  // nosey sods and blabber-mouths
  private tokenValidSubject = new BehaviorSubject<boolean>(false);
  validateToken$ = this.tokenValidSubject.asObservable();

  constructor(private http: HttpClient,
    private router: Router,
    private appConfigService: AppConfigService) { }

  decodeToken(): JwtPayload | null {
    const token = localStorage.getItem('jwtToken');

    if (!token) {
      return null;
    }

    const decodedToken: any = jwtDecode(token);
    //console.log('decodeToken decodedToken', decodedToken);
    const currentTime = Math.floor(new Date().getTime() / 1000);

    // expired?
    const validToken = decodedToken.exp > currentTime;

    if (!validToken) {
      this.removeToken();
      return null;
    }

    return decodedToken;
  }

  get userId(): string | undefined {
    const token = this.decodeToken();
    if (token) {
      const id = token.sub;

      return id;
    }

    return undefined;
  }

  // validate token on server
  validateToken(): void {
    this.http.get<any>(`${this.apiUrl}/validate-token`)
      .pipe(
        map(() => true),// token will always be valid if there is a valid response
        catchError(() => of(false)), // unauthorised, token invalid or expired
        tap(status => {
          // grabbing the status from map
          this.tokenValidSubject.next(status);
        })
      )
      .subscribe();
  }

  getUserDetails(): string | null {
    let email = localStorage.getItem('email');

    return email;
  }

  storeToken(token: TokenWrapper) {
    localStorage.setItem('jwtToken', token.token);
    localStorage.setItem('email', token.email);
  }

  removeToken() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('email');
  }
}
