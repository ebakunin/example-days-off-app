/************************ TYPES ************************/

export type DayNumberType = 0|1|2|3|4|5|6;
export type MonthNumberType = 0|1|2|3|4|5|6|7|8|9|10|11;

export type ApiResponseType = { response: number, message: string };


/************************ ENUMS ************************/




/************************ INTERFACES ************************/

export interface ISaveComponent {
    save(data?: any): void;
    isDirty(): boolean;
    ngOnDestroy(): void;
}
