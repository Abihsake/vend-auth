import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { StorageService } from './storage.service';
import { EncryptionService } from './encryption.service';
import { environment } from 'src/environments/environment';
import { Constants } from '../shared/constants';
import { IUser } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private ENCRYPTION_KEY = `${environment.app}-${environment.appId}`;

  private userDetail = this.encryptionService.decrypt(
    this.ENCRYPTION_KEY,
    this.storageService.get(Constants.STORAGE_VARIABLES.USER),
    Constants.STORAGE_VARIABLES.USER
  );
  private userProfileSource = new BehaviorSubject<IUser | null>(JSON.parse(this.userDetail));
  userProfile = this.userProfileSource.asObservable();

  get userProfileData() {
    return this.userProfileSource.value;
  }

  constructor(
    private storageService: StorageService,
    private encryptionService: EncryptionService
  ) {}

  updateProfile(userProfile: IUser | null) {
    this.userProfileSource.next(userProfile);
  }

  updateUserProfileSourceAndSubscribers(profile: IUser) {
    this.storageService.set(
      Constants.STORAGE_VARIABLES.USER,
      this.encryptionService.encrypt(this.ENCRYPTION_KEY, JSON.stringify(profile), Constants.STORAGE_VARIABLES.USER)
    );
    this.updateProfile(profile);
  }
}
