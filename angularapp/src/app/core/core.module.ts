import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IjsDirective } from './directive/ijs.directive';



@NgModule({
	declarations: [
		IjsDirective
	],
	imports: [
		CommonModule
	],
	exports: [
		IjsDirective
	]
})
export class CoreModule { }
