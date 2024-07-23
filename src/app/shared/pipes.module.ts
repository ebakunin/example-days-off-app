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

@NgModule({
  declarations: [
    CallFunctionPipe,
    ToDatePipe,
    LocaleDatePipe,
    SortByDatePipe,
    UcFirstPipe,
    UcWordsPipe,
  ],
  imports: [
    CommonModule,
    FormControlTypePipe,
    FormGroupTypePipe,
    FormKeysPipe,
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
    UcWordsPipe,
  ]
})
export class CommonPipesModule {}
