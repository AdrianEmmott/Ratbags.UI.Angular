import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppConfigService } from './app-config.service';

import { Article } from '../interfaces/article';

@Injectable({
  providedIn: 'root'
})
export class ArticlesService {
  private apiUrl = `${this.appConfigService.apiBaseUrl}/api/articles`;

  constructor(private http: HttpClient,
    private appConfigService: AppConfigService) {
    console.log('this.appConfigService.apiBaseUrl', this.appConfigService.apiBaseUrl);

  }

  create(article: Article): Observable<HttpResponse<string>> {
    return this.http.post<string>(`${this.apiUrl}`, article, { observe: 'response' });
  }

  delete(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  getArticles(): Observable<Article[]> {
    return this.http.get<Article[]>(this.apiUrl);
  }

  getArticle(id: string): Observable<Article> {
    return this.http.get<Article>(`${this.apiUrl}/${id}`);
  }

  update(article: Article):Observable<any> {
    return this.http.put(`${this.apiUrl}`, article);
  }
}
