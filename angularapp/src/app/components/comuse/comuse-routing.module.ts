import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormDocComponent } from './form-doc/form-doc.component';
import { FormServiceComponent } from './form-service/form-service.component';

const routes: Routes = [
    {
        path: 'formDoc',
        component: FormDocComponent,
    },
    {
        path: 'formService',
        component: FormServiceComponent,
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ComuseRoutingModule {
}
