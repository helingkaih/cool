
import { NgModule } from '@angular/core';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAnchorModule } from 'ng-zorro-antd/anchor';

@NgModule({
    exports: [
        NzMenuModule,
        NzIconModule,
        NzAnchorModule,
    ]
})
export class ngZorroAntdModule {

}
