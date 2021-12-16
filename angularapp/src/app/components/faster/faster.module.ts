import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompileComponent } from './compile/compile.component';
import { ngZorroAntdModule } from '../../ng-zorro-antd.module';
import { FasterRoutingModule } from './faster-routing.module';
import { ComModule } from '../common/com.module';

@NgModule({
    declarations: [
        CompileComponent
    ],
    imports: [
        CommonModule,
        FasterRoutingModule,
        ngZorroAntdModule,
        ComModule
    ]
})
export class FasterModule { }
