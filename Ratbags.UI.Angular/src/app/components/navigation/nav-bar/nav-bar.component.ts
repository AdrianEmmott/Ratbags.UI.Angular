import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

import { AccountService } from '../../../services/account.service';
import { ThemesService } from '../../../services/themes.service';

// icons
import { faSun } from '@fortawesome/free-regular-svg-icons';
import { faMoon } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit {
  collapsed: boolean = true;
  showLogin: boolean = true;
  onLoginPage: boolean = false;

  // icons
  faSun = faSun;
  faMoon = faMoon;

  constructor(public router: Router,
    public route: ActivatedRoute,
    public accountService: AccountService,
    public themesService: ThemesService) {
    // hide login if we're at /login
    this.router.events
      .pipe(
        filter(
          (event: any) => event instanceof NavigationEnd)
      )
      .subscribe({
        next: (event: any) => {
          this.onLoginPage = event.url.indexOf('/login') > -1;
        }
      });
  }

  ngOnInit() {
  }
  
  logout() {
    this.accountService.logout();
  }
}
