import { HttpClient } from '@angular/common/http';
import { Injectable} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemesService {
  defaultTheme: string = 'dark';

  // a nosey sod and a blabber-mouth
  private showLightThemeButtonSubject = new BehaviorSubject<boolean>(this.showLightThemeButton());
  showLightThemeButton$: Observable<boolean> = this.showLightThemeButtonSubject.asObservable();

  constructor() {
    this.setTheme(this.getTheme());
  }

  // are we showing light or dark theme button?
  showLightThemeButton(): boolean {
    const theme = this.getTheme();
    return theme === 'dark';
  }
  updateShowLightThemeButton() {
    this.showLightThemeButtonSubject.next(this.showLightThemeButton());
  }

  getTheme(): string {
    const theme = localStorage.getItem('theme')?.toString() ?? this.defaultTheme;
    return theme;
  }

  setTheme(theme: string) {
    theme = theme ?? this.defaultTheme;

    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem('theme', theme);

    this.updateShowLightThemeButton();
  }
}
