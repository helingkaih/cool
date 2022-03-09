import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'info-table',
    templateUrl: './info-table.component.html',
    styleUrls: ['./info-table.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfoTableComponent implements OnInit {
    @Input() tableData: Array<any> = [];      //  表格基本数据

    header: Array<{ key: string, label: string, width: string }> = [ // 表头数据
        { key: 'parameter', label: '参数', width: '20%' },
        { key: 'explain', label: '说明', width: '50%' },
        { key: 'type', label: '类型', width: '10%' },
        { key: 'default', label: '默认值', width: '20%' }
    ]
    constructor() { }

    ngOnInit(): void {
    }

}
