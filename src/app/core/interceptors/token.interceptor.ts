import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';
import { Constants } from '../shared/constants';
import { EncryptionService } from '@core/services/encryption.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {
  private ENCRYPTION_KEY = `${environment.app}-${environment.appId}`;
  constructor(
    private storageService: StorageService,
    private encryptionService: EncryptionService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.encryptionService.decrypt(
      this.ENCRYPTION_KEY,
      this.storageService.get(Constants.STORAGE_VARIABLES.TOKEN),
      Constants.STORAGE_VARIABLES.TOKEN
    );

    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request);
  }
}
