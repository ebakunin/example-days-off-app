import { NgModule } from '@angular/core';

import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
    exports: [
        CalendarModule,
        DialogModule,
        DropdownModule,
        ProgressSpinnerModule,
        ToastModule,
        TooltipModule
    ]
})
export class MaterialModule {}
