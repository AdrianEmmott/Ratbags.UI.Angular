import { Component, OnInit } from '@angular/core';
import { AccountsService } from '../../services/account/accounts.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  isLoggedIn$ = this.accountsService.validateToken$;

  constructor(
    private accountsService: AccountsService) { }


  ngOnInit() {
    this.accountsService.validateToken(); // is user logged in - check once...
  }    
}
