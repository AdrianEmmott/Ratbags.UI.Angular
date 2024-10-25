import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription, from, map, of, switchMap, tap } from 'rxjs';

import { Article } from '../../../interfaces/article';
import { CanComponentDeactivate } from '../../../interfaces/can-component-deactivate';
import { AccountsService } from '../../../services/account/accounts.service';
import { AppConfigService } from '../../../services/app-config.service';
import { ArticlesService } from '../../../services/articles.service';
import { CommentsService } from '../../../services/comments.service';
import { ImagesService } from '../../../services/images.service';

// icons
import { faComments, faEye } from '@fortawesome/free-regular-svg-icons';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss',
})
export class ArticleComponent implements OnInit, CanComponentDeactivate, OnDestroy {
  isLoggedIn$ = this.accountsService.validateToken$;
  localSaveChangesSubscription!: Subscription;

  localSubscription!: Subscription;

  form!: FormGroup;

  article!: Article;
  showEditor: boolean = false;

  bannerImage: File | null = null;
  bannerImageUrl: string | null = null;

  formDirty: boolean = true; 

  // icons
  faCoffee = faCoffee;
  faComments = faComments;
  faEye = faEye;

  constructor(private route: ActivatedRoute,
    public router: Router,
    private formBuilder: FormBuilder,
    private appConfigService: AppConfigService,
    public accountsService: AccountsService,
    private articlesService: ArticlesService,
    private commentsService: CommentsService,
    private imagesService: ImagesService,
    private toastrService: ToastrService,) {
  }

  ngOnInit() {
    this.accountsService.validateToken(); // is user logged in - check once...

    // there's a lot going on here...
    //
    // 1  - grab the article id from route
    //
    // 2a - get article from api if viewing / or return existing article if editing. returns article and editing flag to next switchMap
    // 2b - or setup a new article if creating. returns article and editing flag to next switchMap
    //
    // 3a - check for banner image
    // 3b - grab the image from the api
    // 3c - map the image into our return. returns article, editing flag and image src (a blob url)
    // 3d - side effect - set the bannerImageUrl from the get
    // 3e - don't have a banner image? that's cool, just pass along an empty string. returns article, edit flag and empty imageSrc
    //
    // 4 - check if save clicked
    //
    // 5a - handles save article
    // 5b - update article
    // 5c - create create
    // 5d - not saving
    //
    // 6a - set up article and showEditor flag
    // 6b - set up edit form if needed
    this.localSubscription = this.route.paramMap
      .pipe(
        switchMap(
          params => {
            // check for params and get / create article

            // 1 - grab the article id from route
            const id = params.get('id');

            if (id) {
              // 2a - get article from api if viewing / or return existing article if editing. returns article and editing flag to next switchMap
              return this.articlesService.getArticleOrUseExisting(id, this.article);
            }
            else {
              // 2b - or setup a new article if creating. returns article and editing flag to next switchMap
              return of({ article: this.setupCreate(), edit: true });
            }
          }
        ),
        switchMap(
          ({ article, edit }) => {
            // 3 - check for banner image
            if (article && article.bannerImageUrl) {
              // 3b - grab the image from the api
              return this.imagesService.get(article.bannerImageUrl)
                .pipe(
                  map(
                    // 3c - map the image into our return. returns article, editing flag and image src (a blob url)
                    (imageSrc) =>
                      ({ article: article, edit: edit, imageSrc: imageSrc })
                  ),
                  tap(result => {
                    // 3d - side effect - set the bannerImageUrl from the get
                    this.bannerImageUrl = result.imageSrc;
                  })
                )
            }
            else {
              // 3e - don't have a banner image? that's cool, just pass along an empty string as part of the return
              return of({ article: article, edit: edit, imageSrc: '' });
            }
          }
        ),
        switchMap(
          ({ article, edit, imageSrc }) => {
            // 4 - check if save clicked
            return this.articlesService.saveChanges$
              .pipe(
                map(saving => ({ article: article, edit: edit, imageSrc: imageSrc, save: saving }) // return this
                )
              )

            // no save
            return of({ article: article, edit: edit, imageSrc: imageSrc, save: false }); // return this
          }
        ),
        switchMap(
          ({ article: article, edit: edit, imageSrc: imageSrc, save: save }) => {
            // 5a - handles save article
            if (save) {
              this.updateModelFromForm();

              if (article?.id) {
                // 5b - update article
                return this.articlesService.update(article)
                  .pipe(
                    map(
                      response => ({ article: article, edit: edit, imageSrc: imageSrc, save: true, create: false, id: article.id }) // return this
                    )
                  )
              }
              else {
                // 5c - create article
                return this.articlesService.create(<Article>this.article)
                  .pipe(
                    map(
                      response => {
                        return ({ article: article, edit: edit, imageSrc: imageSrc, save: true, create: true, id: response.body }); // return this inc. new id
                      }
                    )
                  )
              }
            }

            // 5d - not saving
            return of({ article: article, edit: edit, imageSrc: imageSrc, save: false, create: false, id: article.id }); // return this
          }
        )
      )
      .subscribe({
        next:
          ({ article, edit, imageSrc, save, create, id }) => {
            if (save) {
              this.articlesService.saveChanges(false);
              this.articlesService.editFinished();

              // if creating , redirect to the article by id
              if (create) {
                this.router.navigate(['/articles', id]);
              }
            }

            // 6a - set up article and showEditor flag
            this.article = article;
            this.showEditor = edit;

            // 6b - set up edit form if needed
            if (this.showEditor) {
              this.setupForm();
            }
          }
      });
  }

  ngOnDestroy() {
    if (this.localSubscription) {
      this.localSubscription.unsubscribe();
    }

    this.commentsService.showCommentsOffCanvas(false);
  }

  // we good to navigate away from the page?
  canDeactivate(): boolean {
    return !(this.showEditor && this.form.dirty);
  }

  // *** clean up editor mode and stop site blowing up when viewing other articles ***
  //
  // without this cleanup, if the user views other articles after editing AND abandoning that edit by navigating away,
  // any subsequent article views will open in edit mode - which we don't want and we'll get errors.
  //
  // this is because we get into article edit mode on this component more from a menu item on the navbar -
  // it fires editArticleSubject(true) in the articlesService, and is observed by editArticle$, also in that service.
  //
  // editArticle$ is observed by getArticleOrUseExisting method, also in that service.
  // ...and breathe...
  editFinished() {
    this.localSubscription.unsubscribe(); // do this before editFinished or ngOnInit will fire again

    if (this.showEditor) {
      this.articlesService.editFinished();
    }
  }

  setupForm() {
    this.form = new FormGroup({
      title: new FormControl(this.article?.title, [Validators.required]),
      content: new FormControl(this.article.content, [Validators.required]),
      description: new FormControl(this.article.description, [Validators.required]),
      introduction: new FormControl(this.article.introduction)
    });
  }

  showComments() {
    // fires behaviour subject on service which the comments component subscribes to
    this.commentsService.showCommentsOffCanvas(true);
  }

  // TODO everything below probably needs to go into an editor component
  
  setupCreate(): Article {
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

    this.setupForm();

    return this.article;
  }
  
  updateModelFromForm() {
    if (this.article) {
      this.article.title = this.form?.controls['title'].value;
      this.article.description = this.form?.controls['description'].value;
      this.article.introduction = this.form?.controls['introduction'].value;
      this.article.content = this.form?.controls['content'].value;

      if (this.bannerImage) {
        this.article.bannerImageUrl = this.bannerImage.name;
      }
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
