import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtPayload, jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { AppConfigService } from '../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {
  private apiUrl = `${this.appConfigService.apiBaseUrl}/api/accounts`;

  // nosey sods and blabber-mouths
  private tokenValidSubject = new BehaviorSubject<boolean>(false);
  validateToken$ = this.tokenValidSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
    private appConfigService: AppConfigService) { }

  decodeToken(): JwtPayload | null {
    //console.log('decodeToken start');

    const token = localStorage.getItem('jwt');

    console.log('AccountsService decodeToken jwt', token);

    if (!token) {
      return null;
    }

    const decodedToken: any = jwtDecode(token);
    //console.log('decodeToken decodedToken', decodedToken);

    const currentTime = Math.floor(new Date().getTime() / 1000);

    // expired?
    const validToken = decodedToken.exp > currentTime;

    //console.log('AccountsService current time', currentTime);
    //console.log('AccountsService token expiry', decodedToken.exp);

    return decodedToken;
  }

  get userId(): string | undefined {
    const userId = localStorage.getItem('user-id');

    if (userId) {
      return userId;
    }

    return undefined;
  }

  validateToken(): Observable<boolean> {
    const token = localStorage['jwt'];

    //console.log('AccountsService validating token', token);

    return this.http.get<any>(`${this.apiUrl}/validate-token`)
      .pipe(
        map(result => result),// token will always be valid if there is a valid response
        catchError(() => of(false)),// unauthorised, token invalid or expired
        tap(status => {
          console.log('AccountsService validateToken status in tap', status);
          // grabbing the status from map
          this.tokenValidSubject.next(status);
        })
      );
  }

  storeToken(token: any) {
    //console.log('AccountsService storeToken', token);

    localStorage.setItem('jwt', token);
  }

  storeUserId(token: any) {
    const decoded = this.decodeToken();

    if (decoded) {
      var userId = decoded?.sub;
      if (userId) {
        localStorage.setItem('user-id', userId);
      }
    }
  }

  removeToken() {
    localStorage.removeItem('jwt');
  }
}
