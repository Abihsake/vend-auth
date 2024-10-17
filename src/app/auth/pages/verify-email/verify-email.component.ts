import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AUTH_NOTIFICATION_IDS } from '@auth/data/auth-data';
import { IResendEmailVerificationForm } from '@auth/models/auth-form.model';
import { IVerifyEmailPayload, IResendEmailVerificationPayload } from '@auth/models/auth.model';
import { AuthService } from '@auth/services/auth.service';
import { DisplayErrorMessage } from '@core/utilities/input-validation';
import { REG_EXP } from '@core/utilities/reg-exp';
import { Subscription } from 'rxjs';
import { Assets } from '@core/shared/assets';
import { SharedModule } from '@core/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ErrorDisplayComponent } from '@core/components/error-display/error-display.component';

@Component({
  selector: 'app-verify-email',
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
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.scss']
})
export class VerifyEmailComponent implements OnInit, OnDestroy {
  MAIL_ICON = Assets.ICONS.MAIL;
  SPIN_LOADER = Assets.IMAGES.SPIN_LOADER;

  private token!: string;
  public pageAction!: 'isVerifyingEmail' | 'resendEmailVerification';
  public isVerifyingEmail = false;
  private verifyTokenSub!: Subscription;

  public resendEmailVerificationForm!: FormGroup<IResendEmailVerificationForm>;
  public displayError = DisplayErrorMessage;
  public REG_EXP = REG_EXP;
  public isSendingVerificationLink = false;
  private sendEmailVerificationLinkSub!: Subscription;

  NOTIFICATION_IDS = AUTH_NOTIFICATION_IDS;
  verifyEmailPayload!: IVerifyEmailPayload;

  private setPassword = false;
  apiError = {
    status: false,
    message: ''
  };

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getVerificationToken();
  }

  getVerificationToken() {
    this.route.queryParamMap.subscribe((params) => {
      const token = params.get('token');
      const setPassword = params.get('setPassword');
      if (token && setPassword) {
        this.pageAction = 'isVerifyingEmail';
        this.verifyEmailPayload = {
          token,
          setPassword: setPassword === 'true' ? true : false
        };
        this.verifyEmail(this.verifyEmailPayload);
      } else {
        this.initForm();
        this.pageAction = 'resendEmailVerification';
      }
    });
  }

  initForm() {
    this.resendEmailVerificationForm = this.fb.nonNullable.group({
      email: ['', [Validators.required, Validators.pattern(this.REG_EXP.EMAIL)]]
    });
  }

  get resendEmailVerificationFormData(): IResendEmailVerificationForm {
    return this.resendEmailVerificationForm.controls;
  }

  onSubmit(formPayload: IResendEmailVerificationForm) {
    if (this.apiError.status) this.apiError = { status: false, message: '' };

    const resend_email_verification_payload: IResendEmailVerificationPayload = {
      email: formPayload.email.value
    };
    this.sendEmailVerificationLink(resend_email_verification_payload);
  }

  sendEmailVerificationLink(payload: IResendEmailVerificationPayload): void {
    this.isSendingVerificationLink = true;
    this.sendEmailVerificationLinkSub = this.authService.sendEmailVerificationLink(payload).subscribe({
      next: () => {
        this.isSendingVerificationLink = false;
        this.goToNotificationPage(this.NOTIFICATION_IDS.VERIFICATION_SENT);
      },
      error: (error) => {
        this.isSendingVerificationLink = false;
        this.apiError = {
          status: true,
          message: error
        };
      }
    });
  }

  verifyEmail(verifyEmailPayload: IVerifyEmailPayload): void {
    this.isVerifyingEmail = true;
    this.verifyTokenSub = this.authService.verifyEmail(verifyEmailPayload).subscribe({
      next: () => {
        this.isVerifyingEmail = false;
        this.goToNotificationPage(this.NOTIFICATION_IDS.VERIFICATION_SUCCESS);
      },
      error: () => {
        this.isVerifyingEmail = false;
        this.goToNotificationPage(this.NOTIFICATION_IDS.VERIFICATION_FAILED);
      }
    });
  }

  goToNotificationPage(notificationType: string) {
    this.router.navigate(['/auth/notification', notificationType]);
  }

  goToResetPasswordPage(token: string) {
    this.router.navigate([`/auth/reset-password/${token}`]);
  }

  ngOnDestroy(): void {
    this.verifyTokenSub?.unsubscribe();
    this.sendEmailVerificationLinkSub?.unsubscribe();
  }
}
