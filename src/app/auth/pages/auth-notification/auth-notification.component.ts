import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, ParamMap, Router, RouterModule } from '@angular/router';
import { AUTH_NOTIFICATION_IDS } from '@auth/data/auth-data';
import { Assets } from '@core/shared/assets';
import { SharedModule } from '@core/shared/shared.module';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IUserData } from '@core/models/user.model';
import { AuthService } from '@auth/services/auth.service';

@Component({
  selector: 'app-auth-notification',
  standalone: true,
  imports: [SharedModule, RouterModule, MatButtonModule, MatIconModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './auth-notification.component.html',
  styleUrls: ['./auth-notification.component.scss']
})
export class AuthNotificationComponent implements OnInit {
  NOTIFICATION_TYPES = AUTH_NOTIFICATION_IDS;
  ILLUSTRATIONS = Assets.ILLUSTRATIONS;
  public notificationType!: string;

  private destroyRef = inject(DestroyRef);

  loginData!: IUserData;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.loginData = navigation.extras.state as IUserData;
    }
  }

  ngOnInit(): void {
    this.getNotificationType();
  }

  getNotificationType() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params: ParamMap) => {
      if (params.has('notificationType')) {
        const notificationType = params.get('notificationType');
        if (notificationType) {
          this.notificationType = notificationType;
        }
      }
    });
  }

  continue() {
    if (this.loginData) {
      this.SSOredirectToRMS(this.loginData);
    } else {
      this.router.navigate(['/auth/sign-in']);
    }
  }

  SSOredirectToRMS(loginData: IUserData) {
    this.authService.SSOredirectToRMS(loginData);
  }
}
