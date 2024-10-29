import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Subscription, filter } from 'rxjs';

import { AccountsService } from '../../../services/account/accounts.service';
import { LoginService } from '../../../services/account/login.service';
import { ThemesService } from '../../../services/themes.service';
import { ArticlesService } from '../../../services/articles.service';

// icons
import { faSun, faFloppyDisk, faPenToSquare, faFile } from '@fortawesome/free-regular-svg-icons';
import { faMoon, faCancel, faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit, OnDestroy {
  isLoggedIn$ = this.accountsService.validateToken$;
  routerSubscription!: Subscription;

  collapsed: boolean = true;
  showLogin: boolean = true;
  onLoginPage: boolean = false;
  onArticlePage: boolean = false;
  onArticlesPage: boolean = false;

  // icons
  faSun = faSun;
  faMoon = faMoon;
  faFile = faFile;
  faPenToSquare = faPenToSquare;
  faFloppyDisk = faFloppyDisk;
  faCancel = faCancel;

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public accountsService: AccountsService,
    private loginService: LoginService,
    public themesService: ThemesService,
    private toastrService: ToastrService,
    public articlesService: ArticlesService) {
  }

  ngOnInit() {
    // hide login if we're at /login
    this.routerSubscription = this.router.events
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

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  logout() {
    this.loginService.logout();
  }

  editArticle(edit: boolean) {
    if (edit) {
      this.articlesService.editRequest();
    }
    else {
      this.articlesService.editFinished();
    }
  }

  saveChanges() {
    this.articlesService.saveChanges(true);
  }
}
