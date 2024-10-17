import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { StorageService } from './storage.service';
import { Constants } from '../shared/constants';
import { ITenant } from '../models/user.model';
import { EncryptionService } from './encryption.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TenantService {
  private ENCRYPTION_KEY = `${environment.app}-${environment.appId}`;

  private tenantDetail = this.encryptionService.decrypt(
    this.ENCRYPTION_KEY,
    this.storageService.get(Constants.STORAGE_VARIABLES.TENANT),
    Constants.STORAGE_VARIABLES.TENANT
  );
  private tenantSource = new BehaviorSubject<ITenant | null>(this.tenantDetail ? JSON.parse(this.tenantDetail) : null);
  tenant = this.tenantSource.asObservable();

  get tenantData(): ITenant | null {
    return this.tenantSource.value;
  }

  constructor(
    private storageService: StorageService,
    private encryptionService: EncryptionService
  ) {}

  updateProfile(tenant: ITenant | null) {
    this.tenantSource.next(tenant);
  }

  updateTenantProfileSourceAndSubscribers(profile: ITenant) {
    this.storageService.set(
      Constants.STORAGE_VARIABLES.TENANT,
      this.encryptionService.encrypt(this.ENCRYPTION_KEY, JSON.stringify(profile), Constants.STORAGE_VARIABLES.TENANT)
    );
    this.updateProfile(profile);
  }
}
