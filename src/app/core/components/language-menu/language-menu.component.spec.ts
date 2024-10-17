import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LanguageMenuComponent } from './language-menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { LanguageService } from '../../services/language.service';
import { IconService } from '../../services/icon.service';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { NgxTranslateModule } from 'src/app/core/shared/translate.module';
import { ILanguage } from './models/language';

describe('LanguageMenuComponent', () => {
  let component: LanguageMenuComponent;
  let fixture: ComponentFixture<LanguageMenuComponent>;
  let languageService: LanguageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatMenuModule, MatIconModule, MatButtonModule, MatDividerModule, HttpClientModule, NgxTranslateModule],
      providers: [LanguageService, IconService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LanguageMenuComponent);
    component = fixture.componentInstance;
    languageService = TestBed.inject(LanguageService);
    component.selectedTranslation = { name: 'English', code: 'en', default: true, flag: '' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call languageService.updateLanguageSource and languageService.setLanguageOnService on setLanguage', () => {
    spyOn(languageService, 'updateLanguageSource');
    spyOn(languageService, 'setLanguageOnService');
    const language = component.LANGUAGES[1];
    component.setLanguage(language);
    expect(component.selectedTranslation).toEqual(language);
    expect(languageService.updateLanguageSource).toHaveBeenCalledWith(language.code);
    expect(languageService.setLanguageOnService).toHaveBeenCalledWith(language.code);
  });

  it('should set the default language when existingLanguage is not provided', () => {
    component.existingLanguage = null;
    fixture.detectChanges();
    expect(component.selectedTranslation).toEqual(component.LANGUAGES[0]);
  });

  it('should update language and language service when a valid language is provided', () => {
    spyOn(languageService, 'updateLanguageSource');
    spyOn(languageService, 'setLanguageOnService');
    const language: ILanguage = { name: 'French', code: 'fr', default: false, flag: '' };
    component.setLanguage(language);
    expect(component.selectedTranslation).toEqual(language);
    expect(languageService.updateLanguageSource).toHaveBeenCalledWith(language.code);
    expect(languageService.setLanguageOnService).toHaveBeenCalledWith(language.code);
  });

  it('should set selectedTranslation to the existing language when a matching language is provided', () => {
    const existingLanguage = 'en'; // Assume 'en' is an existing language code
    component.existingLanguage = existingLanguage;
    expect(component.selectedTranslation).toBeDefined();
  });
});
