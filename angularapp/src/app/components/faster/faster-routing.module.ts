import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CompileComponent } from './compile/compile.component';

const routes: Routes = [
    {
        path: 'compile',
        component: CompileComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class FasterRoutingModule {
}
