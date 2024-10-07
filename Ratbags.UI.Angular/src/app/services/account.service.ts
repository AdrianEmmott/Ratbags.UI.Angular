import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = `${this.appConfigService.apiBaseUrl}/api/account`;

  // nosey sods and a blabber-mouths
  private tokenValidLocallySubject = new BehaviorSubject<boolean>(this.validateTokenLocally());
  tokenValidLocally$: Observable<boolean> = this.tokenValidLocallySubject.asObservable();

  private tokenValidSubject = new BehaviorSubject<boolean>(false);
  validateToken$ = this.tokenValidSubject.asObservable();

  constructor(private http: HttpClient,
    private appConfigService: AppConfigService) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { email, password }).pipe(
      map((response) => {
        if (response && response.token) {
          localStorage.setItem('jwtToken', response.token);
          localStorage.setItem('email', email);
          this.updateTokenValidity();
        }

        return response;
      })
    );
  }

  logout() {
    this.removeToken();
    this.updateTokenValidity();
  }

  updateTokenValidity() {
    this.tokenValidLocallySubject.next(this.validateTokenLocally());
  }

  // local check - we only care if there is a token and if it's expired
  validateTokenLocally(): boolean {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      return false;
    }

    const decodedToken: any = jwtDecode(token);
    console.log('decodedToken', decodedToken);
    const currentTime = Math.floor(new Date().getTime() / 1000);

    // expired?
    const validToken = decodedToken.exp > currentTime;
    console.log('validToken', validToken);

    if (!validToken) {
      this.removeToken();
    }

    return validToken;
  }

  // validate token on server - really go to town on it
  validateToken(): void {
    this.http.get<any>(`${this.apiUrl}/validate-token`)
      .pipe(
        map(() => true),// token valid
        catchError(() => of(false)), // unauthorised, token invalid or expired
        tap(status => this.tokenValidSubject.next(status))
      )
      .subscribe();
  }

  getUserDetails(): string | null {
    let email = localStorage.getItem('email');

    return email;
  }

  removeToken() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('email');
  }
}
