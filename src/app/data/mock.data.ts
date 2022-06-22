import { addDays, addMonths, getDay, startOfToday } from 'date-fns';
import { Employee } from '../models/employee.model';
import { Language } from '../models/language.model';
import { Office } from '../models/office.modal';

export const English = new Language();
English.init({
    id: 1,
    description: 'American English',
    nativeDescription: 'English',
    abbreviation: 'EN',
    isoCode: 'en-US',
    createTimestamp: '',
    lastUpdateTimestamp: '',
    active: true
});
export const Spanish = new Language();
Spanish.init({
    id: 2,
    description: 'Spanish',
    nativeDescription: 'Español',
    abbreviation: 'ES',
    isoCode: 'es-ES',
    createTimestamp: '',
    lastUpdateTimestamp: '',
    active: true
});
export const French = new Language();
French.init({
    id: 3,
    description: 'French',
    nativeDescription: 'Française',
    abbreviation: 'FR',
    isoCode: 'fr-FR',
    createTimestamp: '',
    lastUpdateTimestamp: '',
    active: true
});

export const ExampleOffice = new Office();
ExampleOffice.init({
    id: 1,
    name: 'Example Office',
    closedDays: [0, 6],
    closedDates: []
});

export const ExampleEmployee = new Employee();
ExampleEmployee.init({
    id: 1,
    firstName: 'Alice',
    lastName: 'Beecham',
    daysOff: createMockDaysOff()
});


/**
 * Create 6 unique days off values.
 * The days off should not fall on the office's closed days.
 * @returns {Date[]}
 */
function createMockDaysOff(): Date[] {
    let datesOff: Date[] = [];
    let usedRandomDayOff: number[] = [];

    const today = startOfToday();
    let i = 0;
    while (i < 4) {
        const randomDay = Math.floor(Math.random() * 30) + 1;
        if (!usedRandomDayOff.includes(randomDay)) {
            usedRandomDayOff = [...usedRandomDayOff, randomDay];
            const date = addDays(today, randomDay);
            if (!ExampleOffice.closedDays.includes(getDay(date))) {
                datesOff = [...datesOff, date];
                i++;
            }
        }
    }

    return [
        ...datesOff,
        addMonths(datesOff[0], 1),
        addMonths(datesOff[0], 2),
        addMonths(datesOff[0], 3)
    ];
}
