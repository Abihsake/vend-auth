import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthNotificationComponent } from './auth-notification.component';

describe('AuthNotificationsComponent', () => {
  let component: AuthNotificationComponent;
  let fixture: ComponentFixture<AuthNotificationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AuthNotificationComponent]
    });
    fixture = TestBed.createComponent(AuthNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
