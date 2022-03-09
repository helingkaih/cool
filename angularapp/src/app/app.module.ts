import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
import { ComponentsModule } from './components/components.module';
@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        HttpClientModule,
        HttpClientJsonpModule,
        AppRoutingModule,
        ComponentsModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
