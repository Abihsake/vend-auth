import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { TenantService } from '@core/services/tenant.service';
import { UserProfileService } from '@core/services/user-profile.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private userProfileService: UserProfileService,
    private tenantService: TenantService
  ) {}

  ngOnInit(): void {
    this.logout();
  }

  logout() {
    this.userProfileService.updateProfile(null);
    this.tenantService.updateProfile(null);
    this.authService.clearUserSessionData();
    this.router.navigate(['/auth/sign-in']);
  }
}
