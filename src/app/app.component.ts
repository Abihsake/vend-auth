import { Component } from '@angular/core';
import { LanguageService } from './core/services/language.service';
import { Assets } from './core/shared/assets';
import { IconService } from './core/services/icon.service';
import { register } from 'swiper/element/bundle';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'vend-auth';

  constructor(
    private iconService: IconService,
    private languageService: LanguageService
  ) {
    this.initializeAppLanguage();
    this.registerSwiperComponent();
    this.registerAllIcons();
  }

  private registerSwiperComponent() {
    register();
  }

  private registerAllIcons() {
    const allIcons = Assets.ICONS as {
      [key: string]: { name: string; url: string };
    };

    for (const key in allIcons) {
      this.iconService.addSvgIcon(allIcons[key].name, allIcons[key].url);
    }
  }

  initializeAppLanguage() {
    this.languageService.setAppDefaultTranslation();
    this.languageService.initializeLanguageTranslation();
  }
}
