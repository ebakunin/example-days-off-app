import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PrimeNGConfig } from 'primeng/api';
import { Calendar } from 'primeng/calendar';
import { addDays } from 'date-fns';

import { CommonPipesModule } from '../shared/pipes.module';
import { DaysOffManagementComponent } from '../days-off/components/days-off-management.component';
import { LanguageService } from '../services/language.service';
import { MockLanguageService } from './mock-services.spec';
import { MonthNumberType } from '../shared/common.type';

class MockCalendar {
    public currentMonth: MonthNumberType = 9;
    public currentYear = 2020;
    public navBackward(e: Event) {}
    public navForward(e: Event) {}
}

const startDate = new Date('10/01/2020 00:00:00');
const newDaysOff: Date[] = [startDate, addDays(startDate, 4), addDays(startDate, 7), addDays(startDate, 35), addDays(startDate, 45)];

describe('DaysOffManagementComponent', () => {
    let fixture: ComponentFixture<DaysOffManagementComponent>;
    let comp: DaysOffManagementComponent;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ DaysOffManagementComponent ],
            schemas: [ NO_ERRORS_SCHEMA ],
            imports: [ CommonPipesModule ],
            providers: [
                PrimeNGConfig,
                { provide: LanguageService, useClass: MockLanguageService }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(DaysOffManagementComponent);
        comp = fixture.componentInstance;
        fixture.detectChanges();
        comp.calendar = new MockCalendar() as Calendar;
        comp.closedDays = [0, 6]; // closed on weekends
        comp.closedDates = [];
    });

    it('should create the component', () => {
        expect(comp).toBeTruthy();
    });

    describe('given new days off', () => {
        beforeEach(() => {
            comp.newExceptionsBucket = new Set([...Array.from(newDaysOff).map(date => date.getTime())]);
            fixture.detectChanges();
        });

        it('clicking #clearMonth should remove all new days in the current month', () => {
            const clearMonth = fixture.debugElement.query(By.css('#clearMonth'));
            clearMonth.nativeElement.dispatchEvent(new Event('click'));
            fixture.detectChanges();
            expect(comp.newExceptionsBucket.size).toEqual(2);
        });

        it('clicking #clearAllDates should remove all new days', () => {
            const clearAllDates = fixture.debugElement.query(By.css('#clearAllDates'));
            clearAllDates.nativeElement.dispatchEvent(new Event('click'));
            fixture.detectChanges();
            expect(comp.newExceptionsBucket.size).toEqual(0);
        });
    });

    describe('given no new days off', () => {
        beforeEach(() => {
            comp.newExceptionsBucket = new Set();
            fixture.detectChanges();
        });

        it('clicking #selectMonth should select all available days in the current month', () => {
            const selectMonth = fixture.debugElement.query(By.css('#selectMonth'));
            selectMonth.nativeElement.dispatchEvent(new Event('click'));
            fixture.detectChanges();
            expect(comp.newExceptionsBucket.size).toEqual(22);
        });

        it('clicking #selectYear should select all available days in the current year', () => {
            const selectYear = fixture.debugElement.query(By.css('#selectYear'));
            selectYear.nativeElement.dispatchEvent(new Event('click'));
            fixture.detectChanges();
            expect(comp.newExceptionsBucket.size).toEqual(262);
        });
    });

    // console.log(Array.from(comp.newExceptionsBucket).map(datetime => new Date(datetime)));
    // onDeleteAll()
    // onRestore()
    // onRestoreAll()
});
