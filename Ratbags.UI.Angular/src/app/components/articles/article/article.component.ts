import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { EditorComponent } from '@tinymce/tinymce-angular';

import { AppConfigService } from '../../../services/app-config.service';
import { AccountService } from '../../../services/account.service';

import { Article } from '../../../interfaces/article';
import { ArticlesService } from '../../../services/articles.service';

import { ComemntsService } from '../../../services/comments.service';

// icons
import { faCoffee } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss',
})
export class ArticleComponent implements OnInit {
  @ViewChild('contentEditor') contentEditor?: EditorComponent; // tinymce

  isLoggedIn$ = this.accountService.validateToken$;
  isLoggedIn: boolean = false;

  readonly editorInitialisation: EditorComponent["init"] = {
    plugins: ["help", "advcode"],
    //skin: "oxide", // regular
    //content_css: "default",
    //skin: "oxide-dark", // force dark
    //content_css: "dark"
    skin: (window.matchMedia("(prefers-color-scheme: dark)").matches ? "oxide-dark" : ""), // match user prefs
    content_css: (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "")
  };

  article: Article | undefined;

  tinyMCESecret = this.appConfigService.tinyMCEKey;
  creating: boolean = false;
  editing: boolean = false;
  form: FormGroup | undefined;

  originalContent: string = '';

  // icons
  faCoffee = faCoffee;

  constructor(private route: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder,
    private appConfigService: AppConfigService,
    public accountService: AccountService,
    private articlesService: ArticlesService,
    private commentsService: ComemntsService) {
  }

  ngOnInit() {
    //this.isLoggedIn$.subscribe(status => console.log('IsLoggedIn:', status));

    this.accountService.validateToken();

    //this.accountService
    //  .validateToken()
    //  .subscribe({
    //    next: result => {
    //      this.isLoggedIn = result;
    //    },
    //    error: error => {
    //      console.log(error);
    //    }
    //  });

    this.route.paramMap.subscribe({
      next: params => {
        const id = params.get('id');
        if (id) {
          this.getArticle(id);
        }
        else {
          this.setupCreate();
        }
      }
    });
  }

  setupForm() {
    this.form = this.formBuilder.group({
      title: [this.article?.title],
      content: [this.article?.content]
    });
  }

  getArticle(id: string) {
    this.articlesService.getArticle(id)
      .subscribe({
        next: (result: Article) => {
          this.article = result;

          this.article = {
            id: result.id,
            title: result.title,
            content: result.content,
            created: result.created,
            updated: result.updated,
            publishDate: result.publishDate,
            comments: result.comments,
            userId: result.userId
          }

          this.originalContent = this.article.content;
        }
      });
  }

  setupCreate() {
    this.article = {
      id: '',
      title: '',
      content: '',
      created: new Date(),
      updated: new Date(),
      publishDate: new Date(),
      comments: [],
      userId: ''
    }

    this.editing = false;
    this.creating = true;
    this.setupForm();
  }
  createCancel() {
    this.creating = false;
    this.router.navigate(['/articles']);
  }
  create() {
    if (this.article) {
      this.article.title = this.form?.controls['title'].value;
      this.article.content = this.form?.controls['content'].value;

      this.articlesService.create(<Article>this.article)
        .subscribe({
          next: (response) => {
            const id = response.body;
            const locationHeader = response.headers.get('Location');

            if (locationHeader) {
              console.log('navigating from response headers');

              const relativeUrl = new URL(locationHeader).pathname;
              this.router.navigateByUrl(relativeUrl);
            } else if (id) {
              console.log('navigating the old fashioned way');

              this.router.navigate(['/articles', id]);
            }

            this.editing = false;
            this.creating = false;
          }
        });
    }
  }

  edit() {
    this.editing = true;
    this.setupForm();
    this.originalContent = this.form?.get('content')?.value;
  }
  updateCancel() {
    this.editing = false;

    if (this.contentEditor) {
      this.form?.patchValue({ content: this.originalContent });
      this.contentEditor.editor.setContent(this.originalContent);
    }
  }
  update() {
    if (this.article) {
      this.article.title = this.form?.controls['title'].value;
      this.article.content = this.form?.controls['content'].value;

      this.articlesService.update(<Article>this.article)
        .subscribe({
          next: result => {
            this.editing = false;
          }
        });
    }
  }
}
