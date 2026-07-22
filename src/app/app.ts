import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '@core/components/footer/footer';
import { Header } from '@core/components/header/header';
import { LanguageService } from '@core/services/language-service';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Header, TranslocoPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  public mainContent = viewChild<ElementRef<HTMLButtonElement>>('mainContent');

  constructor() {
    inject(LanguageService).restore();
  }

  /* 
    https://www.w3.org/WAI/WCAG22/Techniques/general/G1
  */
  public skipToContent(event: Event): void {
    event.preventDefault();
    if (this.mainContent) {
      this.mainContent()?.nativeElement.focus();
    }
  }
}
