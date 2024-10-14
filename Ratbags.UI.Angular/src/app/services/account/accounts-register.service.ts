import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { AppConfigService } from '../app-config.service';
import { AccountsService } from './accounts.service';

@Injectable({
  providedIn: 'root'
})
export class AccountsRegisterService {
  private apiUrl = `${this.appConfigService.apiBaseUrl}/api/accounts/register`;

  constructor(
    private http: HttpClient,
    private appConfigService: AppConfigService,
    private accountsService: AccountsService
  ) { }

  register(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, { email, password })
      .pipe(
        map((response) => {
          if (response && response.token) {
            this.accountsService.storeToken(response);
          }

          return response;
        })
      );
  }

  confirmEmail(userId: string, token: string): Observable<any> {
    console.log('AccountsRegisterService confirmEmail userId', userId);

    return this.http.post<any>(`${this.apiUrl}/confirm-email`, { userId, token });
  }
}
