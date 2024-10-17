import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth.component';
import { SessionGuard } from '@core/guards/session.guard';

const routes: Routes = [
  {
    path: '',
    component: AuthComponent,
    canActivate: [SessionGuard],
    children: [
      {
        path: 'sign-up',
        loadComponent: () => import('./pages/sign-up/sign-up.component').then((m) => m.SignUpComponent)
      },
      {
        path: 'sign-in',
        loadComponent: () => import('./pages/sign-in/sign-in.component').then((m) => m.SignInComponent)
      },
      {
        path: 'notification/:notificationType',
        loadComponent: () =>
          import('./pages/auth-notification/auth-notification.component').then((m) => m.AuthNotificationComponent)
      },
      {
        path: 'verify-email',
        loadComponent: () => import('./pages/verify-email/verify-email.component').then((m) => m.VerifyEmailComponent)
      },
      {
        path: 'verify-otp',
        loadComponent: () => import('./pages/verify-otp/verify-otp.component').then((m) => m.VerifyOtpComponent)
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./pages/reset-password/reset-password.component').then((m) => m.ResetPasswordComponent)
      },
      {
        path: 'reset-password/:token',
        loadComponent: () =>
          import('./pages/reset-password/reset-password.component').then((m) => m.ResetPasswordComponent)
      },
      {
        path: 'create-password/:token',
        loadComponent: () =>
          import('./pages/create-password/create-password.component').then((m) => m.CreatePasswordComponent)
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./pages/reset-password/reset-password.component').then((m) => m.ResetPasswordComponent)
      },
      {
        path: '',
        redirectTo: 'sign-in',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
