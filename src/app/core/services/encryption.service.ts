import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  encrypt = (encryptionKey: string, value: string, storageKey?: string) => {
    let encryptedData: string;
    if (storageKey) {
      encryptedData = CryptoJS.AES.encrypt(value, `${encryptionKey}-${storageKey}`).toString();
    } else {
      encryptedData = CryptoJS.AES.encrypt(value, encryptionKey).toString();
    }
    return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encryptedData));
  };

  decrypt = (encryptionKey: string, token: string, storageKey?: string) => {
    if (token) {
      const decryptedJson = CryptoJS.enc.Base64.parse(token).toString(CryptoJS.enc.Utf8);
      const decryptedToken = storageKey
        ? CryptoJS.AES.decrypt(decryptedJson, `${encryptionKey}-${storageKey}`)
        : CryptoJS.AES.decrypt(decryptedJson, encryptionKey);
      return decryptedToken?.toString(CryptoJS.enc.Utf8);
    }
    return token;
  };
}
