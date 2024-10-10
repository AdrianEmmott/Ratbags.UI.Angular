import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { AppConfigService } from '../app-config.service';
import { Router } from '@angular/router';
import { AccountsService } from './accounts.service';

@Injectable({
  providedIn: 'root'
})
export class AccountsLoginService {
  private apiUrl = `${this.appConfigService.apiBaseUrl}/api/accounts/login`;

  // nosey sods and blabber-mouths
  private tokenValidSubject = new BehaviorSubject<boolean>(false);
  validateToken$ = this.tokenValidSubject.asObservable();

  constructor(private http: HttpClient,
    private router: Router,
    private appConfigService: AppConfigService,
    private accountsService: AccountsService) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, { email, password }).pipe(
      map((response) => {
        if (response && response.token) {
          this.accountsService.storeToken(response);

          //localStorage.setItem('jwtToken', response.token);
          //localStorage.setItem('email', email);

          this.accountsService.validateToken();
        }

        return response;
      })
    );
  }

  logout() {
    this.accountsService.removeToken();
    this.accountsService.validateToken();
  }
}
