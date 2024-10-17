import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public get(storageName: string) {
    const value = localStorage.getItem(storageName) as any;
    if (!value) {
      return null;
    }
    return value;
  }

  public set(storageName: string, value: string) {
    return localStorage.setItem(storageName, value);
  }

  public clear(storageName: string) {
    return localStorage.removeItem(storageName);
  }

  public clear_all() {
    return localStorage.clear();
  }
}
