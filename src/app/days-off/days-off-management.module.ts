import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { CommonPipesModule } from '@daysOff/shared/pipes.module';
import { MaterialModule } from '@daysOff/shared/material.module';
import { TranslateWrapperModule } from '@daysOff/translations/translation-wrapper.module';

import { DayOffCardComponent } from '@daysOff/days-off/day-off-card/day-off-card.component';
import { DaysOffManagementComponent } from '@daysOff/days-off/days-off-management/days-off-management.component';

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
