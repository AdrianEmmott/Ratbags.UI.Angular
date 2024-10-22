import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Article } from '../../../interfaces/article';
import { AccountsService } from '../../../services/account/accounts.service';
import { AppConfigService } from '../../../services/app-config.service';
import { ArticlesService } from '../../../services/articles.service';
import { CommentsService } from '../../../services/comments.service';
import { ImagesService } from '../../../services/images.service';

// icons
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';
import { of, switchMap, tap } from 'rxjs';


@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss',
})
export class ArticleComponent implements OnInit {
  editArticle$ = this.articlesService.editArticle$;

  isLoggedIn$ = this.accountsService.validateToken$;

  form!: FormGroup;


  article!: Article;
  showEditor: boolean = false;

  bannerImage: File | null = null;
  bannerImageUrl: string | null = null;

  // icons
  faCoffee = faCoffee;

  constructor(private route: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder,
    private appConfigService: AppConfigService,
    public accountsService: AccountsService,
    private articlesService: ArticlesService,
    private commentsService: CommentsService,
    private imagesService: ImagesService,
    private toastrService: ToastrService) {
  }

  ngOnInit() {
    this.accountsService.validateToken(); // is user logged in - check once...

    // pipe tap and switchmap, all so we can safely edit.
    // 1) check if edit mode
    // 2) grab the article id from route, if viewing article 
    // 3) or create a new article
    // 4) finally setup the editor form if editing.
    // without all this, bugs galore because the form tries to build before article exists
    this.editArticle$
      .pipe(
        tap(
          (editResult: boolean) => {
            // check if edit mode
            this.showEditor = editResult;
          }
        ),
        switchMap(
          () => {
            // grab route params
            return this.route.paramMap;
          }
        ),
        switchMap(
          params => {
            
            const id = params.get('id');

            if (id) {
              // grab the article id from route, if viewing article
              // and return bogus observable
              return of(this.getArticle(id));
            }
            else {
              // or create a new article
              // and return bogus observable
              return of(this.setupCreate());
            }
          })
      )
      .subscribe({
        next:
          () => {
            if (this.showEditor) {
              // finally setup the editor form if editing
              this.setupForm();
            }
          }
      });
  }

  setupForm() {
    this.form = new FormGroup({
      title: new FormControl(this.article?.title, [Validators.required]),
      content: new FormControl(this.article.content, [Validators.required]),
      description: new FormControl(this.article.description, [Validators.required]),
      introduction: new FormControl(this.article.introduction)
    });
  }

  getArticle(id: string) {
    this.articlesService.getArticle(id)
      .subscribe({
        next: (result: Article) => {
          this.article = {
            id: result.id,
            title: result.title,
            description: result.description,
            introduction: result.introduction,
            content: result.content,
            bannerImageUrl: result.bannerImageUrl,
            created: result.created,
            updated: result.updated,
            publishDate: result.publishDate,
            comments: result.comments,
            userId: result.userId,
            authorName: result.authorName
          }

          this.getBannerImageUrl(); // TODO - yikes move this

          console.log(this.article);
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
      this.articlesService.editFinished();
      this.router.navigate(['/articles']);
    }
    else {
      this.form?.patchValue({ title: this.article?.title });
      this.form?.patchValue({ content: this.article?.content });
      this.showEditor = false;
      this.articlesService.editFinished();
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
      this.article.description = this.form?.controls['description'].value;
      this.article.introduction = this.form?.controls['introduction'].value;
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
            }
            else if (id) {
              console.log('navigating the old fashioned way');

              this.router.navigate(['/articles', id]);
            }

            this.showEditor = false;
            this.articlesService.editFinished();
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
      this.article.description = this.form?.controls['description'].value;
      this.article.introduction = this.form?.controls['introduction'].value;
      this.article.content = this.form?.controls['content'].value;

      if (this.bannerImage) {
        this.article.bannerImageUrl = this.bannerImage.name;
      }

      this.articlesService.update(<Article>this.article)
        .pipe(
          switchMap(
            () => {
              return of(this.getArticle(this.article.id));
            }
          )
        )
        .subscribe({
          next: result => {
            this.showEditor = false;
            this.articlesService.editFinished();
          }
        });
    }
  }

  getBannerImageUrl() {
    if (this.article && this.article.bannerImageUrl) {
      this.imagesService.get(this.article.bannerImageUrl)
        .subscribe({
          next: (src: string) => {
            this.bannerImageUrl = src;
          }
        });
    }
  }

  bannerImageSelect(event: any) {
    console.log('selected image', event.target.files[0]);

    this.bannerImage = event.target.files[0];

    console.log('this.bannerImage', this.bannerImage);
  }

  uploadBannerImage() {
    this.article.bannerImageUrl = this.bannerImage?.name;

    this.imagesService.create(this.bannerImage!)
      .subscribe({
        next: response => {
          console.log('image created response', response);
          this.bannerImage = null;
          this.toastrService.success(`Uploaded image ${this.article.bannerImageUrl}`);
        }
      });
  }
}
