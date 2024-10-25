import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { AppConfigService } from './app-config.service';
import { Comment } from '../interfaces/comment';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private apiUrl = `${this.appConfigService.apiBaseUrl}/api/comments`;

  showCommentsOffCanvasSubject = new BehaviorSubject<boolean>(false); // useful when components other than comments.component want to show comments
  showCommentsOffCanvas$ = this.showCommentsOffCanvasSubject.asObservable();

  constructor(private http: HttpClient,
    private appConfigService: AppConfigService) { }

  create(comment: Comment): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}`, comment);
  }

  getCommentsByArticleId(id: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.apiUrl}/article/${id}`);
  }

  showCommentsOffCanvas(show: boolean) {
    this.showCommentsOffCanvasSubject.next(show);
  }
}
