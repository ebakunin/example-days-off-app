import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
    CallFunctionPipe,
    ToDatePipe,
    SortByDatePipe,
    UcFirstPipe,
    UcWordsPipe,
} from './common.pipes';
import { LocaleDatePipe } from './pipes/local-date.pipe';
import { FormControlTypePipe, FormGroupTypePipe, FormKeysPipe } from './pipes/reactive-form.pipes';
import { TranslatePipe } from './pipes/translate.pipe';

@NgModule({
    declarations: [
        CallFunctionPipe,
        ToDatePipe,
        FormControlTypePipe,
        FormGroupTypePipe,
        FormKeysPipe,
        LocaleDatePipe,
        SortByDatePipe,
        TranslatePipe,
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
        TranslatePipe,
        UcFirstPipe,
        UcWordsPipe
    ]
})
export class CommonPipesModule {
}
