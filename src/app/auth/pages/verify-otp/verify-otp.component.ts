import { AuthService } from '@auth/services/auth.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SharedModule } from '@core/shared/shared.module';
import { OtpInputComponent } from './otp-input/otp-input.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IVerifyOTPForm } from '@auth/models/auth-form.model';
import { REG_EXP } from '@core/utilities/reg-exp';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import {
  IResendVerificationOTPPayload,
  IResetPasswordRouterState,
  IValidate2FAPayload,
  IVerifyEmailWithOTPPayload,
  IVerifyOTPRouterState,
  VerificationTypeEnum
} from '@auth/models/auth.model';
import { ErrorDisplayComponent } from '@core/components/error-display/error-display.component';
import { IUserData } from '@core/models/user.model';
import { AUTH_NOTIFICATION_IDS } from '@auth/data/auth-data';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [
    SharedModule,
    OtpInputComponent,
    MatProgressSpinnerModule,
    MatButtonModule,
    RouterLink,
    ErrorDisplayComponent
  ],
  templateUrl: './verify-otp.component.html'
})
export class VerifyOtpComponent implements OnInit {
  otp = '';
  otpLength = 6;
  isSubmitting = false;
  verifyOTPForm!: FormGroup<IVerifyOTPForm>;
  @Input({ required: true }) requestToken!: string;
  @Input({ required: true }) emailOrPhoneNumber!: string;
  @Input({ required: true }) verificationType!: VerificationTypeEnum;
  @Output() reesendOTP = new EventEmitter<void>();
  @Output() OTPValidated = new EventEmitter<IUserData>();
  @Output() backToLogin = new EventEmitter();

  public apiError = {
    status: false,
    message: ''
  };

  countdownTimer!: number;

  NOTIFICATION_IDS = AUTH_NOTIFICATION_IDS;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      const {
        token,
        emailOrPhoneNumber,
        verificationType,
        hasError,
        errorMessage = ''
      } = navigation.extras.state as IVerifyOTPRouterState;
      this.requestToken = token;
      this.emailOrPhoneNumber = emailOrPhoneNumber;
      this.verificationType = verificationType;
      if (hasError) {
        this.apiError = {
          message: errorMessage,
          status: true
        };
      }
    }
  }

  ngOnInit(): void {
    this.verifyOTPForm = this.fb.nonNullable.group({
      otp: [
        '',
        [
          Validators.required,
          Validators.pattern(REG_EXP.ONLY_NUMBER),
          Validators.minLength(this.otpLength),
          Validators.maxLength(this.otpLength)
        ]
      ]
    });
    this.startCountdown();
  }

  startCountdown() {
    this.countdownTimer = 60;
    const interval = setInterval(() => {
      if (this.countdownTimer > 0) {
        this.countdownTimer--;
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }
  goBackToLogin() {
    this.backToLogin.emit();
  }
  resendOTP() {
    const payload: IResendVerificationOTPPayload = {
      emailOrPhoneNumber: this.emailOrPhoneNumber
    };
    if (this.verificationType === VerificationTypeEnum.signIn) {
      this.reesendOTP.emit();
      this.startCountdown();
    } else if (this.verificationType === VerificationTypeEnum.signUp) {
      this.authService.resendVerificationOTP(payload).subscribe({
        next: (response) => {
          this.requestToken = response.requestToken;
          this.startCountdown();
        },
        error: (error) => {
          this.apiError = {
            message: error,
            status: true
          };
        }
      });
    } else if (this.verificationType === VerificationTypeEnum.forgotPassword) {
      this.authService.sendPasswordResetLink(payload).subscribe({
        next: (response) => {
          this.requestToken = response.requestToken;
          this.startCountdown();
        },
        error: (error) => {
          this.apiError = {
            message: error,
            status: true
          };
        }
      });
    }
  }

  submit() {
    if (this.verificationType === VerificationTypeEnum.signIn) {
      this.isSubmitting = true;
      this.apiError.status = false;
      const payload: IValidate2FAPayload = {
        requestToken: this.requestToken,
        otp: this.verifyOTPForm.controls.otp.value
      };
      this.authService.validate2FA(payload).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.OTPValidated.emit(response);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.apiError = {
            message: error,
            status: true
          };
        }
      });
    } else if (this.verificationType === VerificationTypeEnum.signUp) {
      this.isSubmitting = true;
      this.apiError.status = false;
      const payload: IVerifyEmailWithOTPPayload = {
        requestToken: this.requestToken,
        otp: this.verifyOTPForm.controls.otp.value
      };
      this.authService.verifyEmailWithOTP(payload).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.goToNotificationPage(response);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.apiError = {
            message: error,
            status: true
          };
        }
      });
    } else if (this.verificationType === VerificationTypeEnum.forgotPassword) {
      this.router.navigate(['/auth/reset-password'], {
        state: <IResetPasswordRouterState>{
          pageAction: 'resetPassword',
          otp: this.verifyOTPForm.controls.otp.value,
          requestToken: this.requestToken,
          emailOrPhoneNumber: this.emailOrPhoneNumber
        }
      }); //todo: add param that sets page to enter passwords
    }
  }

  goToNotificationPage(loginData: IUserData) {
    this.router.navigate(['/auth/notification', this.NOTIFICATION_IDS.VERIFICATION_SUCCESS], { state: loginData });
  }
}
