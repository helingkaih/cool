import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnchorComponent } from './anchor/anchor.component';
import { InfoTableComponent } from './info-table/info-table.component';
import { CodeViewComponent } from './code-view/code-view.component';
import { ngZorroAntdModule } from '../../ng-zorro-antd.module';

@NgModule({
    declarations: [
        AnchorComponent,
        InfoTableComponent,
        CodeViewComponent,
    ],
    imports: [
        CommonModule,
        ngZorroAntdModule
    ],
    exports: [
        AnchorComponent,
        InfoTableComponent,
        CodeViewComponent,
    ]
})
export class ComModule { }
