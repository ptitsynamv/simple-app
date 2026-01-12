import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  imports: [],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  public scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const startNode = document.querySelector('.navbar-brand') as HTMLElement;
    if (startNode) {
      startNode.focus();
    }
  }
}
