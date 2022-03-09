import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MenuComponent implements OnInit {
    menuList: Array<any> = [
        {
            title: '规范说明',
            icon: 'edit',
            child: [
                { title: 'sc-web 规范说明', url: '/specification/scWebDoc' },
            ]
        },
        {
            title: '公共组件使用说明',
            icon: 'form',
            child: [
                { title: '表单组件使用说明', url: '/comuse/formDoc' },
                { title: '新 FormService 使用说明', url: '/comuse/formService' },
                { title: '表格组件使用说明' }
            ]
        },
        {
            title: '随笔',
            icon: 'copy',
            child: [
                { title: 'rxjs-取消订阅最佳实践', url: '/note/rxjsUnsubscribe' }
            ]
        },
        {
            title: '一些酷炫的功能',
            icon: 'api',
            child: [
                { title: '全日历', url: '/cool/fullCalendar' },
                { title: 'EXCEL', url: '/cool/excel' },
                { title: '甘特图', url: '/cool/gantt' },
                { title: '远程桌面控制', url: '/cool/control' },
                { title: 'web worker', url: '/cool/worker' },
                { title: '虚拟滚动', url: '/cool/virtual' }
            ]
        },
        {
            title: '前端跑快快',
            icon: 'double-right',
            child: [
                { title: '编译加速', url: '/faster/compile' }
            ]
        }
    ];
    constructor() { }

    ngOnInit(): void {
    }

}
