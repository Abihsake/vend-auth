import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { ILanguage } from '../components/language-menu/models/language';
import { TranslateService } from '@ngx-translate/core';
import { Constants } from '../shared/constants';
import { StorageService } from './storage.service';
import { EncryptionService } from './encryption.service';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private ENCRYPTION_KEY = `${environment.app}-${environment.appId}`;
  private appSupportedLanguages = Constants.LANGUAGES;

  private setLanguage = this.encryptionService.decrypt(
    this.ENCRYPTION_KEY,
    this.storageService.get(Constants.STORAGE_VARIABLES.LANGUAGE),
    Constants.STORAGE_VARIABLES.LANGUAGE
  );

  private languageSource = new BehaviorSubject<string | null>(this.setLanguage);
  language$ = this.languageSource.asObservable();

  get languageData() {
    return this.languageSource.value;
  }

  constructor(
    private storageService: StorageService,
    private encryptionService: EncryptionService,
    private translateService: TranslateService
  ) {}

  updateLanguageSource(languageCode: string): void {
    this.languageSource.next(languageCode);
    this.storageService.set(
      Constants.STORAGE_VARIABLES.LANGUAGE,
      this.encryptionService.encrypt(this.ENCRYPTION_KEY, languageCode, Constants.STORAGE_VARIABLES.LANGUAGE)
    );
  }

  setAppDefaultTranslation(): void {
    const defaultLanguage = this.appSupportedLanguages.find((lang) => lang.default);
    if (defaultLanguage) {
      this.translateService.setDefaultLang(defaultLanguage.code);
    } else {
      this.translateService.setDefaultLang('en');
    }
  }

  initializeLanguageTranslation(): void {
    const currentTranslation = this.languageData;
    const usersBrowserSupportedLanguages = this.getBrowserLocales({ languageCodeOnly: true });

    // set translation
    if (currentTranslation) {
      this.updateLanguageSource(currentTranslation);
      this.setLanguageOnService(currentTranslation);
    } else if (usersBrowserSupportedLanguages) {
      this.updateLanguageSource(usersBrowserSupportedLanguages[0]);
      this.setLanguageOnService(usersBrowserSupportedLanguages[0]);
    } else {
      this.updateLanguageSource(this.appSupportedLanguages[0].code);
      this.setLanguageOnService(this.appSupportedLanguages[0].code);
    }
  }

  setLanguageOnService(languageCode: string) {
    this.translateService.use(languageCode);
  }

  getBrowserLocales(option: { languageCodeOnly: boolean }): string[] | undefined {
    const browserLocales = navigator.languages ?? [navigator.language];

    const appSupportedLocales = this.appSupportedLanguages.map((language) => language.code);

    if (!browserLocales) {
      return undefined;
    } else if (browserLocales.length > 0 && appSupportedLocales.length > 0) {
      const locales = browserLocales.map((locale) => {
        const trimmedLocale = locale.trim();
        return option.languageCodeOnly ? trimmedLocale.split('-')[0] : trimmedLocale;
      });

      const appSupportedBrowserLocales = locales.filter((locale) => appSupportedLocales.includes(locale));
      return appSupportedBrowserLocales.length > 0 ? appSupportedBrowserLocales : undefined;
    } else {
      return undefined;
    }
  }

  getLanguageByLocale(locale: string): ILanguage | undefined {
    return this.appSupportedLanguages.find((lang) => lang.code === locale);
  }
}
