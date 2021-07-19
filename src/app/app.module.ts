import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CommonPipesModule } from './shared/pipes.module';
import { MaterialModule } from './shared/material.module';
import { RippleModule } from 'primeng/ripple';
import { ScheduleExceptionsModule } from './schedule-exceptions/schedule-exceptions.module';
import { ServicesModule } from './services/services.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SpinnerComponent } from './spinner/spinner.component';

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
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
        ScheduleExceptionsModule,
        ServicesModule.forRoot()
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
