import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrimeNGConfig } from 'primeng/api';
import { Calendar } from 'primeng/calendar';
import { addDays } from 'date-fns';

import { CommonPipesModule } from '../shared/pipes.module';
import { DaysOffManagementComponent } from '../days-off/components/days-off-management.component';
import { LanguageService } from '../services/language.service';
import { MockLanguageService } from './mock-services.spec';

class MockCalendar {
    public currentMonth = 0;
    public currentYear = 0;
    public navBackward(e: Event) {}
    public navForward(e: Event) {}
}

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
    });

    it('should create the component', () => {
        expect(comp).toBeTruthy();
    });

    describe('given new days off', () => {
        beforeEach(() => {
            comp.newExceptionsBucket.add(addDays(new Date(), 4).getTime());
        });

        // onClearMonth()

        it('clicking #clearAllDates should remove all new days', () => {
            comp.onClearAllNewDates();
            expect(comp.newExceptionsBucket.size).toEqual(0);
        });
    });

    // onSelectMonth()
    // onSelectYear()
    // onDeleteAll()
    // onRestore()
    // onRestoreAll()
});
