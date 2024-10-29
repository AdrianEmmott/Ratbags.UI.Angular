import { Component, OnInit, Renderer2 } from '@angular/core';
import { AccountsService } from '../services/account/accounts.service';
import { RefreshTokenService } from '../services/account/refresh-token.service';
import { concatMap, map, of } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  isLoggedIn$ = this.accountsService.validateToken$;

  constructor(
    private accountsService: AccountsService,
    private refreshTokenService: RefreshTokenService) { }

  ngOnInit() {
    setTimeout(() => {
      console.log('AppComponent firing requestTokenIfNeeded');
      this.refreshTokenService.requestTokenIfNeeded();
    }, 500);
  }
}
