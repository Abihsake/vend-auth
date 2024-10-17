import { FormControl, FormGroup } from '@angular/forms';
import { IPhonenumber } from 'src/app/core/components/phonenumber-input/models/phonenumber-input.model';

export interface ISignUpForm {
  signUpBusinessDetailsForm: FormGroup<BusinessSignUpDetails>;
  signUpPasswordForm: FormGroup<SignUpPassword>;
}

interface BusinessSignUpDetails {
  fullName: FormControl<string>;
  email: FormControl<string>;
  phoneNumber: FormControl<IPhonenumber>;
  businessName: FormControl<string>;
  businessType: FormControl<string>;
}

interface Password {
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
}

interface SignUpPassword extends Password {
  termsAndConditions: FormControl<boolean>;
}

export interface ISignInForm {
  emailOrPhoneNumber: FormControl<string>;
  password: FormControl<string>;
}

export interface IForgotPasswordForm {
  emailOrPhoneNumber: FormControl<string>;
}

export interface IResetPasswordForm {
  userPassword: FormGroup<Password>;
  token: FormControl<string>;
  otp: FormControl<string>;
}

export interface IResendEmailVerificationForm {
  email: FormControl<string>;
}

export interface IVerifyOTPForm {
  otp: FormControl<string>;
}

export interface ICreatePasswordForm {
  userPassword: FormGroup<Password>;
  token: FormControl<string>;
}
