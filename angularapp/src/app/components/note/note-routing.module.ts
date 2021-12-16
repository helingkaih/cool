import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RxjsUnsubscribeComponent } from './rxjs-unsubscribe/rxjs-unsubscribe.component';

const routes: Routes = [
    {
        path: 'rxjsUnsubscribe',
        component: RxjsUnsubscribeComponent,
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class NoteRoutingModule {
}
