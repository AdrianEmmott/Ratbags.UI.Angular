import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { AppConfigService } from './app-config.service';

import { Article } from '../interfaces/article';
import { ArticleListItem } from '../interfaces/articleListItem';
import { PagedResult } from '../interfaces/paged-result';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  private apiUrl = `${this.appConfigService.apiBaseUrl}/api/articles`;

  // nosey sods and blabber-mouths
  private editArticleSubject = new BehaviorSubject<boolean>(false);
  editArticle$ = this.editArticleSubject.asObservable();

  constructor(private http: HttpClient,
    private appConfigService: AppConfigService) {
  }

  create(article: Article): Observable<HttpResponse<string>> {
    return this.http.post<string>(`${this.apiUrl}`, article, { observe: 'response' });
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getArticles(skip: number, take: number): Observable<PagedResult<ArticleListItem>> {
    return this.http.get<PagedResult<ArticleListItem>>(`${this.apiUrl}/${skip}/${take}`);
  }

  getArticle(id: string): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${id}`);
  }

  update(article: Article): Observable<any> {
    return this.http.put(`${this.apiUrl}`, article);
  }

  editRequest() {
    this.editArticleSubject.next(true);
  }
  editFinished() {
    this.editArticleSubject.next(false);
  }
}
