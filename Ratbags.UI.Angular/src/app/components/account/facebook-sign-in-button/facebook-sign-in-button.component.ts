import { Component, OnInit } from '@angular/core';
import { ExternalSigninService } from '../../../services/account/external-signin.service';

@Component({
  selector: 'app-facebook-sign-in-button',
  templateUrl: './facebook-sign-in-button.component.html',
  styleUrl: './facebook-sign-in-button.component.scss'
})
export class FacebookSignInButtonComponent implements OnInit {
  constructor(
    private externalSigninService: ExternalSigninService
  ) { }

  ngOnInit() {
  }

  signin() {
    this.externalSigninService.signin('facebook');
  }
}
