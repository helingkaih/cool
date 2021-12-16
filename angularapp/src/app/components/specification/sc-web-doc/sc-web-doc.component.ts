import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-sc-web-doc',
    templateUrl: './sc-web-doc.component.html',
    styleUrls: ['./sc-web-doc.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScWebDocComponent implements OnInit {
    linkList: Array<{ title: string, href: string, child?}> = [
        {
            title: 'HTML 规范', href: 'form-webdoc-HTML',
            child: [
                { title: '调整嵌套 tag', href: 'form-webdoc-HTML-tag' },
                { title: '合适的注释，合适的间距', href: 'form-webdoc-HTML-notes' },
                { title: 'for/if', href: 'form-webdoc-HTML-forif' },
                { title: '合适的注释，合适的间距', href: 'form-webdoc-HTML-notes' }
            ]
        },
        {
            title: 'TS 规范', href: 'form-webdoc-TS',
            child: [
                { title: 'OnPush 模式', href: 'form-webdoc-TS-OnPush' },
                { title: '方法的注释和长度', href: 'form-webdoc-TS-fun' }
            ]
        },
        {
            title: 'Css 规范', href: 'form-webdoc-Css',
            child: [
                { title: '公共样式', href: 'form-webdoc-Css-common' },
                { title: 'No important', href: 'form-webdoc-Css-important' }
            ]
        },

    ];
    HTMLCode1: string = `
// Bad code
<div>
    <div><p>巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉</p></div>
    <div>
        <span>
            巴拉
        </span>
        <span>
            巴拉
        </span>
    </div>
</div>

// Good code
<div>
    <div>
        <p>
            巴拉巴拉巴拉巴拉巴拉巴拉巴拉巴拉
        </p>
    </div>
    <div>
        <span>巴拉</span>
        <span>巴拉</span>
    </div>
</div>
    `;
    HTMLCode2: string = `
// Bad code
<div>......</div>
<div>......</div>
<div>......</div>

// Good code
// xx 模块头部区域，主要负责过滤搜索功能
<div>......</div>

// xx 模块主题区域，主要负责展示数据功能
<div>......</div>

// xx 模块底部区域，主要信息提交、提交操作等功能
<div>......</div>
`;
    HTMLCode3: string = `
// Bad code
<div *ngIf="true">
    <div *ngFor="let item of arr">
        <div>......</div>
    </div>
</div>

// Good code
<ng-container *ngIf="true">
    <div *ngFor="let item of arr">
        ......
    </div>
</ng-container>
    `;
    TSCode1: string = `
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
@Component({
    ......
    changeDetection: ChangeDetectionStrategy.OnPush
})
    `
    TSCode2: string = `
/**
 * 用来处理xxxxx
 * @param dataa // 参数a
 * @param datab // 参数b
 */
method(dataa:string, datab:object):void {
    ......
}
`;
    CssCode1: string = `
.father{
    .child:{
        color:xxxx,
        ......
    }
}
    `;
    constructor() { }

    ngOnInit(): void {
    }

}
