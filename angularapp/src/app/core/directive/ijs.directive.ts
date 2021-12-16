import { Directive, Input } from '@angular/core';

// import js 在某个页面单独导入 js
@Directive({
    selector: '[ijs]'
})
export class IjsDirective {
    @Input() jsList!: Array<string>;
    @Input() linkList!: Array<string>;
    constructor() { }

    ngOnInit() {
        // let linkFragment = document.createDocumentFragment();
        // this.linkList.forEach((element) => {
        //     let node = document.createElement('link');
        //     node.rel = 'stylesheet';
        //     node.href = element;
        //     linkFragment.appendChild(node);
        // });
        // // 插入到head标签的前面
        // document.getElementsByTagName('head')[0].insertBefore(linkFragment, document.getElementsByTagName('script')[0]);


        // let jsFragment = document.createDocumentFragment();
        // this.jsList.forEach((element) => {
        //     let node = document.createElement('script');
        //     node.type = 'text/javascript';
        //     node.async = false;
        //     node.charset = 'utf-8';
        //     node.src = element;
        //     jsFragment.appendChild(node);
        // });
        // // 插入到head标签的前面
        // document.getElementsByTagName('head')[0].insertBefore(jsFragment, document.getElementsByTagName('script')[0]);

    }

}
