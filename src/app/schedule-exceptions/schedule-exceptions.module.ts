import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../shared/material.module';
import { CommonPipesModule } from '../shared/pipes.module';

import { ExceptionDateCardComponent } from './components/exception-date-card.component';
import { ScheduleExceptionManagementComponent } from './components/schedule-exception-management.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [
        ExceptionDateCardComponent,
        ScheduleExceptionManagementComponent
    ],
    imports: [
        CommonModule,
        CommonPipesModule,
        MaterialModule,
        FormsModule
    ],
    exports: [
        ScheduleExceptionManagementComponent
    ]
})
export class ScheduleExceptionsModule {}
