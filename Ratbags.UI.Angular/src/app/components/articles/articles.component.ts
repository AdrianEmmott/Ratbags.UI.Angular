import { Component, OnInit } from '@angular/core';

import { Article } from '../../interfaces/article';
import { ArticlesService } from '../../services/articles.service';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss'
})
export class ArticlesComponent implements OnInit {
  articles$ = this.articlesService.getArticles();

  constructor(public articlesService: ArticlesService) { }

  ngOnInit() {
    this.articles$.subscribe();
  }
}
