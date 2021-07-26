import { NgModule } from '@angular/core';
import { MenuComponent } from './menu/menu.component'
import { NzIconModule } from 'ng-zorro-antd/icon';
import { ngZorroAntdModule } from '../ng-zorro-antd.module';
import * as AllIcons from '@ant-design/icons-angular/icons';
import { IconDefinition } from '@ant-design/icons-angular';
import { BrowserModule } from '@angular/platform-browser';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AnchorComponent } from './anchor/anchor.component';

const antDesignIcons = AllIcons as {
    [key: string]: IconDefinition;
};
const icons: IconDefinition[] = Object.keys(antDesignIcons).map(key => antDesignIcons[key]);
@NgModule({
    declarations: [MenuComponent, AnchorComponent],
    imports: [
        NzIconModule,
        ngZorroAntdModule,
        BrowserModule,
        DragDropModule,
        BrowserAnimationsModule,
        ScrollingModule,
    ],
    exports: [
        MenuComponent,
    ],
    providers: [{ provide: NzIconModule, useValue: icons }],
})
export class ComponentsModule { }
