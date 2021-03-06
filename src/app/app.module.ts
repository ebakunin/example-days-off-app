import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { RippleModule } from 'primeng/ripple';

import { CommonPipesModule } from './shared/pipes.module';
import { DaysOffManagementModule } from './days-off/days-off-management.module';
import { MaterialModule } from './shared/material.module';
import { ServicesModule } from './services/services.module';
import { TranslateWrapperModule } from './translations/translation-wrapper.module';

import { AppComponent } from './app.component';
import { ContactComponent } from './contact/contact.component';
import { ExplanationsComponent } from './explanations/explanations.component';
import { MenuComponent } from './menu/menu.component';
import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
    declarations: [
        AppComponent,
        ContactComponent,
        ExplanationsComponent,
        MenuComponent,
        SpinnerComponent
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        CommonPipesModule,
        FormsModule,
        HttpClientModule,
        MaterialModule,
        ReactiveFormsModule,
        RippleModule,
        DaysOffManagementModule,
        ServicesModule.forRoot(),
        TranslateModule,
        TranslateWrapperModule.forRoot()
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
