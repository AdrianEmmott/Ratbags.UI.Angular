import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppConfigService } from './app-config.service';
import { Comment } from '../interfaces/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private apiUrl = `${this.appConfigService.apiBaseUrl}/api/comments`;

  constructor(private http: HttpClient,
    private appConfigService: AppConfigService) { }

  create(comment: Comment): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}`, comment);
  }

  getCommentsByArticleId(id: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/article/${id}`);
  }
}
