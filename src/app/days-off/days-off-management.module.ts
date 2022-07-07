import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { CommonPipesModule } from '../shared/pipes.module';
import { MaterialModule } from '../shared/material.module';
import { TranslateWrapperModule } from '../translations/translation-wrapper.module';

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
        FormsModule,
        TranslateModule,
        TranslateWrapperModule.forRoot()
    ],
    exports: [
        DaysOffManagementComponent
    ]
})
export class DaysOffManagementModule {}
