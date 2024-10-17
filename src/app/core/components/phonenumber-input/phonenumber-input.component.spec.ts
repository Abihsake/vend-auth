import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhonenumberInputComponent } from './phonenumber-input.component';

describe('PhonenumberInputComponent', () => {
  let component: PhonenumberInputComponent;
  let fixture: ComponentFixture<PhonenumberInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PhonenumberInputComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PhonenumberInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
