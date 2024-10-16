import { Component, OnInit } from '@angular/core';

import { Article } from '../../interfaces/article';
import { ArticlesService } from '../../services/articles.service';
import { Observable } from 'rxjs';
import { PagedResult } from '../../interfaces/paged-result';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss'
})
export class ArticlesComponent implements OnInit {
  articles$!: Observable<PagedResult<Article>>;
  currentPage: number = 1;
  pageSize: number = 6; // TODO pull from local storage
  initialised: boolean = false;

  constructor(public articlesService: ArticlesService) { }

  ngOnInit() {
    this.loadArticles();
    this.initialised = true;
  }

  loadArticles() {
    const skip = (this.currentPage - 1) * this.pageSize;
    this.articles$ = this.articlesService.getArticles(skip, this.pageSize);

    this.articles$.subscribe(pagedResult => {
      console.log('Paged Result:', pagedResult);
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
