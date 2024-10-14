import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AccountsService } from '../services/account/accounts.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard {//
//implements CanActivate {

  constructor(private accountService: AccountsService, private router: Router) { }

  //canActivate(): Observable<boolean> {
  //  return this.accountService.validateToken()
  //    .pipe(
  //      map(isLoggedIn => {
  //        if (!isLoggedIn) {
  //          this.router.navigate(['/login']);
  //          return false;
  //        }
  //        return true;
  //      })
  //    );
  //}
}
