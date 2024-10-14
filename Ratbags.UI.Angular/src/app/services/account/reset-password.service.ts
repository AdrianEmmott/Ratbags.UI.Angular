import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { AppConfigService } from '../app-config.service';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  private apiUrl = `${this.appConfigService.apiBaseUrl}/api/accounts/reset-password`;

  private tokenValidSubject = new BehaviorSubject<boolean>(false);
  validateToken$ = this.tokenValidSubject.asObservable();

  constructor(private http: HttpClient,
    private appConfigService: AppConfigService) { }

  request(email: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/request`, { email });
  }

  update(userId: string, token: string, password: string): Observable<any> {
    console.log('ResetPasswordService update userId',userId);
    console.log('ResetPasswordService update token', token);
    console.log('ResetPasswordService update password', password);
    return this.http.post<any>(`${this.apiUrl}/update`, { userId: userId, passwordResetToken: token, password: password });
  }
}
