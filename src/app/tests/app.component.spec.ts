import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { CommonPipesModule } from '../shared/pipes.module';
import { MaterialModule } from '../shared/material.module';

import { AppService } from '../services/app.service';
import { EmployeeService } from '../services/employee.service';
import { LanguageService } from '../services/language.service';
import { OfficeService } from '../services/office.service';
import { SpinnerService } from '../services/spinner.service';
import { ToastService } from '../services/toast.service';

import { AppComponent } from '../app.component';
import { MessageService } from 'primeng/api';

describe('AppComponent', () => {
    let fixture: ComponentFixture<AppComponent>;
    let app: AppComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ AppComponent ],
            schemas: [ NO_ERRORS_SCHEMA ],
            imports: [
                CommonPipesModule,
                HttpClientTestingModule,
                MaterialModule,
                NoopAnimationsModule
            ],
            providers: [
                AppService,
                EmployeeService,
                LanguageService,
                MessageService,
                OfficeService,
                SpinnerService,
                ToastService
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        app = fixture.componentInstance;
    });

    it('should create the app', () => {
        expect(app).toBeTruthy();
    });
});
