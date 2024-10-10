import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';

// interceptors
import { jwtInterceptor } from './interceptors/jwt.interceptor';

// editor and icons
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { EditorModule } from '@tinymce/tinymce-angular';

// components
import { AccountComponent } from './components/account/account/account.component';
import { LoginWrapperComponent } from './components/account/login-wrapper/login-wrapper.component';
import { LoginComponent } from './components/account/login/login.component';
import { AppComponent } from './components/app.component';
import { ArticleComponent } from './components/articles/article/article.component';
import { CommentComponent } from './components/articles/article/comments/comment/comment.component';
import { CommentsComponent } from './components/articles/article/comments/comments.component';
import { ArticlesComponent } from './components/articles/articles.component';
import { HomeComponent } from './components/home/home.component';
import { NavBarComponent } from './components/navigation/nav-bar/nav-bar.component';
import { ContentEditorComponent } from './components/editor/content-editor/content-editor.component';
import { GoogleSigninCallbackComponent } from './components/account/google-sign-in-callback/google-sign-in-callback.component';
import { ImageUploadComponent } from './components/upload/image-upload/image-upload.component';
import { SearchComponent } from './components/search/search.component';
import { RegisterComponent } from './components/account/register/register.component';

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
    NavBarComponent,
    LoginWrapperComponent,
    SearchComponent,
    RegisterComponent,
    ImageUploadComponent,
    ContentEditorComponent,
    GoogleSigninCallbackComponent
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
