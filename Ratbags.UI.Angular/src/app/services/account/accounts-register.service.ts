import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { AppConfigService } from '../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class AccountsRegisterService {
  private apiUrl = `${this.appConfigService.apiBaseUrl}/api/account/register`;

  private tokenValidSubject = new BehaviorSubject<boolean>(false);
  validateToken$ = this.tokenValidSubject.asObservable();

  constructor(private http: HttpClient,
    private appConfigService: AppConfigService) { }

  register(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, { email, password }).pipe(
      map((response) => {
        if (response && response.token) {
          localStorage.setItem('jwtToken', response.token);
          localStorage.setItem('email', email);
          /*this.updateTokenValidity();*/
        }

        return response;
      })
    );
  }
}
