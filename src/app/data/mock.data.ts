import { addDays, addMonths, startOfToday } from 'date-fns';
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

const today = startOfToday();
export const ExampleEmployee = new Employee();
ExampleEmployee.init({
    id: 1,
    firstName: 'Alice',
    lastName: 'Beecham',
    daysOff: [addDays(today, 2), addDays(today, 8), addMonths(today, 1)]
});
