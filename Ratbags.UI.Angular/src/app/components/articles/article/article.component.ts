import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AccountsService } from '../../../services/account/accounts.service';
import { Article } from '../../../interfaces/article';
import { AppConfigService } from '../../../services/app-config.service';
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
  form!: FormGroup;

  isLoggedIn$ = this.accountsService.validateToken$;

  article!: Article;
  showEditor: boolean = false;

  // icons
  faCoffee = faCoffee;

  constructor(private route: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder,
    private appConfigService: AppConfigService,
    public accountsService: AccountsService,
    private articlesService: ArticlesService,
    private commentsService: ComemntsService) {
  }

  ngOnInit() {
    this.accountsService.validateToken(); // is user logged in - check once!

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
    this.form = new FormGroup({
      title: new FormControl(this.article?.title, [Validators.required]),
      content: new FormControl(this.article.content, [Validators.required])
    });
  }

  getArticle(id: string) {
    this.articlesService.getArticle(id)
      .subscribe({
        next: (result: Article) => {
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
        }
      });
  }

  onSubmit() {
    if (this.form) {
      if (!this.article.id) {
        this.create();
      }
      else {
        this.update();
      }
    }
  }
  cancel() {
    if (!this.article.id) {
      this.router.navigate(['/articles']);
    }
    else {
      this.form?.patchValue({ title: this.article?.title });
      this.form?.patchValue({ content: this.article?.content });
      this.showEditor = false;
    }
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

    this.showEditor = true;

    this.setupForm();
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

            this.showEditor = false;
          }
        });
    }
  }

  edit() {
    this.setupForm();
    this.showEditor = true;
  }
  update() {
    if (this.article) {
      this.article.title = this.form?.controls['title'].value;
      this.article.content = this.form?.controls['content'].value;

      this.articlesService.update(<Article>this.article)
        .subscribe({
          next: result => {
            this.showEditor = false;
          }
        });
    }
  }
}
