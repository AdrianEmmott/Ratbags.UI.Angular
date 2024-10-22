import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { AppConfigService } from './app-config.service';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  private apiUrl = `${this.appConfigService.apiBaseUrl}/api/images`;

  constructor(private http: HttpClient,
    private appConfigService: AppConfigService) { }

  create(file: File): Observable<File> {
    const formData: FormData = new FormData();
    formData.append('image', file);

    return this.http.post<File>(`${this.apiUrl}`, formData);
  }

  get(filename: string): Observable<string> {
    return this.http
      .get(`${this.apiUrl}/${filename}`, { responseType: 'blob' })
      .pipe(
        map(
          blob => {
            var returnUrl = window.URL.createObjectURL(blob);
            console.log('returnUrl', returnUrl);
            return returnUrl;
          }
        )
      );
  }
}
