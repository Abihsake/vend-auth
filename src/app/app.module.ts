import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgxTranslateModule } from './core/shared/translate.module';
import { ErrorStateMatcher } from '@angular/material/core';
import { ErrorInterceptor } from '@core/interceptors/error.interceptor';
import { TokenInterceptorService } from '@core/interceptors/token.interceptor';
import { TranslationInterceptor } from '@core/interceptors/translation.interceptor';
import { UrlInterceptorService } from '@core/interceptors/url.interceptor';
import { MyErrorStateMatcher } from '@core/utilities/input-validation';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, HttpClientModule, NgxTranslateModule],
  providers: [
    {
      provide: ErrorStateMatcher,
      useClass: MyErrorStateMatcher
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UrlInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TranslationInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
