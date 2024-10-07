import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ConfigJSON } from '../interfaces/config.json';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {

  private appConfig!: ConfigJSON;
  errorMessage: string = 'App config file not loaded!';

  constructor(private http: HttpClient) { }

  // wrap this up in a promise for APP_INITIALIZER in app.module
  loadAppConfig(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.get<ConfigJSON>('/assets/config.json')
        .subscribe({
          next: data => {
            this.appConfig = data;
            resolve();  // keep your promises
          },
          error: error => {
            console.error('Could not load config file', error);
            reject(error);
          }
        }
        );
    });
  }

  get apiBaseUrl() {

    if (!this.appConfig) {
      throw Error(this.errorMessage);
    }

    return this.appConfig.urls.api_base_url;
  }

  get tinyMCEKey() {
    if (!this.appConfig) {
      throw Error(this.errorMessage);
    }

    return this.appConfig.tinyMCE.key;
  }
}
