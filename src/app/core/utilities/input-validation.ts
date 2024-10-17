import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidator,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AuthService } from '@auth/services/auth.service';
import { Observable, map, catchError, of, filter } from 'rxjs';

/** Error when invalid control is dirty, touched, or submitted. */
export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form?.submitted;
    if (form?.submitted) {
      return !!(control?.invalid && (control?.dirty || !isSubmitted));
    } else {
      return !!((control?.dirty || isSubmitted) && control?.invalid);
    }
  }
}

export const matchPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  if (password?.errors && confirmPassword?.errors) {
    return null;
  }

  return password && confirmPassword && password.value !== confirmPassword.value ? { passwordMismatch: true } : null;
};

export const hasValueValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (control.errors) {
    return null;
  }

  const isValid = Object.values<AbstractControl['value']>(control.value).some((value) => value && value.length > 0);

  return control && !isValid ? { mustHaveValue: true } : null;
};

export const DisplayErrorMessage = (control: FormControl | null) => {
  return !!(control?.dirty && control?.touched && control?.invalid);
};

export type ControlsOf<T extends Record<string, unknown>> = {
  [K in keyof T]: T[K] extends Record<string | number | symbol, unknown>
    ? FormGroup<ControlsOf<T[K]>>
    : FormControl<T[K]>;
};

@Injectable({ providedIn: 'root' })
export class UniqueEmailValidator implements AsyncValidator {
  constructor(private authService: AuthService) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    if (control.value.trim()) {
      const payload = { emailOrPhoneNumber: control.value };

      return this.authService.checkIfEmailExist(payload).pipe(
        map((emailExist) => (emailExist ? { nonUniqueEmail: true } : null)),
        catchError((err: HttpErrorResponse) => {
          if (err.status === 404) {
            return of(null);
          }
          return of({ failedApiRequest: err.message });
        })
      );
    } else {
      return of(null);
    }
  }
}

// pass in property to validate and list of validators to run on it
export function validateProperty(property: string, validators: ValidatorFn[]): ValidatorFn {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (control: AbstractControl): { [key: string]: any } | null => {
    // get the value and assign it to a new form control
    const propertyVal = control.value && control.value[property];
    const newFc = new FormControl(propertyVal);
    // run the validators on the new control and keep the ones that fail
    const failedValidators = validators.map((v) => v(newFc)).filter((v) => !!v);
    // if any fail, return the list of failures, else valid
    return failedValidators.length ? { invalidProperty: failedValidators } : null;
  };
}
