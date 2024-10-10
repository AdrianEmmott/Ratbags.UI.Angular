import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GoogleSigninService } from '../../../services/account/google-signin.service';

@Component({
  selector: 'app-login-wrapper',
  templateUrl: './login-wrapper.component.html',
  styleUrl: './login-wrapper.component.scss'
})
export class LoginWrapperComponent implements OnInit {
  constructor(
    private router: Router,
    private googleSigninService: GoogleSigninService) {
  }

  ngOnInit() {
    
  }

  loginWithGoogle() {
    this.googleSigninService.signin();
  }
}
