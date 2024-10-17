import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';
import { SwiperOptions } from 'swiper/types';

@Directive({
  selector: '[appSwiper]',
  standalone: true
})
export class SwiperDirective implements AfterViewInit {
  private readonly _swiperElement: HTMLElement;

  @Input() config?: SwiperOptions;

  constructor(
    private el: ElementRef<
      HTMLElement & {
        initialize: () => void;
      }
    >
  ) {
    this._swiperElement = el.nativeElement;
  }

  ngAfterViewInit() {
    const swiperEl = this.el.nativeElement;

    Object.assign(swiperEl, this.config);

    swiperEl.initialize();
  }
}
