import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Router } from '@angular/router';
import { AppConfigService } from '../app-config.service';
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
    return this.http.post<any>(`${this.apiUrl}`, { email, password })
      .pipe(
        map(
          (response) => {
            if (response && response.token) {
              this.accountsService.storeToken(response);

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
