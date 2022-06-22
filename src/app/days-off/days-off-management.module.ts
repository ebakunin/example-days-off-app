import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from '../shared/material.module';
import { CommonPipesModule } from '../shared/pipes.module';

import { DayOffCardComponent } from './day-off-card/day-off-card.component';
import { DaysOffManagementComponent } from './days-off-management/days-off-management.component';

@NgModule({
    declarations: [
        DayOffCardComponent,
        DaysOffManagementComponent
    ],
    imports: [
        CommonModule,
        CommonPipesModule,
        MaterialModule,
        FormsModule
    ],
    exports: [
        DaysOffManagementComponent
    ]
})
export class DaysOffManagementModule {}
