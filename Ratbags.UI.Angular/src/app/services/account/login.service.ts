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
export class LoginService {
  private apiUrl = `${this.appConfigService.apiBaseUrl}/api/accounts/login`;

  constructor(private http: HttpClient,
    private router: Router,
    private appConfigService: AppConfigService,
    private accountsService: AccountsService) { }

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(
      `${this.apiUrl}`, { email, password }, { withCredentials: true })
      .pipe(
        map(
          (response) => {
            if (response) {
              console.log('login response', response);
              this.accountsService.storeToken(response.jwt);
            }

            return response;
          }
        )
      );
  }

  logout() {
    this.accountsService.removeToken();
    this.accountsService.validateToken().subscribe();;
  }
}
