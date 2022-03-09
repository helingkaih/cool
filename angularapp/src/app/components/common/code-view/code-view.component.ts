import { Template } from '@angular/compiler/src/render3/r3_ast';
import { Component, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import hljs from 'highlight.js';
@Component({
    selector: 'code-view',
    templateUrl: './code-view.component.html',
    styleUrls: ['./code-view.component.scss']
})
export class CodeViewComponent implements OnInit {
    @Input() codeValue!: string; // 需要展示的代码
    @Input() codeType!: string; // 代码显示格式 HTML  TypeScript JavaScript https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md
    @Input() codeId!: string; // 代码块 id
    // 代码块 id
    constructor() { }

    ngOnInit(): void {
        // 初始化 hljs
        hljs.highlightAll();
    }

    ngAfterViewInit() {
        // 创建 pre code dom 节点
        let div = document.getElementById(this.codeId)!;
        let pre = document.createElement('pre');
        let code = document.createElement('code');
        code.className = this.codeType;

        // 用 hljs 转换字符串 原理是 关键字匹配替换
        let html = hljs.highlight(this.codeValue, { language: this.codeType }).value;

        // 将转换好的 html 元素渲染
        code.innerHTML = html;
        pre.appendChild(code);
        div.appendChild(pre);
    }
}
