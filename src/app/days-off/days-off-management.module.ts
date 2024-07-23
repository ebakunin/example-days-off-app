import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { DaysOffManagementComponent } from '@days-off/days-off/days-off-management/days-off-management.component';
import { DayOffCardComponent } from '@days-off/days-off/day-off-card/day-off-card.component';
import { CommonPipesModule } from '@days-off/shared/pipes.module';
import { UiModule } from '@days-off/shared/ui.module';
import { TranslateWrapperModule } from '@days-off/translations/translation-wrapper.module';

@NgModule({
  declarations: [
    DayOffCardComponent,
    DaysOffManagementComponent,
  ],
  imports: [
    CommonModule,
    CommonPipesModule,
    UiModule,
    FormsModule,
    TranslateModule,
    TranslateWrapperModule.forRoot(),
  ],
  exports: [
    DaysOffManagementComponent,
  ]
})
export class DaysOffManagementModule {}
