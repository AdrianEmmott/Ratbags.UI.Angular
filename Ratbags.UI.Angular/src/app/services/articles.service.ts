import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of, switchMap, tap } from 'rxjs';

import { AppConfigService } from './app-config.service';

import { Article } from '../interfaces/article';
import { ArticleListItem } from '../interfaces/article-list-item';
import { PagedResult } from '../interfaces/paged-result';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  private apiUrl = `${this.appConfigService.apiBaseUrl}/api/articles`;

  // nosey sods and blabber-mouths
  private editArticleSubject = new BehaviorSubject<boolean>(false);
  editArticle$ = this.editArticleSubject.asObservable();

  private saveChangesSubject = new BehaviorSubject<boolean>(false);
  saveChanges$ = this.saveChangesSubject.asObservable();

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

  // this thing returns an article from the api, if not editing - or just the article passed in, if editing
  getArticleOrUseExisting(id: string, article: Article | null): Observable<{ article: Article, edit: boolean }> {
    return this.editArticle$
      .pipe(
        switchMap(
          (edit) => {
            if (edit && article) {
              // we're editing so no need to get article from api - return existing article and edit mode = true
              return of({ article, edit });
            }

            // we're viewing an article so return get and return it from api - and edit mode = false
            return this.getArticle(id)
              .pipe(
                map(

                  (fetchedArticle: Article) => (
                    { article: fetchedArticle, edit }
                  )
                )
              );
          }
        )
      );
  }

  getArticle(id: string): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${id}`);
  }

  update(article: Article): Observable<any> {
    console.log('ArticlesService update article');
    return this.http.put(`${this.apiUrl}`, article);
  }

  editRequest() {
    this.editArticleSubject.next(true);
  }
  editFinished() {
    this.editArticleSubject.next(false);
  }

  saveChanges(save: boolean) {
    console.log('ArticlesService saveChanges');
    this.saveChangesSubject.next(save);
  }
}
