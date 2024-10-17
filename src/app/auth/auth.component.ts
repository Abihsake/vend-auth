import { Component } from '@angular/core';
import { LanguageService } from '../core/services/language.service';
import { Assets } from '../core/shared/assets';
import { Constants } from '@core/shared/constants';
import { ContentfulService } from '@core/services/contentful.service';
import { ContentfulContentTypes } from '@core/enum/contentful';
import { ITestimonial, ITestimonialContentTypeResponse } from '@core/components/testimonials/models/testimonials.model';
import { map } from 'rxjs';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent {
  vendeaseLogo = Assets.LOGOS.VENDEASE_BLACK;
  existingLanguage$ = this.languageService.language$;

  testimonials!: ITestimonial[];

  constructor(
    private languageService: LanguageService,
    private contentfulService: ContentfulService
  ) {
    this.getTestimonialsFromContentful();
  }

  getTestimonialsFromContentful() {
    const contentType = ContentfulContentTypes.TESTIMONIALS;
    this.contentfulService
      .getEntries(contentType)
      .pipe(
        map((res) => {
          const response = res as ITestimonialContentTypeResponse[];
          const testimonials = response.map((testimonial) => {
            return {
              testimonial: testimonial.fields.testimonial,
              testifier: {
                name: testimonial.fields.testifierName,
                roleDescription: testimonial.fields.testifierDescription,
                image: testimonial.fields.testifierImage.fields.file.url,
                business: {
                  name: testimonial.fields.businessName,
                  logo: testimonial.fields.businessLogo.fields.file.url
                }
              }
            };
          });
          return testimonials;
        })
      )
      .subscribe({
        next: (testimonials) => {
          this.testimonials = testimonials;
        },
        error: (err) => {
          console.info(err);
          this.testimonials = this.generateSlidesManually();
        }
      });
  }

  generateSlidesManually(): ITestimonial[] {
    const testimonials = Constants.TESTIMONIALS;
    const slides = testimonials.map((testimonial) => {
      return {
        testimonial: testimonial.testimonial,
        testifier: {
          name: testimonial.testifier.name,
          roleDescription: testimonial.testifier.description,
          image: testimonial.testifier.image,
          business: {
            name: testimonial.business.name,
            logo: testimonial.business.logo
          }
        }
      };
    });
    return [...slides, ...slides, ...slides];
  }
}
