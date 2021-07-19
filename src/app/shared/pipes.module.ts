import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
    CallFunctionPipe,
    ToDatePipe,
    FormGroupTypePipe,
    FormKeysPipe,
    LocaleDatePipe,
    SortByDatePipe,
    TranslatePipe,
    UcFirstPipe,
    UcWordsPipe,
    FormControlTypePipe
} from './common.pipe';

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
export class CommonPipesModule {}
