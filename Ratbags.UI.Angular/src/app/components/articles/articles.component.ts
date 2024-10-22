import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Observable, forkJoin, map, of, switchMap } from 'rxjs';

import { Article } from '../../interfaces/article';
import { ArticleListItem } from '../../interfaces/articleListItem';
import { PagedResult } from '../../interfaces/paged-result';
import { ArticlesService } from '../../services/articles.service';
import { ImagesService } from '../../services/images.service';

// icons
import { faComments } from '@fortawesome/free-regular-svg-icons';
import { DomSanitizer } from '@angular/platform-browser';


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
    private sanitizer: DomSanitizer,) { }

  ngOnInit() {
    this.loadArticles();
    this.initialised = true;
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
                      })
                    );
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
