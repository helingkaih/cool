import { NgModule, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MenuComponent } from './menu/menu.component'
import { RouterModule, Routes } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CoreModule } from '../core/core.module';
import { NoteModule } from './note/note.module';
import { ComModule } from './common/com.module'
import { ngZorroAntdModule } from '../ng-zorro-antd.module';
import { CoolModule } from './cool/cool.module';
import { ComuseModule } from './comuse/comuse.module';
import { SpecificationModule } from './specification/specification.module';
import { HomeComponent } from './home/home.component';

@NgModule({
    declarations: [
        MenuComponent,
        HomeComponent
    ],
    imports: [
        NzIconModule,
        BrowserModule,
        DragDropModule,
        BrowserAnimationsModule,
        ScrollingModule,
        RouterModule,
        CoreModule,
        NoteModule,
        ComModule,
        ngZorroAntdModule,
        CoolModule,
        ComuseModule,
        SpecificationModule
    ],
    exports: [
        MenuComponent,
        HomeComponent
    ],
    providers: [],
    schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
})
export class ComponentsModule { }
