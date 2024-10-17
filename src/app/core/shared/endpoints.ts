import { environment } from 'src/environments/environment';

/**
 * @description a marker for endpoints from Authentication service
 */
const AUTH_URL_MARKER = environment.AUTH_SERVICE.MARKER;

/**
 * @description a marker for endpoints from Business service
 */
const BUSINESS_URL_MARKER = environment.BUSINESS_SERVICE.MARKER;

/**
 * @description a marker for endpoints from TUM service
 */
const TUMS_URL_MARKER = environment.TENANT_USER_MANAGEMENT_SERVICE.MARKER;

export const Endpoint = {
  FORM_DATA: {
    signup: `${BUSINESS_URL_MARKER}/form-data/signup`
  },

  BUSINESS: {
    business: `${BUSINESS_URL_MARKER}/businesses`,
    get_business: (businessId: string) => `${BUSINESS_URL_MARKER}/businesses/${businessId}`
  },

  AUTH: {
    login: `${AUTH_URL_MARKER}/login`,
    verify_reset_password_token: `${AUTH_URL_MARKER}/verify-reset-token`,
    send_reset_link: `${AUTH_URL_MARKER}/forgot-password`,
    verify_email: `${AUTH_URL_MARKER}/verify`,
    validate_2fa: `${AUTH_URL_MARKER}/validate-2fa`,
    reset_password: `${AUTH_URL_MARKER}/reset-password`,
    email_check: `${AUTH_URL_MARKER}/email-check`,
    create_user_password: `${TUMS_URL_MARKER}/users/invited`,
    send_email_verification_link: `${TUMS_URL_MARKER}/tenants/resend-verification-email`,
    resend_verification_otp: `${TUMS_URL_MARKER}/tenants/resend-verification-otp`,
    resend_2fa: `${AUTH_URL_MARKER}/resend-2fa`
  }
};
