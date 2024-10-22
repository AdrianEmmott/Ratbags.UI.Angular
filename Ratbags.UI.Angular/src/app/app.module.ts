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
import { AboutComponent } from './components/about/about.component';
import { AccountComponent } from './components/accounts/account/account.component';
import { ExternalSigninCallbackComponent } from './components/accounts/external-sign-in/external-sign-in-callback/external-sign-in-callback.component';
import { FacebookSignInButtonComponent } from './components/accounts/external-sign-in/facebook-sign-in-button/facebook-sign-in-button.component';
import { GoogleSignInButtonComponent } from './components/accounts/external-sign-in/google-sign-in-button/google-sign-in-button.component';
import { LoginTroubleComponent } from './components/accounts/login/login-trouble/login-trouble.component';
import { LoginWrapperComponent } from './components/accounts/login/login-wrapper/login-wrapper.component';
import { LoginComponent } from './components/accounts/login/login.component';
import { PasswordConfirmationComponent } from './components/accounts/password-confirmation/password-confirmation.component';
import { RegisterConfirmEmailComponent } from './components/accounts/register/register-confirm-email/register-confirm-email.component';
import { RegisterComponent } from './components/accounts/register/register.component';
import { ResendRegisterConfirmEmailComponent } from './components/accounts/register/resend-register-confirm-email/resend-register-confirm-email.component';
import { ResetPasswordComponent } from './components/accounts/reset-password/reset-passord.component';
import { ResetPasswordUpdateComponent } from './components/accounts/reset-password/reset-password-update/reset-password-update.component';
import { AppComponent } from './components/app.component';
import { ArticleComponent } from './components/articles/article/article.component';
import { CommentComponent } from './components/articles/article/comments/comment/comment.component';
import { CommentsComponent } from './components/articles/article/comments/comments.component';
import { ArticlesComponent } from './components/articles/articles.component';
import { ContentEditorComponent } from './components/editor/content-editor/content-editor.component';
import { HomeComponent } from './components/home/home.component';
import { NavBarComponent } from './components/navigation/nav-bar/nav-bar.component';
import { SearchComponent } from './components/search/search.component';
import { UnsavedChangesPromptComponent } from './components/unsaved-changes-prompt/unsaved-changes-prompt.component';
import { ImageUploadComponent } from './components/upload/image-upload/image-upload.component';
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
    PasswordConfirmationComponent,
    ResetPasswordComponent,
    ResetPasswordUpdateComponent,
    LoginTroubleComponent,
    ResendRegisterConfirmEmailComponent,
    RegisterConfirmEmailComponent,
    AboutComponent,
    UnsavedChangesPromptComponent,
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
