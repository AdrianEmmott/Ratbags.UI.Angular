import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Observable, catchError, forkJoin, map, of, switchMap } from 'rxjs';

import { ArticleListItem } from '../../interfaces/article-list-item';
import { PagedResult } from '../../interfaces/paged-result';
import { ArticlesService } from '../../services/articles.service';
import { ImagesService } from '../../services/images.service';

// icons
import { faComments } from '@fortawesome/free-regular-svg-icons';
import { AccountsService } from '../../services/account/accounts.service';


@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss'
})
export class ArticlesComponent implements OnInit {
  articles$!: Observable<PagedResult<ArticleListItem>>;
  currentPage: number = 1;
  pageSize: number = 6; // TODO pull from local storage
  initialised: boolean = false;

  // icons
  faComments = faComments;

  constructor(
    public articlesService: ArticlesService,
    public imagesService: ImagesService,
    private cd: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private accountsService: AccountsService) { }

  ngOnInit() {
    this.loadArticles();
    this.initialised = true;

    const id = this.accountsService.userId;
    console.log('id', id);
   }

 
  loadArticles() {
    const skip = (this.currentPage - 1) * this.pageSize;

    // TODO this is way too complicated - either move the image gets into the html call
    // or handle it in articles api
    this.articles$ = this.articlesService.getArticles(skip, this.pageSize)
      .pipe(
        switchMap(
          (pagedResult: PagedResult<ArticleListItem>) => {
            const articlesWithImages$ = pagedResult.items.map(
              article => {

                if (article.thumbnailImageUrl) {
                  return this.imagesService
                    .get(article.thumbnailImageUrl)
                    .pipe(
                      map(imageSrc => {
                        //console.log(`returnUrl for article '${article.title}'`, imageSrc);
                        article.imgSrc = imageSrc;
                        return article;
                      }),
                      catchError(error => {
                        console.error(`failed to load image for article '${article.title}':`, error);
                        article.imgSrc = 'https://localhost:5001/api/images/ratbags.jpg'; // fallback to default image 
                        return of(article); // return the article with the default image
                      })
                    )
                }

                return of({ ...article, imgSrc: 'https://localhost:5001/api/images/ratbags.jpg' });
              }
            );

            return forkJoin(articlesWithImages$)
              .pipe(
                map(
                  articlesWithImages => (
                    {
                      ...pagedResult,
                      items: articlesWithImages
                    }
                  )
                )
              );
          }
        )
      );
  }


  pageChange(event: number) {
    if (this.initialised) {
      this.currentPage = event;
      this.loadArticles();
      console.log('pageChangeEvent', event);
    }
  }

  getThumbnailImageUrl(imageUrl: string): Observable<string> | null {
    if (imageUrl) {
      console.log(imageUrl);
      return this.imagesService.get(imageUrl);
    }
    return null;
  }
}
