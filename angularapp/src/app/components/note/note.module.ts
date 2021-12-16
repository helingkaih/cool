import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComModule } from '../common/com.module';
import { NoteRoutingModule } from './note-routing.module';
import { RxjsUnsubscribeComponent } from './rxjs-unsubscribe/rxjs-unsubscribe.component';
import { ngZorroAntdModule } from '../../ng-zorro-antd.module';


@NgModule({
    declarations: [
        RxjsUnsubscribeComponent
    ],
    imports: [
        CommonModule,
        ComModule,
        ngZorroAntdModule,
        NoteRoutingModule
    ],
    exports: [
    ],
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class NoteModule { }
