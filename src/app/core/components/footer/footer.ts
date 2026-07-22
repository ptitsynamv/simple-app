import { Component } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'app-footer',
  imports: [TranslocoPipe],
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
