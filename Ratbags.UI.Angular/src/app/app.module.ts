import { CommonModule } from '@angular/common';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';

import { ToastrModule } from 'ngx-toastr';

// interceptors
import { jwtInterceptor } from './interceptors/jwt.interceptor';

// editor and icons
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EditorModule } from '@tinymce/tinymce-angular';

// components
import { AccountComponent } from './components/account/account/account.component';
import { ExternalSigninCallbackComponent } from './components/account/external-sigin-in/external-sign-in-callback/external-sign-in-callback.component';
import { FacebookSignInButtonComponent } from './components/account/external-sigin-in/facebook-sign-in-button/facebook-sign-in-button.component';
import { GoogleSignInButtonComponent } from './components/account/external-sigin-in/google-sign-in-button/google-sign-in-button.component';
import { LoginWrapperComponent } from './components/account/login-wrapper/login-wrapper.component';
import { LoginComponent } from './components/account/login/login.component';
import { RegisterComponent } from './components/account/register/register.component';
import { AppComponent } from './components/app.component';
import { ArticleComponent } from './components/articles/article/article.component';
import { CommentComponent } from './components/articles/article/comments/comment/comment.component';
import { CommentsComponent } from './components/articles/article/comments/comments.component';
import { ArticlesComponent } from './components/articles/articles.component';
import { ContentEditorComponent } from './components/editor/content-editor/content-editor.component';
import { HomeComponent } from './components/home/home.component';
import { NavBarComponent } from './components/navigation/nav-bar/nav-bar.component';
import { SearchComponent } from './components/search/search.component';
import { ImageUploadComponent } from './components/upload/image-upload/image-upload.component';

// services
import { AppConfigService } from './services/app-config.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ArticlesComponent,
    ArticleComponent,
    CommentsComponent,
    CommentComponent,
    AccountComponent,
    LoginComponent,
    LoginWrapperComponent,
    ExternalSigninCallbackComponent,
    GoogleSignInButtonComponent,
    FacebookSignInButtonComponent,
    NavBarComponent,
    SearchComponent,
    RegisterComponent,
    ImageUploadComponent,
    ContentEditorComponent,
  ],
  imports: [
    BrowserModule,
    EditorModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NgbModule,

    CommonModule,
    BrowserAnimationsModule, // required animations module
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],
  providers: [
    provideHttpClient(
      withInterceptors([jwtInterceptor])
    ),
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => {
        return () => {
          // return a promise for stability! (more stable than observable apparently...)
          return appConfigService.loadAppConfig();
        };
      }
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
