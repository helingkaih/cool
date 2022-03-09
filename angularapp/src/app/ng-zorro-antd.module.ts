
import { NgModule } from '@angular/core';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAnchorModule } from 'ng-zorro-antd/anchor';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
@NgModule({
    exports: [
        NzMenuModule,
        NzIconModule,
        NzAnchorModule,
        NzTableModule,
        NzButtonModule,
        NzModalModule,
        NzSwitchModule
    ]
})
export class ngZorroAntdModule {

}
