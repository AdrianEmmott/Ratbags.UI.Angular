import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ArticleComponent } from './components/articles/article/article.component';
import { ArticlesComponent } from './components/articles/articles.component';
import { HomeComponent } from './components/home/home.component';
import { LoginWrapperComponent } from './components/account/login-wrapper/login-wrapper.component';
import { RegisterComponent } from './components/account/register/register.component';
import { GoogleSigninCallbackComponent } from './components/account/google-sign-in-callback/google-sign-in-callback.component';

const routes: Routes = [
  { path: '', component: HomeComponent }, // Default route
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginWrapperComponent },
  { path: 'google-sign-in-callback', component: GoogleSigninCallbackComponent },
  { path: 'register', component: RegisterComponent},
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
