import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

// 页面右侧锚点列表 最多允许有两级
@Component({
    selector: 'app-anchor',
    templateUrl: './anchor.component.html',
    styleUrls: ['./anchor.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AnchorComponent implements OnInit {
    // 链接的所有信息, href 是 页面锚点的 id
    @Input() linkList!: Array<{ title: string, href: string, child?: Array<{}> }>;
    testhhhhlllk = 'testhhhhlllk';
    constructor() { }

    ngOnInit(): void {
    }

}
