import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Footer } from '@core/components/footer/footer';
import { Header } from '@core/components/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  @ViewChild('mainContent', { static: false }) mainContent!: ElementRef<HTMLElement>;

  skipToContent(event: Event) {
    event.preventDefault();
    if (this.mainContent) {
      this.mainContent.nativeElement.focus();
    }
  }
}
