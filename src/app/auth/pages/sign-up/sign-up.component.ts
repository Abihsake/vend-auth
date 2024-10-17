import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { PhonenumberInputComponent } from 'src/app/core/components/phonenumber-input/phonenumber-input.component';
import { Assets } from 'src/app/core/shared/assets';
import { SharedModule } from 'src/app/core/shared/shared.module';
import {
  BusinessTypes,
  ICountry,
  ISignUpPayload,
  ISignupFormData,
  IVerifyOTPRouterState,
  SignUpStepEnum,
  TenantUserTypes,
  VerificationTypeEnum
} from '../../models/auth.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  DisplayErrorMessage,
  UniqueEmailValidator,
  matchPasswordValidator,
  validateProperty
} from 'src/app/core/utilities/input-validation';
import { ISignUpForm } from '../../models/auth-form.model';
import { REG_EXP } from 'src/app/core/utilities/reg-exp';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { IPhonenumber } from '@core/components/phonenumber-input/models/phonenumber-input.model';
import { AuthService } from '@auth/services/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ErrorDisplayComponent } from '@core/components/error-display/error-display.component';
import { Constants } from '@core/shared/constants';
import { LocationStrategy } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [
    SharedModule,
    RouterModule,
    MatIconModule,
    PhonenumberInputComponent,
    MatDividerModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatFormFieldModule,
    ErrorDisplayComponent,
    MatSelectModule,
    MatChipsModule
  ],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit, OnDestroy {
  MAIL_ICON = Assets.ICONS.MAIL;
  CHECK_CIRCLE = Assets.ICONS.CHECK_CIRCLE;

  public signUpForm!: FormGroup<ISignUpForm>;
  public displayError = DisplayErrorMessage;
  public REG_EXP = REG_EXP;
  public apiError = {
    status: false,
    message: ''
  };

  countries = Constants.COUNTRIES;
  selectedCountry!: ICountry;

  isSigningUp!: boolean;
  signUpSub!: Subscription;

  SIGNUP_FORMDATA!: ISignupFormData;
  selectedBusinessTypeServices: { isSelected: boolean; service: string }[] = [];
  observeBusinessTypeCtrlSub!: Subscription;

  SignUpStepEnum = SignUpStepEnum;
  signUpFormStep = SignUpStepEnum.BusinessDetails;

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
    private fb: FormBuilder,
    private uniqueEmailValidator: UniqueEmailValidator,
    private router: Router,
    private authService: AuthService,
    private location: LocationStrategy
  ) {
    this.getSignupFormdata();
  }

  setCountry(country: ICountry) {
    this.selectedCountry = country;
  }

  ngOnInit(): void {
    this.initForm();
    this.setCountries();
    this.handleBackNavigation();
  }

  initForm() {
    this.signUpForm = this.fb.nonNullable.group({
      signUpBusinessDetailsForm: this.fb.nonNullable.group({
        fullName: ['', Validators.required],
        email: [
          '',
          [Validators.pattern(this.REG_EXP.EMAIL), Validators.required],
          this.uniqueEmailValidator.validate.bind(this.uniqueEmailValidator),
          { updateOn: 'blur' }
        ],
        phoneNumber: [
          {} as IPhonenumber,
          [Validators.required, validateProperty('number', [Validators.pattern(this.REG_EXP.PHONE)])]
        ],
        businessName: ['', Validators.required],
        businessType: ['', Validators.required]
      }),
      signUpPasswordForm: this.fb.nonNullable.group(
        {
          password: ['', [Validators.required, Validators.pattern(this.REG_EXP.PASSWORD)]],
          confirmPassword: ['', Validators.required],
          termsAndConditions: [false, Validators.requiredTrue]
        },
        { validators: matchPasswordValidator }
      )
    });
  }

  get signUpFormData(): ISignUpForm {
    return this.signUpForm.controls;
  }

  getSignupFormdata() {
    this.authService
      .getSignUpFormData()
      .pipe()
      .subscribe({
        next: (response) => {
          this.SIGNUP_FORMDATA = response;
          if (this.SIGNUP_FORMDATA?.businessTypes?.length) {
            this.updateBusinessTypeValueAndState(this.SIGNUP_FORMDATA.businessTypes);
          }
        },
        error: (error) => {
          this.apiError = {
            message: `Failed to get form data: '${error}'. Please refresh browser.`,
            status: true
          };
        }
      });
  }

  updateBusinessTypeValueAndState(businessTypes: ISignupFormData['businessTypes']) {
    const defaultBusinessType = businessTypes.find(
      (businessType) => businessType.name.toLowerCase() === BusinessTypes.RESTAURANT
    );

    if (defaultBusinessType) {
      this.signUpFormData.signUpBusinessDetailsForm.controls.businessType.patchValue(defaultBusinessType.id);
      this.disableBusinessTypeCtrl();
    }
  }

  disableBusinessTypeCtrl() {
    this.signUpFormData.signUpBusinessDetailsForm.controls.businessType.disable();
  }

  setCountries() {
    const defaultCountry = this.countries[0];
    if (defaultCountry) {
      this.signUpFormData.signUpBusinessDetailsForm.controls.phoneNumber.patchValue({
        code: defaultCountry.phoneCode,
        number: ''
      });
    }
  }

  onSubmit(formPayload: ISignUpForm) {
    if (this.signUpFormStep === SignUpStepEnum.BusinessDetails) {
      this.signUpFormStep = SignUpStepEnum.Password;
      return;
    }

    if (this.apiError.status) this.apiError = { status: false, message: '' };

    const sign_up_payload: ISignUpPayload = {
      fullName: formPayload.signUpBusinessDetailsForm.controls.fullName.value,
      phoneNumber: `${formPayload.signUpBusinessDetailsForm.controls.phoneNumber.value.code}${formPayload.signUpBusinessDetailsForm.controls.phoneNumber.value.number}`,
      email: formPayload.signUpBusinessDetailsForm.controls.email.value,
      businessName: formPayload.signUpBusinessDetailsForm.controls.businessName.value,
      businessTypeId: formPayload.signUpBusinessDetailsForm.controls.businessType.value,
      metadata: { core: { tenantUserType: TenantUserTypes.ENTERPRISE } },
      password: formPayload.signUpPasswordForm.controls.password.value
    };
    if (!sign_up_payload.email) delete sign_up_payload.email;

    this.signUp(sign_up_payload);
  }

  signUp(payload: ISignUpPayload): void {
    this.isSigningUp = true;
    this.signUpSub = this.authService.signUp(payload).subscribe({
      next: (response) => {
        this.isSigningUp = false;

        this.goToOTPVerificationPage(
          response.requestToken,
          this.signUpFormData.signUpBusinessDetailsForm.controls.email.value
        );
      },
      error: (error) => {
        this.isSigningUp = false;
        this.apiError = {
          status: true,
          message: error
        };
        this.signUpFormStep = SignUpStepEnum.BusinessDetails;
        this.signUpForm.controls.signUpPasswordForm.reset();
      }
    });
  }

  get pageTitle() {
    return this.signUpFormStep === SignUpStepEnum.BusinessDetails
      ? 'auth.sign_up.business_details.page_title'
      : 'auth.sign_up.password.page_title';
  }

  get pageSubtitle() {
    return this.signUpFormStep === SignUpStepEnum.BusinessDetails
      ? 'auth.sign_up.business_details.page_subtitle'
      : 'auth.sign_up.password.page_subtitle';
  }

  toggleVisibility(fieldname: 'password' | 'confirmPassword', visibility: boolean) {
    this.passwordFields[fieldname].visible = visibility;
    this.passwordFields[fieldname].inputType = visibility ? 'text' : 'password';
  }

  handleBackNavigation() {
    history.pushState(null, '', window.location.href);
    // check if back or forward button is pressed.
    this.location.onPopState(() => {
      history.pushState(null, '', window.location.href);
      if (this.signUpFormStep === SignUpStepEnum.Password) {
        this.signUpFormStep = SignUpStepEnum.BusinessDetails;
        this.signUpForm.controls.signUpPasswordForm.reset();
      } else {
        this.location.back();
      }
    });
  }

  goToOTPVerificationPage(token: string, emailOrPhoneNumber: string) {
    this.router.navigate(['/auth/verify-otp'], {
      state: <IVerifyOTPRouterState>{ token, emailOrPhoneNumber, verificationType: VerificationTypeEnum.signUp }
    });
  }

  ngOnDestroy(): void {
    this.signUpSub?.unsubscribe();
    this.observeBusinessTypeCtrlSub?.unsubscribe();
  }
}
