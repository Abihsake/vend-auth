import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, ParamMap, Router, RouterModule } from '@angular/router';
import { AUTH_NOTIFICATION_IDS } from '@auth/data/auth-data';
import { IResetPasswordForm, IForgotPasswordForm } from '@auth/models/auth-form.model';
import {
  IResetPasswordPayload,
  IForgotPasswordPayload,
  IVerifyOTPRouterState,
  VerificationTypeEnum,
  IResetPasswordRouterState
} from '@auth/models/auth.model';
import { AuthService } from '@auth/services/auth.service';
import { ErrorDisplayComponent } from '@core/components/error-display/error-display.component';
import { Assets } from '@core/shared/assets';
import { SharedModule } from '@core/shared/shared.module';
import { DisplayErrorMessage, matchPasswordValidator } from '@core/utilities/input-validation';
import { REG_EXP } from '@core/utilities/reg-exp';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    SharedModule,
    RouterModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    ErrorDisplayComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  MAIL_ICON = Assets.ICONS.MAIL;
  private token!: string;
  private otp!: string;
  private emailOrPhoneNumber!: string;
  public pageAction!: 'resetPassword' | 'forgotPassword';

  public displayError = DisplayErrorMessage;
  public REG_EXP = REG_EXP;
  apiError = {
    status: false,
    message: ''
  };

  NOTIFICATION_IDS = AUTH_NOTIFICATION_IDS;

  public resetPasswordForm!: FormGroup<IResetPasswordForm>;
  public isResettingPassword = false;
  private resetPasswordSub!: Subscription;

  public forgotPasswordForm!: FormGroup<IForgotPasswordForm>;
  public isSendingResetPasswordLink = false;
  private sendResetPasswordLinkSub!: Subscription;

  passwordFields = {
    password: {
      visible: false,
      inputType: 'password'
    },
    confirmPassword: {
      visible: false,
      inputType: 'password'
    }
  };

  EYE_ICON = Assets.ICONS.EYE.name;
  EYE_SLASH_ICON = Assets.ICONS.EYE_SLASH.name;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    // get pageAction from router state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      const { pageAction, otp, requestToken, emailOrPhoneNumber } = navigation.extras
        .state as IResetPasswordRouterState;
      this.pageAction = pageAction;
      this.token = requestToken;
      this.otp = otp;
      this.emailOrPhoneNumber = emailOrPhoneNumber;
    }
  }

  ngOnInit(): void {
    this.setPage();
  }

  setPage() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (this.pageAction) {
        this.initForm(this.pageAction);
        return;
      }
      if (params.has('token')) {
        const token = params.get('token');
        if (token) {
          this.token = token;
        }
        this.pageAction = 'resetPassword';
        this.initForm(this.pageAction);
      } else {
        this.pageAction = 'forgotPassword';
        this.initForm(this.pageAction);
      }
    });
  }

  initForm(pageAction: 'resetPassword' | 'forgotPassword') {
    if (pageAction === 'resetPassword') {
      this.resetPasswordForm = this.fb.nonNullable.group({
        userPassword: this.fb.nonNullable.group(
          {
            password: ['', [Validators.required, Validators.pattern(this.REG_EXP.PASSWORD)]],
            confirmPassword: ['', Validators.required]
          },
          { validators: matchPasswordValidator, updateOn: 'blur' }
        ),
        token: [this.token, [Validators.required]],
        otp: [this.otp, [Validators.required]]
      });
    } else if (pageAction === 'forgotPassword') {
      this.forgotPasswordForm = this.fb.nonNullable.group({
        emailOrPhoneNumber: ['', [Validators.required]]
      });
    }
  }

  get forgotPasswordFormData(): IForgotPasswordForm {
    return this.forgotPasswordForm.controls;
  }

  get resetPasswordFormData(): IResetPasswordForm {
    return this.resetPasswordForm.controls;
  }

  onSubmit(formPayload: IResetPasswordForm | IForgotPasswordForm, pageAction: 'resetPassword' | 'forgotPassword') {
    if (this.apiError.status) this.apiError = { status: false, message: '' };

    if (pageAction === 'resetPassword') {
      const resetPasswordForm = formPayload as IResetPasswordForm;

      const resetPasswordPayload: IResetPasswordPayload = {
        password: resetPasswordForm.userPassword.controls.password.value,
        otp: resetPasswordForm.otp.value,
        requestToken: resetPasswordForm.token.value
      };

      this.resetPassword(resetPasswordPayload);
    } else if (pageAction === 'forgotPassword') {
      const forgotPasswordForm = formPayload as IForgotPasswordForm;

      const forgotPasswordPayload: IForgotPasswordPayload = {
        emailOrPhoneNumber: forgotPasswordForm.emailOrPhoneNumber.value
      };

      this.forgotPassword(forgotPasswordPayload);
    }
  }

  resetPassword(payload: IResetPasswordPayload): void {
    this.isResettingPassword = true;
    this.resetPasswordSub = this.authService.resetPassword(payload).subscribe({
      next: () => {
        this.isResettingPassword = false;
        this.router.navigate(['/auth/notification', this.NOTIFICATION_IDS.PASSWORD_RESET_SUCCESS]);
      },
      error: (error) => {
        this.isResettingPassword = false;
        this.apiError = {
          status: true,
          message: error
        };
        this.goToOTPVerificationPage(payload.requestToken, this.emailOrPhoneNumber, true);
      }
    });
  }

  forgotPassword(payload: IForgotPasswordPayload): void {
    this.isSendingResetPasswordLink = true;
    this.sendResetPasswordLinkSub = this.authService.sendPasswordResetLink(payload).subscribe({
      next: (response) => {
        this.isSendingResetPasswordLink = false;
        // this.router.navigate(['/auth/notification', this.NOTIFICATION_IDS.PASSWORD_RESET_LINK_SENT]);
        this.goToOTPVerificationPage(response.requestToken, this.forgotPasswordFormData.emailOrPhoneNumber.value);
        this.router.navigate;
      },
      error: (error) => {
        this.isSendingResetPasswordLink = false;
        this.apiError = {
          status: true,
          message: error
        };
        this.cdr.markForCheck();
      }
    });
  }

  goToOTPVerificationPage(token: string, emailOrPhoneNumber: string, hasError = false) {
    this.router.navigate(['/auth/verify-otp'], {
      state: <IVerifyOTPRouterState>{
        token,
        emailOrPhoneNumber,
        verificationType: VerificationTypeEnum.forgotPassword,
        hasError,
        errorMessage: this.apiError.message
      }
    });
  }

  toggleVisibility(fieldname: 'password' | 'confirmPassword', visibility: boolean) {
    this.passwordFields[fieldname].visible = visibility;
    this.passwordFields[fieldname].inputType = visibility ? 'text' : 'password';
  }
  ngOnDestroy(): void {
    this.resetPasswordSub?.unsubscribe();
    this.sendResetPasswordLinkSub?.unsubscribe();
  }
}
