import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest, HttpStatusCode } from "@angular/common/http";
import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { Observable, catchError, switchMap, throwError } from "rxjs";

import { AccountsService } from "../services/account/accounts.service";
import { RefreshTokenService } from "../services/account/refresh-token.service";
import { AppConfigService } from "../services/app-config.service";

export const RefreshTokenInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<any> => {
  const appConfigService = inject(AppConfigService);
  const accountsService = inject(AccountsService);
  const refreshTokenService = inject(RefreshTokenService);
  const router = inject(Router);

  let refreshAttempted = false; // Flag to prevent multiple refresh attempts for the same request

  // sip the interceptor for requests that could cause an infinite loop
  if (req.url.includes('/refresh-token')) {
    return next(req);
  }

  if (req.url.includes('/validate-token')) {
    return next(req);
  }

  return next(req)
    .pipe(
      catchError(
        (error: HttpErrorResponse) => {
          if (error.status === HttpStatusCode.Unauthorized && !refreshAttempted) {
            // prevent multiple refresh attempts
            refreshAttempted = true;

            accountsService.removeToken();
            accountsService.validateToken();

            return refreshTokenService.request()
              .pipe(
                switchMap(
                  newAccessToken => {
                    // store the new token and validate user
                    if (newAccessToken.jwt) {
                      accountsService.storeToken(newAccessToken.jwt);
                      accountsService.validateToken();
                    }

                    // retry the original request with the new token
                    const retryRequest = req.clone({
                      setHeaders: { Authorization: `Bearer ${newAccessToken.jwt}` }
                    });

                    return next(retryRequest);
                  }),
                catchError(
                  (refreshError: HttpErrorResponse) => {
                    router.navigate(['/login']);
                    return throwError(() => refreshError);
                  })
              );
          }

          // if not 401 or a refresh attempt was already made, throw original error
          return throwError(() => error);
        })
    );
};
