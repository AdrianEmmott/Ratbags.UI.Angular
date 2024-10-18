import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ArticleListItem } from '../../interfaces/articleListItem';
import { PagedResult } from '../../interfaces/paged-result';
import { ArticlesService } from '../../services/articles.service';

import { faComments } from '@fortawesome/free-regular-svg-icons';

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

  constructor(public articlesService: ArticlesService) { }

  ngOnInit() {
    this.loadArticles();
    this.initialised = true;
  }

  loadArticles() {
    const skip = (this.currentPage - 1) * this.pageSize;
    this.articles$ = this.articlesService.getArticles(skip, this.pageSize);

    this.articles$.subscribe(pagedResult => {
      console.log('pagedResult:', pagedResult);
    });
  }

  pageChange(event: number) {
    if (this.initialised) {
      this.currentPage = event;
      this.loadArticles();
      console.log('pageChangeEvent', event);
    }
  }
}
