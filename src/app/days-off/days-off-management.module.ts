import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialModule } from '../shared/material.module';
import { CommonPipesModule } from '../shared/pipes.module';

import { DayOffCardComponent } from './components/day-off-card.component';
import { DaysOffManagementComponent } from './components/days-off-management.component';
import { FormsModule } from '@angular/forms';

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
