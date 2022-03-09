import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-compile',
    templateUrl: './compile.component.html',
    styleUrls: ['./compile.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompileComponent implements OnInit {
    linkList: Array<{ title: string, href: string }> = [
        { title: '为什么前端编译和构建会慢', href: 'faster-compile-why' },
        { title: '配置修改', href: 'faster-compile-setting' },
        { title: '配置参数说明', href: 'faster-compile-settingExplain' }
    ];
    addDevelopment: string = `
"development":{
    "optimization": false,
    "sourceMap": false,
    "extractLicenses": false,
    "vendorChunk": true,
    "buildOptimizer": false
}
    `;
    addConfig = `
"development": {
    "browserTarget": "otrsnew:build:development"
},
    `;
    addServe = `
"defaultConfiguration": "development"
    `;
    settingExplain = `
"optimization": true, // 优化代码体积，可以是布尔值或对象
"outputHashing": "all", // 打包文件加上 hash 值
"sourceMap": false, // 生成 sourceMap 文件，会使打包变慢可以是布尔值或对象
"extractCss": true, // 从全局样式中将 css 提取到 css 文件而不是 js 文件中。
"namedChunks": false,  // 使用 chunkName 来替换 chunkId ,保持缓存的能力
"extractLicenses": true, // 用于管理第三方插件的许可协议，将所有许可证提取到一个单独的文件中
"vendorChunk": false, // 是否分离第三方插件
"buildOptimizer": true, // 优化代码体积
    `;

    constructor() { }

    ngOnInit(): void {
    }

}
