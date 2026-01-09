import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './core/components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
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
