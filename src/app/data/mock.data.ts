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
    closedDays: [0, 6]
});

export const ExampleEmployee = new Employee();
ExampleEmployee.init({
    id: 1,
    firstName: 'Alice',
    lastName: 'Beecham',
    daysOff: createMockDaysOff()
});


/**
 * Create 5 unique days off values within the next 30 days.
 * The days off should not fall on the office's closed days.
 * @returns {Date[]}
 */
function createMockDaysOff(): Date[] {
    const today = startOfToday();
    const daysOff: Date[] = [];
    const usedRandomInts: number[] = [];

    let i = 0;
    while (i < 4) {
        const randomInt = Math.floor(Math.random() * 30) + 1;
        if (!usedRandomInts.includes(randomInt)) {
            usedRandomInts.push(randomInt);
            const date = addDays(today, randomInt);
            if (!ExampleOffice.closedDays.includes(getDay(date))) {
                daysOff.push(date);
                i++;
            }
        }
    }

    daysOff.push(addMonths(daysOff[0], 1), addMonths(daysOff[0], 2));

    return daysOff;
}
