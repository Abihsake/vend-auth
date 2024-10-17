import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { LanguageService } from '../../services/language.service';
import { IconService } from '../../services/icon.service';
import { MatDividerModule } from '@angular/material/divider';
import { ILanguage } from './models/language';
import { Constants } from '../../shared/constants';
import { Assets } from '../../shared/assets';

@Component({
  selector: 'app-language-menu',
  standalone: true,
  imports: [CommonModule, MatMenuModule, MatIconModule, MatButtonModule, MatDividerModule],
  templateUrl: './language-menu.component.html',
  styleUrls: ['./language-menu.component.scss']
})
export class LanguageMenuComponent {
  CHEVRON_DOWN_ICON = Assets.ICONS.CHEVRON_DOWN.name;

  LANGUAGES: ILanguage[] = Constants.LANGUAGES;

  selectedTranslation!: ILanguage;

  @Input() displayTextColor: 'white' | 'gray' = 'gray';
  @Input() displayTextFormat: 'code' | 'name' = 'name';

  @Input() set existingLanguage(language: string | null) {
    const existingLang = this.LANGUAGES.find((lang) => lang.code === language);
    if (language && existingLang) {
      this.selectedTranslation = existingLang;
    } else {
      this.selectedTranslation = this.LANGUAGES[0];
    }
  }

  constructor(
    private languageService: LanguageService,
    private iconService: IconService
  ) {
    this.registerAllLanguageFlags();
  }

  private registerAllLanguageFlags() {
    const allFlags = Assets.FLAGS as {
      [key: string]: { name: string; url: string };
    };

    for (const key in allFlags) {
      this.iconService.addSvgIcon(allFlags[key].name, allFlags[key].url);
    }
  }

  setLanguage(language: ILanguage) {
    this.selectedTranslation = language;
    this.languageService.updateLanguageSource(language.code);
    this.languageService.setLanguageOnService(language.code);
  }
}
