import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { RippleModule } from 'primeng/ripple';

import { ExplanationsComponent } from '@days-off/explanations/explanations.component';
import { AppComponent } from '@days-off/app.component';
import { ContactComponent } from '@days-off/contact/contact.component';
import { MenuComponent } from '@days-off/menu/menu.component';
import { SpinnerComponent } from '@days-off/spinner/spinner.component';
import { CommonPipesModule } from '@days-off/shared/pipes.module';
import { UiModule } from '@days-off/shared/ui.module';
import { DaysOffManagementModule } from '@days-off/days-off/days-off-management.module';
import { ServicesModule } from '@services/services.module';
import { TranslateWrapperModule } from '@days-off/translations/translation-wrapper.module';

@NgModule({
  declarations: [
    AppComponent,
    ContactComponent,
    ExplanationsComponent,
    MenuComponent,
    SpinnerComponent,
  ],
  bootstrap: [
    AppComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    CommonPipesModule,
    FormsModule,
    UiModule,
    ReactiveFormsModule,
    RippleModule,
    DaysOffManagementModule,
    ServicesModule.forRoot(),
    TranslateModule,
    TranslateWrapperModule.forRoot(),
  ],
  providers: [
    provideHttpClient(withInterceptorsFromDi()),
  ]
})
export class AppModule {}
