import { Component } from '@angular/core';
import { NzIconService } from 'ng-zorro-antd/icon';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'qiankun-angular';
    constructor(private iconService: NzIconService) {
        // 更改 icon 加载路径
        this.iconService.changeAssetsSource('http://192.168.1.209:8082')
    }
}
