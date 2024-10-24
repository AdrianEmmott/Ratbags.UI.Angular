import { Component, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { filter } from 'rxjs';

import { AccountsService } from '../../../services/account/accounts.service';
import { LoginService } from '../../../services/account/login.service';
import { ThemesService } from '../../../services/themes.service';
import { ArticlesService } from '../../../services/articles.service';

// icons
import { faSun } from '@fortawesome/free-regular-svg-icons';
import { faMoon } from '@fortawesome/free-solid-svg-icons';



@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit {
  isLoggedIn$ = this.accountsService.validateToken$;

  collapsed: boolean = true;
  showLogin: boolean = true;
  onLoginPage: boolean = false;
  onArticlePage: boolean = false;
  onArticlesPage: boolean = false;

  // icons
  faSun = faSun;
  faMoon = faMoon;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public accountsService: AccountsService,
    private loginService: LoginService,
    public themesService: ThemesService,
    private toastrService: ToastrService,
    private articlesService: ArticlesService) {
  }

  ngOnInit() {
    // hide login if we're at /login
    this.router.events
      .pipe(
        filter(
          (event: any) => event instanceof NavigationEnd)
      )
      .subscribe({
        next: (event: any) => {
          this.onLoginPage = event.url.indexOf('/login') > -1 || event.url.indexOf('/register') > -1;
          this.onArticlePage = event.url.indexOf('/articles/') > -1;
          this.onArticlesPage = event.url.indexOf('/articles') > -1 && event.url.indexOf('/articles/') === -1;
        }
      });
  }

  logout() {
    this.loginService.logout();
  }

  editArticle() {
    this.articlesService.editRequest();
  }
}
