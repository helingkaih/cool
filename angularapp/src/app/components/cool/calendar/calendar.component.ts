import { ChangeDetectionStrategy, Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGrigPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';

@Component({
    selector: 'app-calendar',
    templateUrl: './calendar.component.html',
    styleUrls: ['./calendar.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CalendarComponent implements OnInit {
    @ViewChild('calendar', { static: false }) calendarComponent!: FullCalendarComponent;
    calendarWeekends: boolean = true;
    eventlimit: boolean = true; // 列消息more展示
    firstDay: number = 1; // 从monday开始
    languageCalender: string = 'zh-cn'; // 日历语言类型
    /****************************************************/
    // 引入 piugins 这里 有问题 之后再解决
    /****************************************************/
    // calendarPlugins = [dayGridPlugin, timeGrigPlugin, interactionPlugin]; // 插件list
    calendarEvents: EventInput[] | undefined;
    constructor() { }

    ngOnInit(): void {
    }

}
