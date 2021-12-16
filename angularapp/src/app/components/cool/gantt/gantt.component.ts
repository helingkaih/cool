import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-gantt',
    templateUrl: './gantt.component.html',
    styleUrls: ['./gantt.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GanttComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

}
