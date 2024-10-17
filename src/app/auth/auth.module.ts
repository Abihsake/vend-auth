import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { AuthComponent } from './auth.component';
import { LanguageMenuComponent } from '../core/components/language-menu/language-menu.component';
import { TestimonialsComponent } from '../core/components/testimonials/testimonials.component';

@NgModule({
  declarations: [AuthComponent],
  imports: [CommonModule, AuthRoutingModule, LanguageMenuComponent, TestimonialsComponent]
})
export class AuthModule {}
