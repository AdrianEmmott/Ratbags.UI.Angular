import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/internal/operators/switchMap';

import { EditorComponent } from '@tinymce/tinymce-angular';

import { AppConfigService } from '../../../services/app-config.service';

import { Article } from '../../../interfaces/article';
import { ArticlesService } from '../../../services/articles-service';

import { Comment } from '../../../interfaces/comment';
import { ComemntsService } from '../../../services/comments-service';

// icons
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { HttpContext, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss',
})
export class ArticleComponent implements OnInit {
  @ViewChild('contentEditor') contentEditor?: EditorComponent; // tinymce

  readonly editorInitialisation: EditorComponent["init"] = {
    plugins: ["help"],
  };

  article: Article | undefined;

  tinyMCESecret = this.appConfigService.tinyMCEKey;
  creating: boolean = false;
  editing: boolean = false;
  form: FormGroup | undefined;

  originalContent: string = '';

  // icons
  faCoffee = faCoffee;

  constructor(private formBuilder: FormBuilder,
    private appConfigService: AppConfigService,
    private articlesService: ArticlesService,
    private commentsService: ComemntsService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.getArticle(id);
      }
      else {
        this.setupCreate();
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
      .subscribe((result: Article) => {
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
        .subscribe((response) => {
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
        .subscribe(result => {
          this.editing = false;
        });
    }
  }
}
