import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
    menuList: Array<any> = [
        {
            title: '规范说明',
            icon: 'edit'
        },
        {
            title: '公共组件使用说明',
            icon: 'form',
            child: [
                { title: '表单组件使用' },
                { title: '表格组件使用' }
            ]
        },
        {
            title: 'Ng小技巧',
            icon: 'copy'
        }
    ];
    constructor() { }

    ngOnInit(): void {
    }

}
