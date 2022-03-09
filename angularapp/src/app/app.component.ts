import { Component } from '@angular/core';
import { NzIconService } from 'ng-zorro-antd/icon';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'qiankun-angular';
    constructor(private iconService: NzIconService) {
        // 更改 icon 加载路径, ant icon 会默认拿根目录下的资源
        // http://127.0.0.1:8082 /angularapp
        if ((window as any).__POWERED_BY_QIANKUN__) {
            if (environment.production) {
                // 生产环境
                this.iconService.changeAssetsSource('/angularapp')
            } else {
                // 开发环境
                this.iconService.changeAssetsSource('http://127.0.0.1:8082')
            }
        } else {
            if (environment.production) {
                // 生产环境
                this.iconService.changeAssetsSource('/angularapp')
            } else {
                // 开发环境
                this.iconService.changeAssetsSource('http://127.0.0.1:8082')
            }
        }
    }

    ngOnInit() {
    }
}
