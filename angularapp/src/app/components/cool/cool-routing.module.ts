import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExcelComponent } from './excel/excel.component';
import { CalendarComponent } from './calendar/calendar.component'
import { WorkerComponent } from './worker/worker.component';
import { ControlComponent } from './control/control.component';
import { VirtualComponent } from './virtual/virtual.component';
import { GanttComponent } from './gantt/gantt.component';

const routes: Routes = [
    {
        path: 'excel',
        component: ExcelComponent,
    },
    {
        path: 'fullCalendar',
        component: CalendarComponent,
    },
    {
        path: 'worker',
        component: WorkerComponent,
    },
    {
        path: 'control',
        component: ControlComponent,
    },
    {
        path: 'virtual',
        component: VirtualComponent
    },
    {
        path: 'gantt',
        component: GanttComponent
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CoolRoutingModule {
}
