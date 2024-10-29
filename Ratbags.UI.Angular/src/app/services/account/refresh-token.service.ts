import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, concatMap, map, mergeMap, of, switchMap, tap } from 'rxjs';

import { AppConfigService } from '../app-config.service';
import { AccountsService } from './accounts.service';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenService {
  private apiUrl = `${this.appConfigService.apiBaseUrl}/api/accounts/refresh-token`;

  constructor(
    private http: HttpClient,
    private router: Router,
    private appConfigService: AppConfigService,
    private accountsService: AccountsService) {
  }

  request(): Observable<any> {
    const userId = this.accountsService.userId;

    return this.http.post<any>(`${this.apiUrl}`, { userId }, { withCredentials: true });
  }

  // has the user gone to watch tremors (1990), come back and found themselves logged out?
  // checks if the user is logged out but still has a valid refresh token
  // if so, grab the new jwt and refresh token, then check again if they're logged in
  requestTokenIfNeeded() {
    // check if user is logged in (passes the jwt to api)
    this.accountsService.validateToken()
      .pipe(
        concatMap(
          (isLoggedIn: boolean) => {

            if (!isLoggedIn) {
              // user's jwt has expired - try get another one via refresh token service
              return this.request()
                .pipe(
                  tap(
                    token => {
                      if (token) {
                        this.accountsService.storeToken(token.jwt);
                        this.accountsService.storeUserId(token.jwt);
                      }
                    }
                  ),
                  concatMap(
                    token => {
                      if (token) {
                        // good token, check if user is now logged in
                        return this.accountsService.validateToken()
                          .pipe(
                            map(
                              isLoggedInNow => {
                                return isLoggedInNow;
                              }
                            )
                          )
                      }

                      // token request failed
                      return of(isLoggedIn);
                    }
                  )
                )
            }

            return of(isLoggedIn);
          }
        )
      )
      .subscribe(
        {
          next:
            () => {
              console.log('token refreshed');
            }
        }
      );
  }
}
