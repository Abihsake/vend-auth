import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription, filter, map } from 'rxjs';
import { Assets } from 'src/app/core/shared/assets';
import { DisplayErrorMessage } from 'src/app/core/utilities/input-validation';
import { REG_EXP } from 'src/app/core/utilities/reg-exp';
import { ISignInForm } from '../../models/auth-form.model';
import { SharedModule } from 'src/app/core/shared/shared.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Constants } from 'src/app/core/shared/constants';
import {
  IResend2FAPayload,
  ISignInPayload,
  ISsoQueryData,
  SignInStepEnum,
  VerificationTypeEnum
} from '../../models/auth.model';
import { ISignInResponse, IUserData } from 'src/app/core/models/user.model';
import { StorageService } from 'src/app/core/services/storage.service';
import { TenantService } from 'src/app/core/services/tenant.service';
import { UserProfileService } from 'src/app/core/services/user-profile.service';
import { AuthService } from '../../services/auth.service';
import { EncryptionService } from 'src/app/core/services/encryption.service';
import { environment } from 'src/environments/environment';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ErrorDisplayComponent } from '@core/components/error-display/error-display.component';
import { VerifyOtpComponent } from '../verify-otp/verify-otp.component';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [
    SharedModule,
    RouterModule,
    MatFormFieldModule,
    MatIconModule,
    MatDividerModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ErrorDisplayComponent,
    VerifyOtpComponent
  ],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit, OnDestroy {
  MAIL_ICON = Assets.ICONS.MAIL;
  private ENCRYPTION_KEY = `${environment.app}-${environment.appId}`;

  public signInForm!: FormGroup<ISignInForm>;
  public displayError = DisplayErrorMessage;
  public REG_EXP = REG_EXP;

  public isSigningIn = false;

  private signInSub!: Subscription;
  apiError = {
    status: false,
    message: ''
  };

  Constants = Constants;

  sso_data!: ISsoQueryData;
  SSO_QUERY_KEY = Constants.SSO_QUERY_KEY;

  passwordFields = {
    password: {
      visible: false,
      inputType: 'password'
    }
  };

  EYE_ICON = Assets.ICONS.EYE.name;
  EYE_SLASH_ICON = Assets.ICONS.EYE_SLASH.name;

  VerificationTypeEnum = VerificationTypeEnum;

  requestToken!: string;

  signInStep: SignInStepEnum = SignInStepEnum.emailAndPassword;
  SignInStepEnum = SignInStepEnum;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private encryptionService: EncryptionService,
    private storageService: StorageService,
    private userProfileService: UserProfileService,
    private tenantService: TenantService,
    private route: ActivatedRoute
  ) {
    this.getRouteQuery();
  }

  ngOnInit(): void {
    this.initForm();
  }

  getRouteQuery() {
    this.route.queryParamMap
      .pipe(
        filter((params) => params['has'](this.SSO_QUERY_KEY)),
        map((params) => params['get'](this.SSO_QUERY_KEY))
      )
      .subscribe({
        next: (sso_data) => {
          if (sso_data) {
            const decryptedSso = this.authService.sso_decrypt(sso_data);
            this.sso_data = JSON.parse(decryptedSso);
          }
        }
      });
  }

  initForm() {
    this.signInForm = this.fb.nonNullable.group({
      emailOrPhoneNumber: ['', [Validators.required]],
      password: ['', Validators.required]
    });
  }

  get signInFormData(): ISignInForm {
    return this.signInForm.controls;
  }

  onSubmit(formPayload: ISignInForm) {
    if (this.apiError.status) this.apiError = { status: false, message: '' };

    const sign_in_payload: ISignInPayload = {
      emailOrPhoneNumber: formPayload.emailOrPhoneNumber.value,
      password: formPayload.password.value
    };

    this.signIn(sign_in_payload);
  }

  signIn(payload: ISignInPayload): void {
    this.isSigningIn = true;
    this.signInSub = this.authService.signIn(payload).subscribe({
      next: (response) => {
        this.isSigningIn = false;

        if ('requestToken' in response) {
          const otpResponse = <ISignInResponse>response;

          this.requestToken = otpResponse.requestToken;
          this.signInStep = SignInStepEnum.otp;
        } else if ('accessToken' in response) {
          const loginResponse = <IUserData>response;

          this.completeSignIn(loginResponse);
        }
      },
      error: (error) => {
        this.isSigningIn = false;
        this.apiError = {
          status: true,
          message: error
        };
      }
    });
  }
  completeSignIn(userData: IUserData) {
    this.storeDetailsLocallyAndUpdateObservers(userData);
    this.isSigningIn = false;
    console.log("SSO Data : ", this.sso_data, "User Data : ", userData);

    if (this.sso_data) {
      this.SSOredirect(this.sso_data, userData);
    } else {
      this.SSOredirectToRMS(userData);
    }
  }

  resend2FA() {
    const payload: IResend2FAPayload = {
      emailOrPhoneNumber: this.signInFormData.emailOrPhoneNumber.value,
      password: this.signInFormData.password.value,
      requestToken: this.requestToken
    };
    this.authService.resend2FA(payload).subscribe({
      next: (response) => {
        this.requestToken = response.requestToken;
      },
      error: (error) => {
        this.apiError = {
          message: error,
          status: true
        };
      }
    });
  }

  backToLogin() {
    this.signInStep = SignInStepEnum.emailAndPassword;
  }

  SSOredirect(sso_data: ISsoQueryData, loginData: IUserData): void {
    this.authService.SSOredirect(sso_data, loginData);
  }

  SSOredirectToRMS(loginData: IUserData) {
    this.authService.SSOredirectToRMS(loginData);
  }

  storeDetailsLocallyAndUpdateObservers(payload: IUserData): void {
    try {
      this.storageService.set(
        Constants.STORAGE_VARIABLES.TOKEN,
        this.encryptionService.encrypt(this.ENCRYPTION_KEY, payload.accessToken, Constants.STORAGE_VARIABLES.TOKEN)
      );
      this.storageService.set(
        Constants.STORAGE_VARIABLES.USER,
        this.encryptionService.encrypt(
          this.ENCRYPTION_KEY,
          JSON.stringify(payload.user),
          Constants.STORAGE_VARIABLES.USER
        )
      );
      if (payload.tenant) {
        this.storageService.set(
          Constants.STORAGE_VARIABLES.TENANT,
          this.encryptionService.encrypt(
            this.ENCRYPTION_KEY,
            JSON.stringify(payload.tenant),
            Constants.STORAGE_VARIABLES.TENANT
          )
        );
      }
    } catch (error) {
      /* empty */
    } finally {
      this.updateUserProfileService();
      this.updateTenantService();
    }
  }

  updateUserProfileService(): void {
    const userObj = this.encryptionService.decrypt(
      this.ENCRYPTION_KEY,
      this.storageService.get(Constants.STORAGE_VARIABLES.USER),
      Constants.STORAGE_VARIABLES.USER
    );
    this.userProfileService.updateProfile(JSON.parse(userObj));
  }

  updateTenantService() {
    const tenantObj = this.encryptionService.decrypt(
      this.ENCRYPTION_KEY,
      this.storageService.get(Constants.STORAGE_VARIABLES.TENANT),
      Constants.STORAGE_VARIABLES.TENANT
    );
    if (tenantObj) {
      this.tenantService.updateProfile(JSON.parse(tenantObj));
    }
  }

  toggleVisibility(fieldname: 'password', visibility: boolean) {
    this.passwordFields[fieldname].visible = visibility;
    this.passwordFields[fieldname].inputType = visibility ? 'text' : 'password';
  }

  ngOnDestroy() {
    this.signInSub?.unsubscribe();
  }
}
