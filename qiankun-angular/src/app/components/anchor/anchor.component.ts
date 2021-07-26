import { Component, OnInit, Input } from '@angular/core';

// 页面右侧锚点列表
@Component({
    selector: 'app-anchor',
    templateUrl: './anchor.component.html',
    styleUrls: ['./anchor.component.scss']
})
export class AnchorComponent implements OnInit {
    // 链接的所有信息, href 是 页面锚点的 id
    @Input() linkList: Array<{ title: string, href: string }> = [];
    constructor() { }

    ngOnInit(): void {
    }

}
