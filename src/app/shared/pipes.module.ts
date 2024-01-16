import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {
    CallFunctionPipe,
    ToDatePipe,
    SortByDatePipe,
    UcFirstPipe,
    UcWordsPipe,
} from '@daysOff/shared/common.pipes';
import {LocaleDatePipe} from '@daysOff/shared/pipes/local-date.pipe';
import {FormControlTypePipe, FormGroupTypePipe, FormKeysPipe} from '@daysOff/shared/pipes/reactive-form.pipes';

@NgModule({
    declarations: [
        CallFunctionPipe,
        ToDatePipe,
        FormControlTypePipe,
        FormGroupTypePipe,
        FormKeysPipe,
        LocaleDatePipe,
        SortByDatePipe,
        UcFirstPipe,
        UcWordsPipe
    ],
    imports: [
        CommonModule
    ],
    exports: [
        CallFunctionPipe,
        ToDatePipe,
        FormControlTypePipe,
        FormGroupTypePipe,
        FormKeysPipe,
        LocaleDatePipe,
        SortByDatePipe,
        UcFirstPipe,
        UcWordsPipe
    ]
})
export class CommonPipesModule {}
