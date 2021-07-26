import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
const routes: Routes = [];
interface MyWindow extends Window {
  __POWERED_BY_QIANKUN__: any;
}
declare var window: MyWindow;
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: APP_BASE_HREF, useValue: window.__POWERED_BY_QIANKUN__ ? '/angular' : '/' }]
})
export class AppRoutingModule { }
