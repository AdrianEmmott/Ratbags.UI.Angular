import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AppConfigService } from '../app-config.service';
import { BaseService } from '../base.service';
import { AccountsService } from './accounts.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService extends BaseService {
  private apiUrl = `${this.appConfigService.apiBaseUrl}/api/accounts/register`;

  constructor(
    private http: HttpClient,
    private appConfigService: AppConfigService,
    private accountsService: AccountsService
  ) {
    super();
  }

  register(firstName: string, lastName: string, email: string, password: string): Observable<any> {
    if (!firstName || !lastName || !email || !password) {
      return throwError(() => new Error('first name / last name, email and password are required'));
    }

    return this.http.post<any>(`${this.apiUrl}`, { firstName, lastName, email, password })
      .pipe(
        map(
          (response) => {
            if (response && response.token) {
              this.accountsService.storeToken(response);
            }

            return response;
          }
        ),
        catchError(this.handleError)
      );
  }

  confirmEmail(userId: string, token: string): Observable<any> {
    if (!userId || !token) {
      return throwError(() => new Error('user id and token are required'));
    }

    if (userId && token) {
      return this.http.post<any>(`${this.apiUrl}/confirm-email`, { userId, token })
        .pipe(
          catchError(this.handleError)
        );
    }

    return of(null);
  }

  resendConfirmEmail(email: string): Observable<any> {
    if (!email) {
      return throwError(() => new Error('email is required'));
    }

    return this.http.post<any>(`${this.apiUrl}/resend-confirm-email`, { email })
      .pipe(
        catchError(this.handleError)
      );
  }
}
