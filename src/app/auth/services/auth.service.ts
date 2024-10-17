import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable, map } from 'rxjs';
import { StorageService } from 'src/app/core/services/storage.service';
import { Constants } from 'src/app/core/shared/constants';
import { Endpoint } from 'src/app/core/shared/endpoints';
import { environment } from 'src/environments/environment';
import {
  ICreatePasswordPayload,
  IForgotPasswordPayload,
  IForgotPasswordResponse,
  IResend2FAPayload,
  IResendEmailVerificationPayload,
  IResendVerificationOTPPayload,
  IResendVerificationOTPResponse,
  IResetPasswordPayload,
  ISignInPayload,
  ISignUpPayload,
  ISignUpResponse,
  ISignupFormData,
  ISsoQueryData,
  IValidate2FAPayload,
  IVerifyEmailPayload,
  IVerifyEmailResponse,
  IVerifyEmailWithOTPPayload,
  IVerifyUniqueEmailPayload
} from '../models/auth.model';
import { ISignInResponse, IUserData } from 'src/app/core/models/user.model';
import { DOCUMENT } from '@angular/common';
import { EncryptionService } from 'src/app/core/services/encryption.service';
import { IApiSuccessResponse } from '@core/models/IApiResponse.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private jwtHelper = new JwtHelperService();
  private ENCRYPTION_KEY = `${environment.app}-${environment.appId}`;
  private SSO_ENCRYPTION_KEY = `${environment.baseDomain}-${Constants.SSO_QUERY_KEY}-encryption`;

  constructor(
    private http: HttpClient,
    private storageService: StorageService,
    private encryptionService: EncryptionService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document
  ) {}

  sso_encrypt = (value: string) => {
    return this.encryptionService.encrypt(this.SSO_ENCRYPTION_KEY, value);
  };

  sso_decrypt = (token: string): string => {
    if (token) {
      return this.encryptionService.decrypt(this.SSO_ENCRYPTION_KEY, token);
    }
    return token;
  };

  construct_sso_redirect_url(url: string, token: string): string {
    const sso_query = this.sso_encrypt(token);
    const sso_url = `${url}?${Constants.SSO_QUERY_KEY}=${sso_query}`;

    return sso_url;
  }

  redirect_to_external_url(url: string): void {
    this.document.location.replace(url);
  }

  SSOredirect(sso_data: ISsoQueryData, loginData: IUserData): void {
    const sso_query = { token: loginData.accessToken };
    const sso_url = this.construct_sso_redirect_url(sso_data.url, JSON.stringify(sso_query));

    this.redirect_to_external_url(sso_url);
  }

  SSOredirectToRMS(loginData: IUserData) {
    const sso_query = { token: loginData.accessToken };
    const sso_url = this.construct_sso_redirect_url(environment.RMS_URL, JSON.stringify(sso_query));

    this.redirect_to_external_url(sso_url);
  }

  getAccessToken(): string {
    return this.encryptionService.decrypt(
      this.ENCRYPTION_KEY,
      this.storageService.get(Constants.STORAGE_VARIABLES.TOKEN),
      Constants.STORAGE_VARIABLES.TOKEN
    );
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    return !this.jwtHelper.isTokenExpired(token);
  }

  clearUserSessionData() {
    this.storageService.clear_all();
  }

  goToSignIn(return_url?: string) {
    if (return_url) {
      this.router.navigate(['/auth/sign-in'], {
        queryParams: { return_url: return_url }
      });
    } else {
      this.router.navigate(['/auth/sign-in']);
    }
  }

  signUp(payload: ISignUpPayload): Observable<ISignUpResponse> {
    return this.http.post<ISignUpResponse>(`${Endpoint.BUSINESS.business}`, payload).pipe(
      map((response) => {
        return response;
      })
    );
  }

  signIn(payload: ISignInPayload): Observable<ISignInResponse | IUserData> {
    return this.http.post<ISignInResponse | IUserData>(`${Endpoint.AUTH.login}`, payload).pipe(
      map((response) => {
        return response;
      })
    );
  }

  sendPasswordResetLink(payload: IForgotPasswordPayload): Observable<IForgotPasswordResponse> {
    return this.http.post<IForgotPasswordResponse>(`${Endpoint.AUTH.send_reset_link}`, payload).pipe(
      map((response) => {
        return response;
      })
    );
  }

  resetPassword(payload: IResetPasswordPayload) {
    return this.http.post(`${Endpoint.AUTH.reset_password}`, payload).pipe(
      map((response) => {
        return response;
      })
    );
  }

  getSignUpFormData(): Observable<ISignupFormData> {
    return this.http.get<ISignupFormData>(`${Endpoint.FORM_DATA.signup}`).pipe(
      map((response) => {
        return response;
      })
    );
  }

  verifyEmail(payload: IVerifyEmailPayload): Observable<IVerifyEmailResponse> {
    return this.http.post<IVerifyEmailResponse>(`${Endpoint.AUTH.verify_email}`, payload).pipe(
      map((response) => {
        return response;
      })
    );
  }

  checkIfEmailExist(payload: IVerifyUniqueEmailPayload): Observable<boolean> {
    return this.http.post<boolean>(`${Endpoint.AUTH.email_check}`, payload).pipe(
      map((response) => {
        return response;
      })
    );
  }

  sendEmailVerificationLink(payload: IResendEmailVerificationPayload) {
    return this.http.post(`${Endpoint.AUTH.send_email_verification_link}`, payload).pipe(
      map((response) => {
        return response;
      })
    );
  }

  verifyEmailWithOTP(payload: IVerifyEmailWithOTPPayload) {
    return this.http.post<IApiSuccessResponse<IUserData>>(`${Endpoint.AUTH.verify_email}`, payload).pipe(
      map((response) => {
        return response.data;
      })
    );
  }

  validate2FA(payload: IValidate2FAPayload) {
    return this.http.post<IUserData>(`${Endpoint.AUTH.validate_2fa}`, payload).pipe(
      map((response) => {
        return response;
      })
    );
  }

  resendVerificationOTP(payload: IResendVerificationOTPPayload): Observable<IResendVerificationOTPResponse> {
    return this.http.post<IResendVerificationOTPResponse>(`${Endpoint.AUTH.resend_verification_otp}`, payload).pipe(
      map((response) => {
        return response;
      })
    );
  }

  resend2FA(payload: IResend2FAPayload): Observable<IResendVerificationOTPResponse> {
    return this.http.post<IResendVerificationOTPResponse>(`${Endpoint.AUTH.resend_2fa}`, payload).pipe(
      map((response) => {
        return response;
      })
    );
  }

  createPassword(payload: ICreatePasswordPayload) {
    return this.http.patch(`${Endpoint.AUTH.create_user_password}`, payload).pipe(
      map((response) => {
        return response;
      })
    );
  }
}
