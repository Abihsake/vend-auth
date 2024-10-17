import { IBusiness } from '@core/models/business.model';

export interface ISignUpPayload {
  fullName: string;
  email?: string;
  phoneNumber: string;
  businessName: string;
  businessTypeId: string;
  password: string;
  metadata: SignUpMetadata;
}

interface SignUpMetadata {
  procurement?: unknown;
  core: {
    tenantUserType: TenantUserTypes;
  };
}

export enum BusinessTypes {
  RESTAURANT = 'restaurant',
  WAREHOUSE = 'warehouse'
}

export enum TenantUserTypes {
  INDIVIDUAL = 'individual',
  BUSINESS = 'business',
  ENTERPRISE = 'enterprise'
}

export interface ISignInPayload {
  emailOrPhoneNumber: string;
  password: string;
}

export interface IForgotPasswordPayload {
  emailOrPhoneNumber: string;
}

export interface IForgotPasswordResponse {
  message: string;
  requestToken: string;
}

export interface IVerifyEmailResponse {
  message: string;
  passwordToken?: string;
}

export interface IResendEmailVerificationPayload {
  email: string;
}

export interface IResetPasswordPayload {
  password: string;
  otp: string;
  requestToken: string;
}

export interface ICreatePasswordPayload {
  password: string;
  token: string;
}

export interface IVerifyEmailPayload {
  token: string;
  setPassword: boolean;
}

export interface IVerifyUniqueEmailPayload {
  emailOrPhoneNumber: string;
}

export interface ISignupFormData {
  businessTypes: { id: string; name: string }[];
}

export interface ICountry {
  code: string;
  name: string;
  phoneCode: string;
  currency: string;
}

export interface ISsoQueryData {
  domain: string;
  url: string;
  action: 'logout' | 'login';
}

export enum SignUpStepEnum {
  BusinessDetails = 0,
  Password = 1
}

export interface ISignUpResponse {
  business: IBusiness;
  requestToken: string;
}

export interface IVerifyOTPRouterState {
  token: string;
  emailOrPhoneNumber: string;
  verificationType: VerificationTypeEnum;
  hasError?: boolean;
  errorMessage?: string;
}

export enum VerificationTypeEnum {
  signIn,
  signUp,
  forgotPassword
}
export interface IVerifyEmailWithOTPPayload {
  otp: string;
  requestToken: string;
}

export interface IValidate2FAPayload {
  otp: string;
  requestToken: string;
}

export interface IResendVerificationOTPPayload {
  emailOrPhoneNumber: string;
}

export interface IResend2FAPayload {
  emailOrPhoneNumber: string;
  password: string;
  requestToken: string;
}

export interface IResendVerificationOTPResponse {
  requestToken: string;
}

export interface IResetPasswordRouterState {
  pageAction: 'resetPassword' | 'forgotPassword';
  otp: string;
  requestToken: string;
  emailOrPhoneNumber: string;
}

export enum SignInStepEnum {
  emailAndPassword,
  otp
}
