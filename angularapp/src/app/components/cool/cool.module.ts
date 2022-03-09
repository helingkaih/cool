import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComModule } from '../common/com.module';
import { ngZorroAntdModule } from '../../ng-zorro-antd.module';
import { ExcelComponent } from './excel/excel.component';
import { CalendarComponent } from './calendar/calendar.component'
import { WorkerComponent } from './worker/worker.component';
import { ControlComponent } from './control/control.component';
import { VirtualComponent } from './virtual/virtual.component';
import { GanttComponent } from './gantt/gantt.component';
import { CoolRoutingModule } from './cool-routing.module';

@NgModule({
    declarations: [
        ExcelComponent,
        CalendarComponent,
        WorkerComponent,
        ControlComponent,
        VirtualComponent,
        GanttComponent,
    ],
    imports: [
        CommonModule,
        ComModule,
        ngZorroAntdModule,
        CoolRoutingModule,
    ],
    exports: [
    ]
})
export class CoolModule { }