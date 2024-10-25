import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ThemesService } from '../../../../services/themes.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login-wrapper',
  templateUrl: './login-wrapper.component.html',
  styleUrl: './login-wrapper.component.scss'
})
export class LoginWrapperComponent implements OnInit, OnDestroy {
  localSubscription!: Subscription;

  constructor(
    private router: Router,
    private themesService: ThemesService) {
  }

  ngOnInit() {
    // set google button styling to match theme
    this.localSubscription = this.themesService.showLightThemeButton$
      .subscribe(isLightTheme => {
        // styling is on local scss so scope to the button
        const buttonElement = document.querySelector('.gsi-material-button');

        if (buttonElement) {
          if (isLightTheme) {
            buttonElement.classList.remove('google-button-light-theme');
            buttonElement.classList.add('google-button-dark-theme');
          } else {
            buttonElement.classList.remove('google-button-dark-theme');
            buttonElement.classList.add('google-button-light-theme');
          }
        }
      });
  }

  ngOnDestroy() {
    if (this.localSubscription) {
      this.localSubscription.unsubscribe();
    }
  }
}
