import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UrlInterceptorService implements HttpInterceptor {
  constructUrl(url: string): string {
    const constructedUrl = url
      .split('/')
      .filter((_url_part, i) => i !== 0)
      .join('/');
    return constructedUrl;
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const url_marker = request.url.split('/')[0];

    switch (url_marker.toLowerCase()) {
      case environment.BUSINESS_SERVICE.MARKER.toLowerCase(): {
        // construct url as business service url

        const business_service_url = environment.BUSINESS_SERVICE.URL + '/' + this.constructUrl(request.url);
        request = request.clone({ url: business_service_url });
        break;
      }
      case environment.AUTH_SERVICE.MARKER.toLowerCase(): {
        // construct url as auth service url

        const auth_service_url = environment.AUTH_SERVICE.URL + '/' + this.constructUrl(request.url);

        request = request.clone({
          url: auth_service_url
        });
        break;
      }
      case environment.TENANT_USER_MANAGEMENT_SERVICE.MARKER.toLowerCase(): {
        // construct url as tum service url

        const tums_service_url = environment.TENANT_USER_MANAGEMENT_SERVICE.URL + '/' + this.constructUrl(request.url);

        request = request.clone({
          url: tums_service_url
        });
        break;
      }
    }

    return next.handle(request);
  }
}
