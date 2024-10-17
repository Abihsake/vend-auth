import { FormControl } from '@angular/forms';

export interface IPhonenumberCtrl {
  code: FormControl<string>;
  number: FormControl<string>;
}

export interface IPhonenumber {
  code: string;
  number: string;
}
