import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComModule } from '../common/com.module';
import { ngZorroAntdModule } from '../../ng-zorro-antd.module';
import { ScWebDocComponent } from './sc-web-doc/sc-web-doc.component';
import { SpecificationRoutingModule } from './specification-routing.module';

@NgModule({
    declarations: [
        ScWebDocComponent
    ],
    imports: [
        CommonModule,
        ComModule,
        ngZorroAntdModule,
        SpecificationRoutingModule
    ],
    exports: [
    ]
})
export class SpecificationModule { }
