import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  ControlValueAccessor,
  FormBuilder,
  FormGroup,
  FormsModule,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  ValidationErrors,
  Validator,
  Validators
} from '@angular/forms';
import { IPhonenumber, IPhonenumberCtrl } from './models/phonenumber-input.model';
import { MatMenuModule } from '@angular/material/menu';
import { ICountry } from 'src/app/auth/models/auth.model';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Assets } from '../../shared/assets';
import { MatIconModule } from '@angular/material/icon';
import { Subscription } from 'rxjs';
import { REG_EXP } from '../../utilities/reg-exp';

@Component({
  selector: 'app-phonenumber-input',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatTooltipModule, MatIconModule, ReactiveFormsModule, FormsModule],
  templateUrl: './phonenumber-input.component.html',
  styleUrls: ['./phonenumber-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: PhonenumberInputComponent
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: PhonenumberInputComponent
    }
  ]
})
export class PhonenumberInputComponent implements ControlValueAccessor, Validator, OnDestroy {
  phoneNumber!: IPhonenumber;
  phoneNumberCtrl!: FormGroup<IPhonenumberCtrl>;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  onChange = (phoneNumber: IPhonenumber) => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {};

  CHEVRON_DOWN_ICON = Assets.ICONS.CHEVRON_DOWN;

  @Input() countries: ICountry[] = [];
  @Input() invalid!: boolean;
  @Output() countryCodeSelection: EventEmitter<ICountry> = new EventEmitter<ICountry>();

  selectedCountry!: ICountry;

  public REG_EXP = REG_EXP;
  observePhoneNumberCtrlSub!: Subscription;

  constructor(private fb: FormBuilder) {
    this.phoneNumberCtrl = this.fb.nonNullable.group({
      number: ['', [Validators.required, Validators.pattern(this.REG_EXP.ONLY_NUMBER), Validators.minLength(7)]],
      code: ['', Validators.required]
    });
    this.observePhoneNumberCtrl();
  }

  get phoneNumberData() {
    return this.phoneNumberCtrl.controls;
  }

  observePhoneNumberCtrl() {
    this.observePhoneNumberCtrlSub = this.phoneNumberCtrl.valueChanges.subscribe({
      next: (value) => {
        this.setPhoneNumberValue(value);
        this.onChange(this.phoneNumber);
      }
    });
  }

  onSelectCountryPhoneCode(selectedCountry: ICountry) {
    this.setSelectedCountryDisplay(selectedCountry);
    this.emitCountryCodeSelection(selectedCountry);
    this.phoneNumberData.code.patchValue(selectedCountry.phoneCode);
  }

  getSelectedCountryViaCode(phoneCode: string): ICountry | undefined {
    return this.countries.find((country) => country.phoneCode === phoneCode);
  }

  setSelectedCountryDisplay(selectedCountry: ICountry) {
    this.selectedCountry = selectedCountry;
  }

  emitCountryCodeSelection(selectedCountry: ICountry) {
    this.countryCodeSelection.emit(selectedCountry);
  }

  markCodeCtrlAsTouched() {
    this.phoneNumberData.code.markAsTouched();
  }

  markAsTouched() {
    if (!this.phoneNumberCtrl.touched) {
      this.onTouched();
    }
  }

  setPhoneNumberValue(value: Partial<IPhonenumber>) {
    this.phoneNumber = {
      code: value.code ?? '',
      number: value.number ?? ''
    };
  }

  writeValue(phonenumber: IPhonenumber) {
    const country = this.getSelectedCountryViaCode(phonenumber.code);
    if (country) {
      this.setSelectedCountryDisplay(country);
      this.emitCountryCodeSelection(country);
    }
    this.phoneNumberCtrl.setValue(phonenumber);
  }

  registerOnChange(onChangeFn: (phoneNumber: IPhonenumber) => void) {
    this.onChange = onChangeFn;
  }

  registerOnTouched(onTouchedFn: () => void) {
    this.onTouched = onTouchedFn;
  }

  setDisabledState(disabled: boolean) {
    if (disabled) {
      this.phoneNumberCtrl.disable();
    } else {
      this.phoneNumberCtrl.enable();
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  validate(control: AbstractControl): ValidationErrors | null {
    if (this.phoneNumberCtrl.valid) {
      return null;
    }

    const errors = {
      ...(this.phoneNumberCtrl.controls.code.errors ? { code: this.phoneNumberCtrl.controls.code.errors } : {}),
      ...(this.phoneNumberCtrl.controls.number.errors ? { number: this.phoneNumberCtrl.controls.number.errors } : {})
    };

    return errors;
  }

  ngOnDestroy(): void {
    this.observePhoneNumberCtrlSub?.unsubscribe();
  }
}
