import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ScWebDocComponent } from './sc-web-doc/sc-web-doc.component';

const routes: Routes = [
    {
        path: 'scWebDoc',
        component: ScWebDocComponent,
    }
];


@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class SpecificationRoutingModule {
}
