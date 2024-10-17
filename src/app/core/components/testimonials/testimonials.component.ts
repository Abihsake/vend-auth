import { CUSTOM_ELEMENTS_SCHEMA, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Assets } from '../../shared/assets';
import Swiper from 'swiper';
import { Autoplay, Keyboard, Mousewheel, Navigation, Pagination } from 'swiper/modules';
import { SwiperOptions } from 'swiper/types';
import { SwiperDirective } from '@core/directives/swiper.directive';
import { ITestimonial } from './models/testimonials.model';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [CommonModule, SwiperDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent {
  swiper?: Swiper;

  QUOTE_ILLUSTRATION = Assets.ILLUSTRATIONS.QUOTES;

  @Input() testimonials: ITestimonial[] = [];

  public config: SwiperOptions = {
    modules: [Navigation, Pagination, Mousewheel, Keyboard, Autoplay],
    autoHeight: false,
    spaceBetween: 20,
    navigation: false,
    pagination: { clickable: true, dynamicBullets: false },
    slidesPerView: 1,
    mousewheel: true,
    cssMode: false,
    centeredSlides: true,
    autoplay: { delay: 3500, disableOnInteraction: false },
    injectStyles: [
      `
        .swiper-pagination-bullet {
          background: #D0D2DD;
          width: 16px;
          height: 16px;
        }
        .swiper-pagination-bullet-active {
          background: #0B28B7;
        }
        .swiper-pagination {
          text-align: left;
        }
        .swiper-horizontal>.swiper-pagination-bullets,
        .swiper-pagination-bullets.swiper-pagination-horizontal,
        .swiper-pagination-custom,
        .swiper-pagination-fraction {
          left: 10px;
          width: 100%;
        }
      `
    ]
  };
}
