import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { environment } from 'src/environments/environment';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: 'note',
        loadChildren: () => import('src/app/components/note/note.module').then(m => m.NoteModule)
    },
    {
        path: 'cool',
        loadChildren: () => import('src/app/components/cool/cool.module').then(m => m.CoolModule)
    },
    {
        path: 'comuse',
        loadChildren: () => import('src/app/components/comuse/comuse.module').then(m => m.ComuseModule)
    },
    {
        path: 'specification',
        loadChildren: () => import('src/app/components/specification/specification.module').then(m => m.SpecificationModule)
    },
    {
        path: 'faster',
        loadChildren: () => import('src/app/components/faster/faster.module').then(m => m.FasterModule)
    }
];
interface MyWindow extends Window {
    __POWERED_BY_QIANKUN__: any;
}
declare var window: MyWindow;
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [{ provide: APP_BASE_HREF, useValue: (window as any).__POWERED_BY_QIANKUN__ ? '/angular/' : (environment.production ? '/angularapp/' : '/') }] // 处理主应用的基础路由
})
export class AppRoutingModule { }
