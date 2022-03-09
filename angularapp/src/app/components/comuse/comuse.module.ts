import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComModule } from '../common/com.module';
import { ngZorroAntdModule } from '../../ng-zorro-antd.module';
import { ComuseRoutingModule } from './comuse-routing.module';
import { FormDocComponent } from './form-doc/form-doc.component';
import { FormServiceComponent } from './form-service/form-service.component';

@NgModule({
    declarations: [
        FormDocComponent,
        FormServiceComponent
    ],
    imports: [
        CommonModule,
        ComModule,
        ngZorroAntdModule,
        ComuseRoutingModule
    ],
    exports: [
    ]
})
export class ComuseModule { }
