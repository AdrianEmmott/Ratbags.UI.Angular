import { Component, OnInit } from '@angular/core';

import { Article } from '../../interfaces/article';
import { ArticlesService } from '../../services/articles-service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss'
})
export class ArticlesComponent implements OnInit {
  articles: Article[] = [];

  constructor(private articlesService: ArticlesService) { }

  ngOnInit() {
    this.getArticles();
  }

  getArticles() {
    this.articlesService.getArticles()
      .subscribe(
        results => {
          this.articles = results;
        },
        error => {
          console.log('error', error);
        }
      );
  }
}
