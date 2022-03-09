/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { BidiModule } from '@angular/cdk/bidi';
import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzNoAnimationModule } from 'ng-zorro-antd/core/no-animation';
import { NzOutletModule } from 'ng-zorro-antd/core/outlet';
import { NzOverlayModule } from 'ng-zorro-antd/core/overlay';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { CalendarFooterComponent } from './calendar-footer.component';
import { NzDatePickerComponent } from './date-picker.component';
import { DateRangePopupComponent } from './date-range-popup.component';
import { InnerPopupComponent } from './inner-popup.component';
import { LibPackerModule } from './lib/lib-packer.module';
import { NzMonthPickerComponent } from './month-picker.component';
import { NzRangePickerComponent } from './range-picker.component';
import { NzWeekPickerComponent } from './week-picker.component';
import { NzYearPickerComponent } from './year-picker.component';
export class NzDatePickerModule {
}
NzDatePickerModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    BidiModule,
                    CommonModule,
                    FormsModule,
                    OverlayModule,
                    LibPackerModule,
                    NzIconModule,
                    NzOverlayModule,
                    NzNoAnimationModule,
                    NzOutletModule,
                    NzTimePickerModule,
                    NzButtonModule,
                    LibPackerModule
                ],
                exports: [NzDatePickerComponent, NzRangePickerComponent, NzMonthPickerComponent, NzYearPickerComponent, NzWeekPickerComponent],
                declarations: [
                    NzDatePickerComponent,
                    NzMonthPickerComponent,
                    NzYearPickerComponent,
                    NzWeekPickerComponent,
                    NzRangePickerComponent,
                    CalendarFooterComponent,
                    InnerPopupComponent,
                    DateRangePopupComponent
                ]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1waWNrZXIubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY29tcG9uZW50cy9kYXRlLXBpY2tlci9kYXRlLXBpY2tlci5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHO0FBRUgsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDL0MsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN6QyxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0MsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBRXRELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ3RFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUMzRCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFDN0QsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQy9ELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBRXRFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ2hFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ3ZFLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBRTlELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUMxRCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNsRSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNsRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUNoRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQThCaEUsTUFBTSxPQUFPLGtCQUFrQjs7O1lBNUI5QixRQUFRLFNBQUM7Z0JBQ1IsT0FBTyxFQUFFO29CQUNQLFVBQVU7b0JBQ1YsWUFBWTtvQkFDWixXQUFXO29CQUNYLGFBQWE7b0JBQ2IsZUFBZTtvQkFDZixZQUFZO29CQUNaLGVBQWU7b0JBQ2YsbUJBQW1CO29CQUNuQixjQUFjO29CQUNkLGtCQUFrQjtvQkFDbEIsY0FBYztvQkFDZCxlQUFlO2lCQUNoQjtnQkFDRCxPQUFPLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxzQkFBc0IsRUFBRSxzQkFBc0IsRUFBRSxxQkFBcUIsRUFBRSxxQkFBcUIsQ0FBQztnQkFDOUgsWUFBWSxFQUFFO29CQUNaLHFCQUFxQjtvQkFDckIsc0JBQXNCO29CQUN0QixxQkFBcUI7b0JBQ3JCLHFCQUFxQjtvQkFDckIsc0JBQXNCO29CQUV0Qix1QkFBdUI7b0JBQ3ZCLG1CQUFtQjtvQkFDbkIsdUJBQXVCO2lCQUN4QjthQUNGIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2dpdGh1Yi5jb20vTkctWk9SUk8vbmctem9ycm8tYW50ZC9ibG9iL21hc3Rlci9MSUNFTlNFXG4gKi9cblxuaW1wb3J0IHsgQmlkaU1vZHVsZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7IE92ZXJsYXlNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEZvcm1zTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvZm9ybXMnO1xuaW1wb3J0IHsgTnpCdXR0b25Nb2R1bGUgfSBmcm9tICduZy16b3Jyby1hbnRkL2J1dHRvbic7XG5cbmltcG9ydCB7IE56Tm9BbmltYXRpb25Nb2R1bGUgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvbm8tYW5pbWF0aW9uJztcbmltcG9ydCB7IE56T3V0bGV0TW9kdWxlIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL291dGxldCc7XG5pbXBvcnQgeyBOek92ZXJsYXlNb2R1bGUgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvb3ZlcmxheSc7XG5pbXBvcnQgeyBOekljb25Nb2R1bGUgfSBmcm9tICduZy16b3Jyby1hbnRkL2ljb24nO1xuaW1wb3J0IHsgTnpUaW1lUGlja2VyTW9kdWxlIH0gZnJvbSAnbmctem9ycm8tYW50ZC90aW1lLXBpY2tlcic7XG5pbXBvcnQgeyBDYWxlbmRhckZvb3RlckNvbXBvbmVudCB9IGZyb20gJy4vY2FsZW5kYXItZm9vdGVyLmNvbXBvbmVudCc7XG5cbmltcG9ydCB7IE56RGF0ZVBpY2tlckNvbXBvbmVudCB9IGZyb20gJy4vZGF0ZS1waWNrZXIuY29tcG9uZW50JztcbmltcG9ydCB7IERhdGVSYW5nZVBvcHVwQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRlLXJhbmdlLXBvcHVwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBJbm5lclBvcHVwQ29tcG9uZW50IH0gZnJvbSAnLi9pbm5lci1wb3B1cC5jb21wb25lbnQnO1xuXG5pbXBvcnQgeyBMaWJQYWNrZXJNb2R1bGUgfSBmcm9tICcuL2xpYi9saWItcGFja2VyLm1vZHVsZSc7XG5pbXBvcnQgeyBOek1vbnRoUGlja2VyQ29tcG9uZW50IH0gZnJvbSAnLi9tb250aC1waWNrZXIuY29tcG9uZW50JztcbmltcG9ydCB7IE56UmFuZ2VQaWNrZXJDb21wb25lbnQgfSBmcm9tICcuL3JhbmdlLXBpY2tlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgTnpXZWVrUGlja2VyQ29tcG9uZW50IH0gZnJvbSAnLi93ZWVrLXBpY2tlci5jb21wb25lbnQnO1xuaW1wb3J0IHsgTnpZZWFyUGlja2VyQ29tcG9uZW50IH0gZnJvbSAnLi95ZWFyLXBpY2tlci5jb21wb25lbnQnO1xuXG5ATmdNb2R1bGUoe1xuICBpbXBvcnRzOiBbXG4gICAgQmlkaU1vZHVsZSxcbiAgICBDb21tb25Nb2R1bGUsXG4gICAgRm9ybXNNb2R1bGUsXG4gICAgT3ZlcmxheU1vZHVsZSxcbiAgICBMaWJQYWNrZXJNb2R1bGUsXG4gICAgTnpJY29uTW9kdWxlLFxuICAgIE56T3ZlcmxheU1vZHVsZSxcbiAgICBOek5vQW5pbWF0aW9uTW9kdWxlLFxuICAgIE56T3V0bGV0TW9kdWxlLFxuICAgIE56VGltZVBpY2tlck1vZHVsZSxcbiAgICBOekJ1dHRvbk1vZHVsZSxcbiAgICBMaWJQYWNrZXJNb2R1bGVcbiAgXSxcbiAgZXhwb3J0czogW056RGF0ZVBpY2tlckNvbXBvbmVudCwgTnpSYW5nZVBpY2tlckNvbXBvbmVudCwgTnpNb250aFBpY2tlckNvbXBvbmVudCwgTnpZZWFyUGlja2VyQ29tcG9uZW50LCBOeldlZWtQaWNrZXJDb21wb25lbnRdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBOekRhdGVQaWNrZXJDb21wb25lbnQsXG4gICAgTnpNb250aFBpY2tlckNvbXBvbmVudCxcbiAgICBOelllYXJQaWNrZXJDb21wb25lbnQsXG4gICAgTnpXZWVrUGlja2VyQ29tcG9uZW50LFxuICAgIE56UmFuZ2VQaWNrZXJDb21wb25lbnQsXG5cbiAgICBDYWxlbmRhckZvb3RlckNvbXBvbmVudCxcbiAgICBJbm5lclBvcHVwQ29tcG9uZW50LFxuICAgIERhdGVSYW5nZVBvcHVwQ29tcG9uZW50XG4gIF1cbn0pXG5leHBvcnQgY2xhc3MgTnpEYXRlUGlja2VyTW9kdWxlIHt9XG4iXX0=