import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { addDays, startOfToday } from 'date-fns';

import { CommonPipesModule } from '../shared/pipes.module';

import { AppService } from '../services/app.service';
import { EmployeeService } from '../services/employee.service';
import { LanguageService } from '../services/language.service';
import { OfficeService } from '../services/office.service';
import { SpinnerService } from '../services/spinner.service';
import { ToastService } from '../services/toast.service';
import { MockLanguageService, MockToastService } from './mock-services.spec';

import { Employee } from '../models/employee.model';
import { Office } from '../models/office.modal';
import { AppComponent } from '../app.component';

describe('AppComponent', () => {
    let fixture: ComponentFixture<AppComponent>;
    let comp: AppComponent;
    let _employeeService: EmployeeService;
    let _toastService: ToastService;
    let saveSpy: jasmine.Spy;
    let successSpy: jasmine.Spy;
    let errorSpy: jasmine.Spy;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ AppComponent ],
            schemas: [ NO_ERRORS_SCHEMA ],
            imports: [
                CommonPipesModule,
                HttpClientTestingModule
            ],
            providers: [
                AppService,
                EmployeeService,
                { provide: LanguageService, useClass: MockLanguageService },
                OfficeService,
                SpinnerService,
                { provide: ToastService, useClass: MockToastService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AppComponent);
        comp = fixture.componentInstance;
        _employeeService = fixture.debugElement.injector.get(EmployeeService);
        _toastService = fixture.debugElement.injector.get(ToastService);
        saveSpy = spyOn(_employeeService.employees, 'saveItem$').and.callThrough();
        successSpy = spyOn(_toastService, 'successToast').and.callThrough();
        errorSpy = spyOn(_toastService, 'errorToast').and.callThrough();

        fixture.detectChanges();
    });

    it('should create the component', () => {
        expect(comp).toBeTruthy();
    });

    describe('given initial data', () => {
        it('should have an Employee object', fakeAsync(() => {
            comp.employee$.subscribe(employee => expect(employee).toBeInstanceOf(Employee));
            flush();
        }));

        it('should have an Office object', fakeAsync(() => {
            comp.office$.subscribe(office => expect(office).toBeInstanceOf(Office));
            flush();
        }));
    });

    describe('given no values to save', () => {
        beforeEach(() => {
            comp.newExceptionDates = [];
            comp.exceptionDatesToBeDeleted = [];
        });

        it('save functionality should not have been triggered', () => {
            expect(saveSpy).not.toHaveBeenCalled();
        });
    });

    describe('given values to save', () => {
        beforeEach(() => {
            const today = startOfToday();
            comp.newExceptionDates = [addDays(today, 2), addDays(today, 4)];
            comp.exceptionDatesToBeDeleted = [addDays(today, 6)];
            comp.onSave();
        });

        it('save functionality should have been triggered', () => {
            expect(saveSpy).toHaveBeenCalled();
        });

        xit('should show a success message', () => {
            expect(successSpy).toHaveBeenCalled();
        });

        xit('should reset to default values', () => {
            expect(comp.newExceptionDates.length).toEqual(0);
            expect(comp.exceptionDatesToBeDeleted.length).toEqual(0);
        });
    });
});
