import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LanguageService } from '@core/services/language.service';

@Injectable()
export class TranslationInterceptor implements HttpInterceptor {
  constructor(private languageService: LanguageService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const currentLanguage = this.languageService.languageData ?? '';

    // Clone the request and add the 'accept-language' header
    const modifiedReq = req.clone({
      headers: req.headers.set('Accept-Language', currentLanguage)
    });

    // Pass the modified request to the next interceptor or the backend
    return next.handle(modifiedReq);
  }
}
