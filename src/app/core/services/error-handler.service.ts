import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { TenantService } from './tenant.service';
import { UserProfileService } from './user-profile.service';
import { IApiErrorResponse } from '../models/IApiResponse.model';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  constructor(
    private userprofileService: UserProfileService,
    private tenantService: TenantService
  ) {}

  handleError(error?: ErrorEvent | HttpErrorResponse): Observable<never> {
    let errorMessage = '';
    if (!navigator.onLine) {
      errorMessage = 'No Internet Connection. Please check your internet provider';
    } else if (error && error instanceof HttpErrorResponse) {
      errorMessage = this.processErrorMessage(error);
    } else if (error?.error instanceof ErrorEvent) {
      errorMessage = error?.error?.message ? error?.error?.message : error?.error?.toString() ?? 'An error occurred';
    }
    // TODO: Display a toast message
    return throwError(() => new Error(errorMessage));
  }

  // returns a string of the error message from the IApiErrorResponse
  processErrorMessage(error: HttpErrorResponse): string {
    let message: string;
    const apiErrorResponse: IApiErrorResponse = error.error;
    switch (apiErrorResponse.statusCode) {
      case 401:
        message = typeof apiErrorResponse.message === 'string' ? apiErrorResponse.message : 'You are not logged in';
        this.logoutUnauthenticatedUser(); // logout user
        break;
      case 400:
      case 403:
      case 404:
      case 409:
      case 500:
        if (<string>apiErrorResponse.message !== '') {
          message = <string>apiErrorResponse.message;
        } else if ((<string[]>apiErrorResponse.message).length > 0) {
          const messageArray: string[] = <string[]>apiErrorResponse.message;
          message = messageArray.map((err: string) => err).join('<br/>');
        } else {
          message = 'An error occurred';
        }
        break;
      default:
        message = `${JSON.stringify(apiErrorResponse.message)}`;
        break;
    }
    return message;
  }

  logoutUnauthenticatedUser() {
    this.userprofileService.updateProfile(null);
    this.tenantService.updateProfile(null);
    // this.authService.clearUserSessionData();
    // this.authService.goToSignIn(this.router.routerState.snapshot.url);
  }
}
