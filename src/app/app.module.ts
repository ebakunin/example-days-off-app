import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CommonPipesModule } from './shared/pipes.module';
import { MaterialModule } from './shared/material.module';
import { RippleModule } from 'primeng/ripple';
import { DaysOffManagementModule } from './days-off/days-off-management.module';
import { ServicesModule } from './services/services.module';

import { AppComponent } from './app.component';
import { ContactComponent } from './contact/contact.component';
import { ExplanationsComponent } from './explanations/explanations.component';
import { MenuComponent } from './header/menu.component';
import { SpinnerComponent } from './spinner/spinner.component';
import './shared/common.function';

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
        ServicesModule.forRoot()
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
