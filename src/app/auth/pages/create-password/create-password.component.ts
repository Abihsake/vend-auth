import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AUTH_NOTIFICATION_IDS } from '@auth/data/auth-data';
import { ICreatePasswordForm } from '@auth/models/auth-form.model';
import { DisplayErrorMessage, matchPasswordValidator } from '@core/utilities/input-validation';
import { REG_EXP } from '@core/utilities/reg-exp';
import { Assets } from '@core/shared/assets';
import { ActivatedRoute, Router, ParamMap, RouterModule } from '@angular/router';
import { AuthService } from '@auth/services/auth.service';
import { ICreatePasswordPayload } from '@auth/models/auth.model';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ErrorDisplayComponent } from '@core/components/error-display/error-display.component';
import { SharedModule } from '@core/shared/shared.module';

@Component({
  selector: 'app-create-password',
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
  templateUrl: './create-password.component.html',
  styleUrls: ['./create-password.component.scss']
})
export class CreatePasswordComponent implements OnInit {
  public displayError = DisplayErrorMessage;
  public REG_EXP = REG_EXP;
  apiError = {
    status: false,
    message: ''
  };

  NOTIFICATION_IDS = AUTH_NOTIFICATION_IDS;

  public createPasswordForm!: FormGroup<ICreatePasswordForm>;
  public isCreatingPassword = false;

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
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.setPage();
  }

  ngOnInit(): void {
    this.setPage();
  }

  setPage() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.has('token')) {
        const token = params.get('token');
        if (token) {
          this.initForm(token);
        }
      }
    });
  }

  initForm(token: string) {
    this.createPasswordForm = this.fb.nonNullable.group<ICreatePasswordForm>({
      userPassword: this.fb.nonNullable.group(
        {
          password: ['', [Validators.required, Validators.pattern(this.REG_EXP.PASSWORD)]],
          confirmPassword: ['', Validators.required]
        },
        { validators: matchPasswordValidator, updateOn: 'blur' }
      ),
      token: this.fb.nonNullable.control(token, Validators.required)
    });
  }

  get createPasswordFormData(): ICreatePasswordForm {
    return this.createPasswordForm.controls;
  }

  onSubmit(formPayload: ICreatePasswordForm) {
    if (this.apiError.status) this.apiError = { status: false, message: '' };

    const payload: ICreatePasswordPayload = {
      password: formPayload.userPassword.controls.password.value,
      token: formPayload.token.value
    };

    this.createPassword(payload);
  }

  createPassword(payload: ICreatePasswordPayload): void {
    this.isCreatingPassword = true;
    this.authService.createPassword(payload).subscribe({
      next: () => {
        this.isCreatingPassword = false;
        this.router.navigate(['/auth/notification', this.NOTIFICATION_IDS.PASSWORD_CREATE_SUCCESS]);
      },
      error: (error) => {
        this.isCreatingPassword = false;
        this.apiError = {
          status: true,
          message: error
        };
      }
    });
  }

  toggleVisibility(fieldname: 'password' | 'confirmPassword', visibility: boolean) {
    this.passwordFields[fieldname].visible = visibility;
    this.passwordFields[fieldname].inputType = visibility ? 'text' : 'password';
  }
}
