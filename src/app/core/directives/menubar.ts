import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appMenubar]',
  standalone: true,
})
export class MenubarDirective {
  constructor(private el: ElementRef) {}

  @HostListener('keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    const menuItems = Array.from(
      this.el.nativeElement.querySelectorAll('[role="menuitem"]')
    ) as HTMLElement[];

    const currentIndex = menuItems.indexOf(document.activeElement as HTMLElement);
    if (currentIndex === -1) return;

    let nextIndex: number;

    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        nextIndex = (currentIndex + 1) % menuItems.length;
        menuItems[nextIndex].focus();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        nextIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
        menuItems[nextIndex].focus();
        break;
      case 'Home':
        event.preventDefault();
        menuItems[0].focus();
        break;
      case 'End':
        event.preventDefault();
        menuItems[menuItems.length - 1].focus();
        break;
    }
  }
}
