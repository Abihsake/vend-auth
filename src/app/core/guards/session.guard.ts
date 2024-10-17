import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ITenant, IUser } from '../models/user.model';
import { TenantService } from '../services/tenant.service';
import { UserProfileService } from '../services/user-profile.service';
import { environment } from 'src/environments/environment';

export const SessionGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const RMS_URL = environment.RMS_URL;
  const userprofileService = inject(UserProfileService);
  const tenantService = inject(TenantService);

  const isAuthenticated = authService.isAuthenticated();

  const getTenantDetail = (): ITenant | null => {
    return tenantService.tenantData;
  };

  const getUserDetail = (): IUser | null => {
    return userprofileService.userProfileData;
  };

  const clearUserSession = () => {
    userprofileService.updateProfile(null);
    tenantService.updateProfile(null);
    authService.clearUserSessionData();
  };

  if (getUserDetail() && getTenantDetail() && isAuthenticated) {
    // user is logged in so redirect to default webapp => rms
    const accessToken = authService.getAccessToken();

    const sso_query = { token: accessToken };
    const rms_redirect_url = authService.construct_sso_redirect_url(RMS_URL, JSON.stringify(sso_query));

    authService.redirect_to_external_url(rms_redirect_url);

    return false;
  } else {
    clearUserSession();
    return true;
  }
};
