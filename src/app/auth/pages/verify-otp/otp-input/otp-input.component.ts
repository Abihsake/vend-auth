import { Component, EventEmitter, forwardRef, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { SharedModule } from '@core/shared/shared.module';
import { REG_EXP } from '@core/utilities/reg-exp';

@Component({
  selector: 'app-otp-input',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './otp-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => OtpInputComponent),
      multi: true
    }
  ]
})
export class OtpInputComponent implements OnInit, ControlValueAccessor {
  @Input() otpLength = 6;
  @Output() otpChange = new EventEmitter<string>();
  @Input() hasError = false;
  otpForm!: FormGroup;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  private onChange = (otp: string) => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private onTouched = () => {};

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.buildOtpForm();
  }

  buildOtpForm(): void {
    this.otpForm = this.formBuilder.group({});
    for (let i = 0; i < this.otpLength; i++) {
      this.otpForm.addControl(`otp${i}`, this.formBuilder.control('', Validators.pattern(REG_EXP.ONLY_NUMBER)));
    }
  }

  onOtpChange(index: number): void {
    const otp = Object.values(this.otpForm.value).join('');
    this.onChange(otp);
    this.onTouched();
    this.otpChange.emit(otp);

    // Move focus to the next input if a value is entered
    if (this.otpForm.get(`otp${index}`)?.value && index < this.otpLength - 1) {
      const nextIndex = index + 1;
      document.getElementById(`otp${nextIndex}`)?.focus();
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const clipboardData = event.clipboardData;
    const pastedText = clipboardData?.getData('text');
    if (pastedText && pastedText.length === this.otpLength) {
      for (let i = 0; i < this.otpLength; i++) {
        this.otpForm.get(`otp${i}`)?.setValue(pastedText[i]);
        this.onChange(pastedText);
        this.onTouched();
        // Move focus to the last input
        document.getElementById(`otp${this.otpLength - 1}`)?.focus();
      }
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    // Move focus to the previous input if Backspace is pressed and the current input is empty
    if (event.key === 'Backspace' && index > 0 && !this.otpForm.get(`otp${index}`)?.value) {
      const prevIndex = index - 1;
      document.getElementById(`otp${prevIndex}`)?.focus();
    }
  }

  writeValue(value: any): void {
    if (value) {
      const otp = value.toString();
      for (let i = 0; i < this.otpLength; i++) {
        this.otpForm.get(`otp${i}`)?.setValue(otp[i]);
      }
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
