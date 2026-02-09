import { Injectable ,signal,PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  //Signal
  private platformId = inject(PLATFORM_ID);
  private darkMode = signal<boolean>(true);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      this.darkMode.set(savedTheme !== 'light');
    }
  }

  isDarkMode = this.darkMode.asReadonly();

  toggleTheme() {
    this.darkMode.update(mode => !mode);
    
    // Only save to localStorage if we are in a browser
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('theme', this.darkMode() ? 'dark' : 'light');
    }
  }
}
