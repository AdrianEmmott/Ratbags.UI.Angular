import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExternalSigninCallbackComponent } from './components/accounts/external-sign-in/external-sign-in-callback/external-sign-in-callback.component';
import { LoginTroubleComponent } from './components/accounts/login/login-trouble/login-trouble.component';
import { LoginWrapperComponent } from './components/accounts/login/login-wrapper/login-wrapper.component';
import { RegisterConfirmEmailComponent } from './components/accounts/register/register-confirm-email/register-confirm-email.component';
import { RegisterComponent } from './components/accounts/register/register.component';
import { ResendRegisterConfirmEmailComponent } from './components/accounts/register/resend-register-confirm-email/resend-register-confirm-email.component';
import { ResetPasswordComponent } from './components/accounts/reset-password/reset-passord.component';
import { ResetPasswordUpdateComponent } from './components/accounts/reset-password/reset-password-update/reset-password-update.component';
import { ArticleComponent } from './components/articles/article/article.component';
import { ArticlesComponent } from './components/articles/articles.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent }, // Default route
  { path: 'home', component: HomeComponent },
  { path: 'register', component: RegisterComponent },

  { path: 'register-confirm-email', component: RegisterConfirmEmailComponent },
  { path: 'register-confirm-email/:user-id/:token', component: RegisterConfirmEmailComponent },
  
  { path: 'resend-register-confirm-email', component: ResendRegisterConfirmEmailComponent },

  { path: 'login', component: LoginWrapperComponent }, 
  { path: 'forgot-password', component: ResetPasswordComponent },
  { path: 'reset-password/:user-id/:token', component: ResetPasswordUpdateComponent },
  { path: 'login-trouble', component: LoginTroubleComponent },
  
  { path: 'external-sign-in-callback/:providerName', component: ExternalSigninCallbackComponent },
 
  { path: 'articles', component: ArticlesComponent },
  { path: 'articles/new', component: ArticleComponent },
  { path: 'articles/:id', component: ArticleComponent }
  
  //{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
