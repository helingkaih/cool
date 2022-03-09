/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { CandyDate, cloneDate, wrongSortOrder } from 'ng-zorro-antd/core/time';
import { merge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DatePickerService } from './date-picker.service';
import { getTimeConfig, isAllowedDate, PREFIX_CLASS } from './util';
export class DateRangePopupComponent {
    constructor(datePickerService, cdr) {
        this.datePickerService = datePickerService;
        this.cdr = cdr;
        this.inline = false;
        this.dir = 'ltr';
        this.panelModeChange = new EventEmitter();
        this.calendarChange = new EventEmitter();
        this.resultOk = new EventEmitter(); // Emitted when done with date selecting
        this.prefixCls = PREFIX_CLASS;
        this.endPanelMode = 'date';
        this.timeOptions = null;
        this.hoverValue = []; // Range ONLY
        this.checkedPartArr = [false, false];
        this.destroy$ = new Subject();
        this.disabledStartTime = (value) => {
            return this.disabledTime && this.disabledTime(value, 'start');
        };
        this.disabledEndTime = (value) => {
            return this.disabledTime && this.disabledTime(value, 'end');
        };
    }
    get hasTimePicker() {
        return !!this.showTime;
    }
    get hasFooter() {
        return this.showToday || this.hasTimePicker || !!this.extraFooter || !!this.ranges;
    }
    ngOnInit() {
        merge(this.datePickerService.valueChange$, this.datePickerService.inputPartChange$)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
            this.updateActiveDate();
            this.cdr.markForCheck();
        });
    }
    ngOnChanges(changes) {
        // Parse showTime options
        if (changes.showTime || changes.disabledTime) {
            if (this.showTime) {
                this.buildTimeOptions();
            }
        }
        if (changes.panelMode) {
            this.endPanelMode = this.panelMode;
        }
        if (changes.defaultPickerValue) {
            this.updateActiveDate();
        }
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    updateActiveDate() {
        const activeDate = this.datePickerService.hasValue()
            ? this.datePickerService.value
            : this.datePickerService.makeValue(this.defaultPickerValue);
        this.datePickerService.setActiveDate(activeDate, this.hasTimePicker, this.getPanelMode(this.endPanelMode));
    }
    /**
     * Prevent input losing focus when click panel
     * @param event
     */
    onMousedown(event) {
        event.preventDefault();
    }
    onClickOk() {
        const inputIndex = { left: 0, right: 1 }[this.datePickerService.activeInput];
        const value = this.isRange
            ? this.datePickerService.value[inputIndex]
            : this.datePickerService.value;
        this.changeValueFromSelect(value);
        this.resultOk.emit();
    }
    onClickToday(value) {
        this.changeValueFromSelect(value, !this.showTime);
    }
    onCellHover(value) {
        if (!this.isRange) {
            return;
        }
        const otherInputIndex = { left: 1, right: 0 }[this.datePickerService.activeInput];
        const base = this.datePickerService.value[otherInputIndex];
        if (base) {
            if (base.isBeforeDay(value)) {
                this.hoverValue = [base, value];
            }
            else {
                this.hoverValue = [value, base];
            }
        }
    }
    onPanelModeChange(mode, partType) {
        if (this.isRange) {
            const index = this.datePickerService.getActiveIndex(partType);
            if (index === 0) {
                this.panelMode = [mode, this.panelMode[1]];
            }
            else {
                this.panelMode = [this.panelMode[0], mode];
            }
        }
        else {
            this.panelMode = mode;
        }
        this.panelModeChange.emit(this.panelMode);
    }
    onActiveDateChange(value, partType) {
        if (this.isRange) {
            const activeDate = [];
            activeDate[this.datePickerService.getActiveIndex(partType)] = value;
            this.datePickerService.setActiveDate(activeDate, this.hasTimePicker, this.getPanelMode(this.endPanelMode, partType));
        }
        else {
            this.datePickerService.setActiveDate(value);
        }
    }
    onSelectTime(value, partType) {
        if (this.isRange) {
            const newValue = cloneDate(this.datePickerService.value);
            const index = this.datePickerService.getActiveIndex(partType);
            newValue[index] = this.overrideHms(value, newValue[index]);
            this.datePickerService.setValue(newValue);
        }
        else {
            const newValue = this.overrideHms(value, this.datePickerService.value);
            this.datePickerService.setValue(newValue); // If not select a date currently, use today
        }
        this.datePickerService.inputPartChange$.next();
        this.buildTimeOptions();
    }
    changeValueFromSelect(value, emitValue = true) {
        if (this.isRange) {
            const selectedValue = cloneDate(this.datePickerService.value);
            const checkedPart = this.datePickerService.activeInput;
            let nextPart = checkedPart;
            selectedValue[this.datePickerService.getActiveIndex(checkedPart)] = value;
            this.checkedPartArr[this.datePickerService.getActiveIndex(checkedPart)] = true;
            this.hoverValue = selectedValue;
            if (emitValue) {
                if (this.inline) {
                    // For UE, Should always be reversed, and clear vaue when next part is right
                    nextPart = this.reversedPart(checkedPart);
                    if (nextPart === 'right') {
                        selectedValue[this.datePickerService.getActiveIndex(nextPart)] = null;
                        this.checkedPartArr[this.datePickerService.getActiveIndex(nextPart)] = false;
                    }
                    this.datePickerService.setValue(selectedValue);
                    this.calendarChange.emit(selectedValue);
                    if (this.isBothAllowed(selectedValue) && this.checkedPartArr[0] && this.checkedPartArr[1]) {
                        this.clearHoverValue();
                        this.datePickerService.emitValue$.next();
                    }
                }
                else {
                    /**
                     * if sort order is wrong, clear the other part's value
                     */
                    if (wrongSortOrder(selectedValue)) {
                        nextPart = this.reversedPart(checkedPart);
                        selectedValue[this.datePickerService.getActiveIndex(nextPart)] = null;
                        this.checkedPartArr[this.datePickerService.getActiveIndex(nextPart)] = false;
                    }
                    this.datePickerService.setValue(selectedValue);
                    /**
                     * range date usually selected paired,
                     * so we emit the date value only both date is allowed and both part are checked
                     */
                    if (this.isBothAllowed(selectedValue) && this.checkedPartArr[0] && this.checkedPartArr[1]) {
                        this.calendarChange.emit(selectedValue);
                        this.clearHoverValue();
                        this.datePickerService.emitValue$.next();
                    }
                    else if (this.isAllowed(selectedValue)) {
                        nextPart = this.reversedPart(checkedPart);
                        this.calendarChange.emit([value.clone()]);
                    }
                }
            }
            else {
                this.datePickerService.setValue(selectedValue);
            }
            this.datePickerService.inputPartChange$.next(nextPart);
        }
        else {
            this.datePickerService.setValue(value);
            this.datePickerService.inputPartChange$.next();
            if (emitValue && this.isAllowed(value)) {
                this.datePickerService.emitValue$.next();
            }
        }
    }
    reversedPart(part) {
        return part === 'left' ? 'right' : 'left';
    }
    getPanelMode(panelMode, partType) {
        if (this.isRange) {
            return panelMode[this.datePickerService.getActiveIndex(partType)];
        }
        else {
            return panelMode;
        }
    }
    // Get single value or part value of a range
    getValue(partType) {
        if (this.isRange) {
            return (this.datePickerService.value || [])[this.datePickerService.getActiveIndex(partType)];
        }
        else {
            return this.datePickerService.value;
        }
    }
    getActiveDate(partType) {
        if (this.isRange) {
            return this.datePickerService.activeDate[this.datePickerService.getActiveIndex(partType)];
        }
        else {
            return this.datePickerService.activeDate;
        }
    }
    isOneAllowed(selectedValue) {
        const index = this.datePickerService.getActiveIndex();
        const disabledTimeArr = [this.disabledStartTime, this.disabledEndTime];
        return isAllowedDate(selectedValue[index], this.disabledDate, disabledTimeArr[index]);
    }
    isBothAllowed(selectedValue) {
        return (isAllowedDate(selectedValue[0], this.disabledDate, this.disabledStartTime) &&
            isAllowedDate(selectedValue[1], this.disabledDate, this.disabledEndTime));
    }
    isAllowed(value, isBoth = false) {
        if (this.isRange) {
            return isBoth ? this.isBothAllowed(value) : this.isOneAllowed(value);
        }
        else {
            return isAllowedDate(value, this.disabledDate, this.disabledTime);
        }
    }
    getTimeOptions(partType) {
        if (this.showTime && this.timeOptions) {
            return this.timeOptions instanceof Array ? this.timeOptions[this.datePickerService.getActiveIndex(partType)] : this.timeOptions;
        }
        return null;
    }
    onClickPresetRange(val) {
        const value = typeof val === 'function' ? val() : val;
        if (value) {
            this.datePickerService.setValue([new CandyDate(value[0]), new CandyDate(value[1])]);
            this.datePickerService.emitValue$.next();
        }
    }
    onPresetRangeMouseLeave() {
        this.clearHoverValue();
    }
    onHoverPresetRange(val) {
        if (typeof val !== 'function') {
            this.hoverValue = [new CandyDate(val[0]), new CandyDate(val[1])];
        }
    }
    getObjectKeys(obj) {
        return obj ? Object.keys(obj) : [];
    }
    show(partType) {
        const hide = this.showTime && this.isRange && this.datePickerService.activeInput !== partType;
        return !hide;
    }
    clearHoverValue() {
        this.hoverValue = [];
    }
    buildTimeOptions() {
        if (this.showTime) {
            const showTime = typeof this.showTime === 'object' ? this.showTime : {};
            if (this.isRange) {
                const value = this.datePickerService.value;
                this.timeOptions = [this.overrideTimeOptions(showTime, value[0], 'start'), this.overrideTimeOptions(showTime, value[1], 'end')];
            }
            else {
                this.timeOptions = this.overrideTimeOptions(showTime, this.datePickerService.value);
            }
        }
        else {
            this.timeOptions = null;
        }
    }
    overrideTimeOptions(origin, value, partial) {
        let disabledTimeFn;
        if (partial) {
            disabledTimeFn = partial === 'start' ? this.disabledStartTime : this.disabledEndTime;
        }
        else {
            disabledTimeFn = this.disabledTime;
        }
        return Object.assign(Object.assign({}, origin), getTimeConfig(value, disabledTimeFn));
    }
    overrideHms(newValue, oldValue) {
        // tslint:disable-next-line:no-parameter-reassignment
        newValue = newValue || new CandyDate();
        // tslint:disable-next-line:no-parameter-reassignment
        oldValue = oldValue || new CandyDate();
        return oldValue.setHms(newValue.getHours(), newValue.getMinutes(), newValue.getSeconds());
    }
}
DateRangePopupComponent.decorators = [
    { type: Component, args: [{
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                // tslint:disable-next-line:component-selector
                selector: 'date-range-popup',
                exportAs: 'dateRangePopup',
                template: `
    <ng-container *ngIf="isRange; else singlePanel">
      <div class="{{ prefixCls }}-range-wrapper {{ prefixCls }}-date-range-wrapper">
        <div class="{{ prefixCls }}-range-arrow" [style.left.px]="datePickerService?.arrowLeft"></div>
        <div class="{{ prefixCls }}-panel-container">
          <div class="{{ prefixCls }}-panels">
            <ng-container *ngIf="hasTimePicker; else noTimePicker">
              <ng-container *ngTemplateOutlet="tplInnerPopup; context: { partType: datePickerService.activeInput }"></ng-container>
            </ng-container>
            <ng-template #noTimePicker>
              <ng-container *ngTemplateOutlet="tplInnerPopup; context: { partType: 'left' }"></ng-container>
              <ng-container *ngTemplateOutlet="tplInnerPopup; context: { partType: 'right' }"></ng-container>
            </ng-template>
          </div>
          <ng-container *ngTemplateOutlet="tplFooter"></ng-container>
        </div>
      </div>
    </ng-container>
    <ng-template #singlePanel>
      <div
        class="{{ prefixCls }}-panel-container {{ showWeek ? prefixCls + '-week-number' : '' }} {{
          hasTimePicker ? prefixCls + '-time' : ''
        }} {{ isRange ? prefixCls + '-range' : '' }}"
      >
        <div class="{{ prefixCls }}-panel" [class.ant-picker-panel-rtl]="dir === 'rtl'" tabindex="-1">
          <!-- Single ONLY -->
          <ng-container *ngTemplateOutlet="tplInnerPopup"></ng-container>
          <ng-container *ngTemplateOutlet="tplFooter"></ng-container>
        </div>
      </div>
    </ng-template>

    <ng-template #tplInnerPopup let-partType="partType">
      <div class="{{ prefixCls }}-panel" [class.ant-picker-panel-rtl]="dir === 'rtl'">
        <!-- TODO(@wenqi73) [selectedValue] [hoverValue] types-->
        <inner-popup
          [showWeek]="showWeek"
          [endPanelMode]="getPanelMode(endPanelMode, partType)"
          [partType]="partType"
          [locale]="locale!"
          [showTimePicker]="hasTimePicker"
          [timeOptions]="getTimeOptions(partType)"
          [panelMode]="getPanelMode(panelMode, partType)"
          (panelModeChange)="onPanelModeChange($event, partType)"
          [activeDate]="getActiveDate(partType)"
          [value]="getValue(partType)"
          [disabledDate]="disabledDate"
          [dateRender]="dateRender"
          [selectedValue]="$any(datePickerService?.value)"
          [hoverValue]="$any(hoverValue)"
          (cellHover)="onCellHover($event)"
          (selectDate)="changeValueFromSelect($event, !showTime)"
          (selectTime)="onSelectTime($event, partType)"
          (headerChange)="onActiveDateChange($event, partType)"
        ></inner-popup>
      </div>
    </ng-template>

    <ng-template #tplFooter>
      <calendar-footer
        *ngIf="hasFooter"
        [locale]="locale!"
        [isRange]="isRange"
        [showToday]="showToday"
        [showNow]="showNow"
        [hasTimePicker]="hasTimePicker"
        [okDisabled]="!isAllowed($any(datePickerService?.value))"
        [extraFooter]="extraFooter"
        [rangeQuickSelector]="ranges ? tplRangeQuickSelector : null"
        (clickOk)="onClickOk()"
        (clickToday)="onClickToday($event)"
      ></calendar-footer>
    </ng-template>

    <!-- Range ONLY: Range Quick Selector -->
    <ng-template #tplRangeQuickSelector>
      <li
        *ngFor="let name of getObjectKeys(ranges)"
        class="{{ prefixCls }}-preset"
        (click)="onClickPresetRange(ranges![name])"
        (mouseenter)="onHoverPresetRange(ranges![name])"
        (mouseleave)="onPresetRangeMouseLeave()"
      >
        <span class="ant-tag ant-tag-blue">{{ name }}</span>
      </li>
    </ng-template>
  `,
                host: {
                    '(mousedown)': 'onMousedown($event)'
                }
            },] }
];
DateRangePopupComponent.ctorParameters = () => [
    { type: DatePickerService },
    { type: ChangeDetectorRef }
];
DateRangePopupComponent.propDecorators = {
    isRange: [{ type: Input }],
    inline: [{ type: Input }],
    showWeek: [{ type: Input }],
    locale: [{ type: Input }],
    disabledDate: [{ type: Input }],
    disabledTime: [{ type: Input }],
    showToday: [{ type: Input }],
    showNow: [{ type: Input }],
    showTime: [{ type: Input }],
    extraFooter: [{ type: Input }],
    ranges: [{ type: Input }],
    dateRender: [{ type: Input }],
    panelMode: [{ type: Input }],
    defaultPickerValue: [{ type: Input }],
    dir: [{ type: Input }],
    panelModeChange: [{ type: Output }],
    calendarChange: [{ type: Output }],
    resultOk: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1wb3B1cC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb21wb25lbnRzL2RhdGUtcGlja2VyL2RhdGUtcmFuZ2UtcG9wdXAuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUVILE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osS0FBSyxFQUlMLE1BQU0sRUFHTixpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQWdELGNBQWMsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBRzdILE9BQU8sRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ3RDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQVcxRCxPQUFPLEVBQUUsYUFBYSxFQUFFLGFBQWEsRUFBRSxZQUFZLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFtR3BFLE1BQU0sT0FBTyx1QkFBdUI7SUFvQ2xDLFlBQW1CLGlCQUFvQyxFQUFTLEdBQXNCO1FBQW5FLHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBbUI7UUFBUyxRQUFHLEdBQUgsR0FBRyxDQUFtQjtRQWxDN0UsV0FBTSxHQUFZLEtBQUssQ0FBQztRQWF4QixRQUFHLEdBQWMsS0FBSyxDQUFDO1FBRWIsb0JBQWUsR0FBRyxJQUFJLFlBQVksRUFBNkIsQ0FBQztRQUNoRSxtQkFBYyxHQUFHLElBQUksWUFBWSxFQUFtQixDQUFDO1FBQ3JELGFBQVEsR0FBRyxJQUFJLFlBQVksRUFBUSxDQUFDLENBQUMsd0NBQXdDO1FBRWhHLGNBQVMsR0FBVyxZQUFZLENBQUM7UUFDakMsaUJBQVksR0FBOEIsTUFBTSxDQUFDO1FBQ2pE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dXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9ORy1aT1JSTy9uZy16b3Jyby1hbnRkL2Jsb2IvbWFzdGVyL0xJQ0VOU0VcbiAqL1xuXG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IERpcmVjdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7IENhbmR5RGF0ZSwgY2xvbmVEYXRlLCBDb21wYXRpYmxlVmFsdWUsIE5vcm1hbGl6ZWRNb2RlLCBTaW5nbGVWYWx1ZSwgd3JvbmdTb3J0T3JkZXIgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvdGltZSc7XG5pbXBvcnQgeyBGdW5jdGlvblByb3AgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvdHlwZXMnO1xuaW1wb3J0IHsgTnpDYWxlbmRhckkxOG5JbnRlcmZhY2UgfSBmcm9tICduZy16b3Jyby1hbnRkL2kxOG4nO1xuaW1wb3J0IHsgbWVyZ2UsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IERhdGVQaWNrZXJTZXJ2aWNlIH0gZnJvbSAnLi9kYXRlLXBpY2tlci5zZXJ2aWNlJztcbmltcG9ydCB7XG4gIENvbXBhdGlibGVEYXRlLFxuICBEaXNhYmxlZERhdGVGbixcbiAgRGlzYWJsZWRUaW1lRm4sXG4gIERpc2FibGVkVGltZVBhcnRpYWwsXG4gIE56RGF0ZU1vZGUsXG4gIFByZXNldFJhbmdlcyxcbiAgUmFuZ2VQYXJ0VHlwZSxcbiAgU3VwcG9ydFRpbWVPcHRpb25zXG59IGZyb20gJy4vc3RhbmRhcmQtdHlwZXMnO1xuaW1wb3J0IHsgZ2V0VGltZUNvbmZpZywgaXNBbGxvd2VkRGF0ZSwgUFJFRklYX0NMQVNTIH0gZnJvbSAnLi91dGlsJztcblxuQENvbXBvbmVudCh7XG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Y29tcG9uZW50LXNlbGVjdG9yXG4gIHNlbGVjdG9yOiAnZGF0ZS1yYW5nZS1wb3B1cCcsXG4gIGV4cG9ydEFzOiAnZGF0ZVJhbmdlUG9wdXAnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJpc1JhbmdlOyBlbHNlIHNpbmdsZVBhbmVsXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwie3sgcHJlZml4Q2xzIH19LXJhbmdlLXdyYXBwZXIge3sgcHJlZml4Q2xzIH19LWRhdGUtcmFuZ2Utd3JhcHBlclwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwie3sgcHJlZml4Q2xzIH19LXJhbmdlLWFycm93XCIgW3N0eWxlLmxlZnQucHhdPVwiZGF0ZVBpY2tlclNlcnZpY2U/LmFycm93TGVmdFwiPjwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwie3sgcHJlZml4Q2xzIH19LXBhbmVsLWNvbnRhaW5lclwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJ7eyBwcmVmaXhDbHMgfX0tcGFuZWxzXCI+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiaGFzVGltZVBpY2tlcjsgZWxzZSBub1RpbWVQaWNrZXJcIj5cbiAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cInRwbElubmVyUG9wdXA7IGNvbnRleHQ6IHsgcGFydFR5cGU6IGRhdGVQaWNrZXJTZXJ2aWNlLmFjdGl2ZUlucHV0IH1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgPG5nLXRlbXBsYXRlICNub1RpbWVQaWNrZXI+XG4gICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJ0cGxJbm5lclBvcHVwOyBjb250ZXh0OiB7IHBhcnRUeXBlOiAnbGVmdCcgfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwidHBsSW5uZXJQb3B1cDsgY29udGV4dDogeyBwYXJ0VHlwZTogJ3JpZ2h0JyB9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICA8L25nLXRlbXBsYXRlPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJ0cGxGb290ZXJcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L25nLWNvbnRhaW5lcj5cbiAgICA8bmctdGVtcGxhdGUgI3NpbmdsZVBhbmVsPlxuICAgICAgPGRpdlxuICAgICAgICBjbGFzcz1cInt7IHByZWZpeENscyB9fS1wYW5lbC1jb250YWluZXIge3sgc2hvd1dlZWsgPyBwcmVmaXhDbHMgKyAnLXdlZWstbnVtYmVyJyA6ICcnIH19IHt7XG4gICAgICAgICAgaGFzVGltZVBpY2tlciA/IHByZWZpeENscyArICctdGltZScgOiAnJ1xuICAgICAgICB9fSB7eyBpc1JhbmdlID8gcHJlZml4Q2xzICsgJy1yYW5nZScgOiAnJyB9fVwiXG4gICAgICA+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ7eyBwcmVmaXhDbHMgfX0tcGFuZWxcIiBbY2xhc3MuYW50LXBpY2tlci1wYW5lbC1ydGxdPVwiZGlyID09PSAncnRsJ1wiIHRhYmluZGV4PVwiLTFcIj5cbiAgICAgICAgICA8IS0tIFNpbmdsZSBPTkxZIC0tPlxuICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nVGVtcGxhdGVPdXRsZXQ9XCJ0cGxJbm5lclBvcHVwXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cInRwbEZvb3RlclwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvbmctdGVtcGxhdGU+XG5cbiAgICA8bmctdGVtcGxhdGUgI3RwbElubmVyUG9wdXAgbGV0LXBhcnRUeXBlPVwicGFydFR5cGVcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJ7eyBwcmVmaXhDbHMgfX0tcGFuZWxcIiBbY2xhc3MuYW50LXBpY2tlci1wYW5lbC1ydGxdPVwiZGlyID09PSAncnRsJ1wiPlxuICAgICAgICA8IS0tIFRPRE8oQHdlbnFpNzMpIFtzZWxlY3RlZFZhbHVlXSBbaG92ZXJWYWx1ZV0gdHlwZXMtLT5cbiAgICAgICAgPGlubmVyLXBvcHVwXG4gICAgICAgICAgW3Nob3dXZWVrXT1cInNob3dXZWVrXCJcbiAgICAgICAgICBbZW5kUGFuZWxNb2RlXT1cImdldFBhbmVsTW9kZShlbmRQYW5lbE1vZGUsIHBhcnRUeXBlKVwiXG4gICAgICAgICAgW3BhcnRUeXBlXT1cInBhcnRUeXBlXCJcbiAgICAgICAgICBbbG9jYWxlXT1cImxvY2FsZSFcIlxuICAgICAgICAgIFtzaG93VGltZVBpY2tlcl09XCJoYXNUaW1lUGlja2VyXCJcbiAgICAgICAgICBbdGltZU9wdGlvbnNdPVwiZ2V0VGltZU9wdGlvbnMocGFydFR5cGUpXCJcbiAgICAgICAgICBbcGFuZWxNb2RlXT1cImdldFBhbmVsTW9kZShwYW5lbE1vZGUsIHBhcnRUeXBlKVwiXG4gICAgICAgICAgKHBhbmVsTW9kZUNoYW5nZSk9XCJvblBhbmVsTW9kZUNoYW5nZSgkZXZlbnQsIHBhcnRUeXBlKVwiXG4gICAgICAgICAgW2FjdGl2ZURhdGVdPVwiZ2V0QWN0aXZlRGF0ZShwYXJ0VHlwZSlcIlxuICAgICAgICAgIFt2YWx1ZV09XCJnZXRWYWx1ZShwYXJ0VHlwZSlcIlxuICAgICAgICAgIFtkaXNhYmxlZERhdGVdPVwiZGlzYWJsZWREYXRlXCJcbiAgICAgICAgICBbZGF0ZVJlbmRlcl09XCJkYXRlUmVuZGVyXCJcbiAgICAgICAgICBbc2VsZWN0ZWRWYWx1ZV09XCIkYW55KGRhdGVQaWNrZXJTZXJ2aWNlPy52YWx1ZSlcIlxuICAgICAgICAgIFtob3ZlclZhbHVlXT1cIiRhbnkoaG92ZXJWYWx1ZSlcIlxuICAgICAgICAgIChjZWxsSG92ZXIpPVwib25DZWxsSG92ZXIoJGV2ZW50KVwiXG4gICAgICAgICAgKHNlbGVjdERhdGUpPVwiY2hhbmdlVmFsdWVGcm9tU2VsZWN0KCRldmVudCwgIXNob3dUaW1lKVwiXG4gICAgICAgICAgKHNlbGVjdFRpbWUpPVwib25TZWxlY3RUaW1lKCRldmVudCwgcGFydFR5cGUpXCJcbiAgICAgICAgICAoaGVhZGVyQ2hhbmdlKT1cIm9uQWN0aXZlRGF0ZUNoYW5nZSgkZXZlbnQsIHBhcnRUeXBlKVwiXG4gICAgICAgID48L2lubmVyLXBvcHVwPlxuICAgICAgPC9kaXY+XG4gICAgPC9uZy10ZW1wbGF0ZT5cblxuICAgIDxuZy10ZW1wbGF0ZSAjdHBsRm9vdGVyPlxuICAgICAgPGNhbGVuZGFyLWZvb3RlclxuICAgICAgICAqbmdJZj1cImhhc0Zvb3RlclwiXG4gICAgICAgIFtsb2NhbGVdPVwibG9jYWxlIVwiXG4gICAgICAgIFtpc1JhbmdlXT1cImlzUmFuZ2VcIlxuICAgICAgICBbc2hvd1RvZGF5XT1cInNob3dUb2RheVwiXG4gICAgICAgIFtzaG93Tm93XT1cInNob3dOb3dcIlxuICAgICAgICBbaGFzVGltZVBpY2tlcl09XCJoYXNUaW1lUGlja2VyXCJcbiAgICAgICAgW29rRGlzYWJsZWRdPVwiIWlzQWxsb3dlZCgkYW55KGRhdGVQaWNrZXJTZXJ2aWNlPy52YWx1ZSkpXCJcbiAgICAgICAgW2V4dHJhRm9vdGVyXT1cImV4dHJhRm9vdGVyXCJcbiAgICAgICAgW3JhbmdlUXVpY2tTZWxlY3Rvcl09XCJyYW5nZXMgPyB0cGxSYW5nZVF1aWNrU2VsZWN0b3IgOiBudWxsXCJcbiAgICAgICAgKGNsaWNrT2spPVwib25DbGlja09rKClcIlxuICAgICAgICAoY2xpY2tUb2RheSk9XCJvbkNsaWNrVG9kYXkoJGV2ZW50KVwiXG4gICAgICA+PC9jYWxlbmRhci1mb290ZXI+XG4gICAgPC9uZy10ZW1wbGF0ZT5cblxuICAgIDwhLS0gUmFuZ2UgT05MWTogUmFuZ2UgUXVpY2sgU2VsZWN0b3IgLS0+XG4gICAgPG5nLXRlbXBsYXRlICN0cGxSYW5nZVF1aWNrU2VsZWN0b3I+XG4gICAgICA8bGlcbiAgICAgICAgKm5nRm9yPVwibGV0IG5hbWUgb2YgZ2V0T2JqZWN0S2V5cyhyYW5nZXMpXCJcbiAgICAgICAgY2xhc3M9XCJ7eyBwcmVmaXhDbHMgfX0tcHJlc2V0XCJcbiAgICAgICAgKGNsaWNrKT1cIm9uQ2xpY2tQcmVzZXRSYW5nZShyYW5nZXMhW25hbWVdKVwiXG4gICAgICAgIChtb3VzZWVudGVyKT1cIm9uSG92ZXJQcmVzZXRSYW5nZShyYW5nZXMhW25hbWVdKVwiXG4gICAgICAgIChtb3VzZWxlYXZlKT1cIm9uUHJlc2V0UmFuZ2VNb3VzZUxlYXZlKClcIlxuICAgICAgPlxuICAgICAgICA8c3BhbiBjbGFzcz1cImFudC10YWcgYW50LXRhZy1ibHVlXCI+e3sgbmFtZSB9fTwvc3Bhbj5cbiAgICAgIDwvbGk+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgYCxcbiAgaG9zdDoge1xuICAgICcobW91c2Vkb3duKSc6ICdvbk1vdXNlZG93bigkZXZlbnQpJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIERhdGVSYW5nZVBvcHVwQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgpIGlzUmFuZ2UhOiBib29sZWFuO1xuICBASW5wdXQoKSBpbmxpbmU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgc2hvd1dlZWshOiBib29sZWFuO1xuICBASW5wdXQoKSBsb2NhbGUhOiBOekNhbGVuZGFySTE4bkludGVyZmFjZSB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgZGlzYWJsZWREYXRlPzogRGlzYWJsZWREYXRlRm47XG4gIEBJbnB1dCgpIGRpc2FibGVkVGltZT86IERpc2FibGVkVGltZUZuOyAvLyBUaGlzIHdpbGwgbGVhZCB0byByZWJ1aWxkIHRpbWUgb3B0aW9uc1xuICBASW5wdXQoKSBzaG93VG9kYXkhOiBib29sZWFuO1xuICBASW5wdXQoKSBzaG93Tm93ITogYm9vbGVhbjtcbiAgQElucHV0KCkgc2hvd1RpbWUhOiBTdXBwb3J0VGltZU9wdGlvbnMgfCBib29sZWFuO1xuICBASW5wdXQoKSBleHRyYUZvb3Rlcj86IFRlbXBsYXRlUmVmPHZvaWQ+IHwgc3RyaW5nO1xuICBASW5wdXQoKSByYW5nZXM/OiBQcmVzZXRSYW5nZXM7XG4gIEBJbnB1dCgpIGRhdGVSZW5kZXI/OiBzdHJpbmcgfCBUZW1wbGF0ZVJlZjxEYXRlPiB8IEZ1bmN0aW9uUHJvcDxUZW1wbGF0ZVJlZjxEYXRlPiB8IHN0cmluZz47XG4gIEBJbnB1dCgpIHBhbmVsTW9kZSE6IE56RGF0ZU1vZGUgfCBOekRhdGVNb2RlW107XG4gIEBJbnB1dCgpIGRlZmF1bHRQaWNrZXJWYWx1ZSE6IENvbXBhdGlibGVEYXRlIHwgdW5kZWZpbmVkIHwgbnVsbDtcbiAgQElucHV0KCkgZGlyOiBEaXJlY3Rpb24gPSAnbHRyJztcblxuICBAT3V0cHV0KCkgcmVhZG9ubHkgcGFuZWxNb2RlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxOekRhdGVNb2RlIHwgTnpEYXRlTW9kZVtdPigpO1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2FsZW5kYXJDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPENvbXBhdGlibGVWYWx1ZT4oKTtcbiAgQE91dHB1dCgpIHJlYWRvbmx5IHJlc3VsdE9rID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpOyAvLyBFbWl0dGVkIHdoZW4gZG9uZSB3aXRoIGRhdGUgc2VsZWN0aW5nXG5cbiAgcHJlZml4Q2xzOiBzdHJpbmcgPSBQUkVGSVhfQ0xBU1M7XG4gIGVuZFBhbmVsTW9kZTogTnpEYXRlTW9kZSB8IE56RGF0ZU1vZGVbXSA9ICdkYXRlJztcbiAgdGltZU9wdGlvbnM6IFN1cHBvcnRUaW1lT3B0aW9ucyB8IFN1cHBvcnRUaW1lT3B0aW9uc1tdIHwgbnVsbCA9IG51bGw7XG4gIGhvdmVyVmFsdWU6IFNpbmdsZVZhbHVlW10gPSBbXTsgLy8gUmFuZ2UgT05MWVxuICBjaGVja2VkUGFydEFycjogYm9vbGVhbltdID0gW2ZhbHNlLCBmYWxzZV07XG4gIGRlc3Ryb3kkID0gbmV3IFN1YmplY3QoKTtcblxuICBnZXQgaGFzVGltZVBpY2tlcigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLnNob3dUaW1lO1xuICB9XG5cbiAgZ2V0IGhhc0Zvb3RlcigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zaG93VG9kYXkgfHwgdGhpcy5oYXNUaW1lUGlja2VyIHx8ICEhdGhpcy5leHRyYUZvb3RlciB8fCAhIXRoaXMucmFuZ2VzO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHVibGljIGRhdGVQaWNrZXJTZXJ2aWNlOiBEYXRlUGlja2VyU2VydmljZSwgcHVibGljIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHt9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgbWVyZ2UodGhpcy5kYXRlUGlja2VyU2VydmljZS52YWx1ZUNoYW5nZSQsIHRoaXMuZGF0ZVBpY2tlclNlcnZpY2UuaW5wdXRQYXJ0Q2hhbmdlJClcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLnVwZGF0ZUFjdGl2ZURhdGUoKTtcbiAgICAgICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gICAgICB9KTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICAvLyBQYXJzZSBzaG93VGltZSBvcHRpb25zXG4gICAgaWYgKGNoYW5nZXMuc2hvd1RpbWUgfHwgY2hhbmdlcy5kaXNhYmxlZFRpbWUpIHtcbiAgICAgIGlmICh0aGlzLnNob3dUaW1lKSB7XG4gICAgICAgIHRoaXMuYnVpbGRUaW1lT3B0aW9ucygpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAoY2hhbmdlcy5wYW5lbE1vZGUpIHtcbiAgICAgIHRoaXMuZW5kUGFuZWxNb2RlID0gdGhpcy5wYW5lbE1vZGU7XG4gICAgfVxuICAgIGlmIChjaGFuZ2VzLmRlZmF1bHRQaWNrZXJWYWx1ZSkge1xuICAgICAgdGhpcy51cGRhdGVBY3RpdmVEYXRlKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5kZXN0cm95JC5uZXh0KCk7XG4gICAgdGhpcy5kZXN0cm95JC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgdXBkYXRlQWN0aXZlRGF0ZSgpOiB2b2lkIHtcbiAgICBjb25zdCBhY3RpdmVEYXRlID0gdGhpcy5kYXRlUGlja2VyU2VydmljZS5oYXNWYWx1ZSgpXG4gICAgICA/IHRoaXMuZGF0ZVBpY2tlclNlcnZpY2UudmFsdWVcbiAgICAgIDogdGhpcy5kYXRlUGlja2VyU2VydmljZS5tYWtlVmFsdWUodGhpcy5kZWZhdWx0UGlja2VyVmFsdWUhKTtcbiAgICB0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLnNldEFjdGl2ZURhdGUoYWN0aXZlRGF0ZSwgdGhpcy5oYXNUaW1lUGlja2VyLCB0aGlzLmdldFBhbmVsTW9kZSh0aGlzLmVuZFBhbmVsTW9kZSkgYXMgTm9ybWFsaXplZE1vZGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFByZXZlbnQgaW5wdXQgbG9zaW5nIGZvY3VzIHdoZW4gY2xpY2sgcGFuZWxcbiAgICogQHBhcmFtIGV2ZW50XG4gICAqL1xuICBvbk1vdXNlZG93bihldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gIH1cblxuICBvbkNsaWNrT2soKTogdm9pZCB7XG4gICAgY29uc3QgaW5wdXRJbmRleCA9IHsgbGVmdDogMCwgcmlnaHQ6IDEgfVt0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLmFjdGl2ZUlucHV0XTtcbiAgICBjb25zdCB2YWx1ZTogQ2FuZHlEYXRlID0gdGhpcy5pc1JhbmdlXG4gICAgICA/ICh0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLnZhbHVlIGFzIENhbmR5RGF0ZVtdKVtpbnB1dEluZGV4XVxuICAgICAgOiAodGhpcy5kYXRlUGlja2VyU2VydmljZS52YWx1ZSBhcyBDYW5keURhdGUpO1xuICAgIHRoaXMuY2hhbmdlVmFsdWVGcm9tU2VsZWN0KHZhbHVlKTtcbiAgICB0aGlzLnJlc3VsdE9rLmVtaXQoKTtcbiAgfVxuXG4gIG9uQ2xpY2tUb2RheSh2YWx1ZTogQ2FuZHlEYXRlKTogdm9pZCB7XG4gICAgdGhpcy5jaGFuZ2VWYWx1ZUZyb21TZWxlY3QodmFsdWUsICF0aGlzLnNob3dUaW1lKTtcbiAgfVxuXG4gIG9uQ2VsbEhvdmVyKHZhbHVlOiBDYW5keURhdGUpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaXNSYW5nZSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCBvdGhlcklucHV0SW5kZXggPSB7IGxlZnQ6IDEsIHJpZ2h0OiAwIH1bdGhpcy5kYXRlUGlja2VyU2VydmljZS5hY3RpdmVJbnB1dF07XG4gICAgY29uc3QgYmFzZSA9ICh0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLnZhbHVlIGFzIENhbmR5RGF0ZVtdKVtvdGhlcklucHV0SW5kZXhdITtcbiAgICBpZiAoYmFzZSkge1xuICAgICAgaWYgKGJhc2UuaXNCZWZvcmVEYXkodmFsdWUpKSB7XG4gICAgICAgIHRoaXMuaG92ZXJWYWx1ZSA9IFtiYXNlLCB2YWx1ZV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmhvdmVyVmFsdWUgPSBbdmFsdWUsIGJhc2VdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG9uUGFuZWxNb2RlQ2hhbmdlKG1vZGU6IE56RGF0ZU1vZGUsIHBhcnRUeXBlPzogUmFuZ2VQYXJ0VHlwZSk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzUmFuZ2UpIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5kYXRlUGlja2VyU2VydmljZS5nZXRBY3RpdmVJbmRleChwYXJ0VHlwZSk7XG4gICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgdGhpcy5wYW5lbE1vZGUgPSBbbW9kZSwgdGhpcy5wYW5lbE1vZGVbMV1dIGFzIE56RGF0ZU1vZGVbXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucGFuZWxNb2RlID0gW3RoaXMucGFuZWxNb2RlWzBdLCBtb2RlXSBhcyBOekRhdGVNb2RlW107XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMucGFuZWxNb2RlID0gbW9kZTtcbiAgICB9XG4gICAgdGhpcy5wYW5lbE1vZGVDaGFuZ2UuZW1pdCh0aGlzLnBhbmVsTW9kZSk7XG4gIH1cblxuICBvbkFjdGl2ZURhdGVDaGFuZ2UodmFsdWU6IENhbmR5RGF0ZSwgcGFydFR5cGU6IFJhbmdlUGFydFR5cGUpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc1JhbmdlKSB7XG4gICAgICBjb25zdCBhY3RpdmVEYXRlOiBTaW5nbGVWYWx1ZVtdID0gW107XG4gICAgICBhY3RpdmVEYXRlW3RoaXMuZGF0ZVBpY2tlclNlcnZpY2UuZ2V0QWN0aXZlSW5kZXgocGFydFR5cGUpXSA9IHZhbHVlO1xuICAgICAgdGhpcy5kYXRlUGlja2VyU2VydmljZS5zZXRBY3RpdmVEYXRlKFxuICAgICAgICBhY3RpdmVEYXRlLFxuICAgICAgICB0aGlzLmhhc1RpbWVQaWNrZXIsXG4gICAgICAgIHRoaXMuZ2V0UGFuZWxNb2RlKHRoaXMuZW5kUGFuZWxNb2RlLCBwYXJ0VHlwZSkgYXMgTm9ybWFsaXplZE1vZGVcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlclNlcnZpY2Uuc2V0QWN0aXZlRGF0ZSh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgb25TZWxlY3RUaW1lKHZhbHVlOiBDYW5keURhdGUsIHBhcnRUeXBlPzogUmFuZ2VQYXJ0VHlwZSk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzUmFuZ2UpIHtcbiAgICAgIGNvbnN0IG5ld1ZhbHVlID0gY2xvbmVEYXRlKHRoaXMuZGF0ZVBpY2tlclNlcnZpY2UudmFsdWUpIGFzIFNpbmdsZVZhbHVlW107XG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuZGF0ZVBpY2tlclNlcnZpY2UuZ2V0QWN0aXZlSW5kZXgocGFydFR5cGUpO1xuICAgICAgbmV3VmFsdWVbaW5kZXhdID0gdGhpcy5vdmVycmlkZUhtcyh2YWx1ZSwgbmV3VmFsdWVbaW5kZXhdKTtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlclNlcnZpY2Uuc2V0VmFsdWUobmV3VmFsdWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCBuZXdWYWx1ZSA9IHRoaXMub3ZlcnJpZGVIbXModmFsdWUsIHRoaXMuZGF0ZVBpY2tlclNlcnZpY2UudmFsdWUgYXMgQ2FuZHlEYXRlKTtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlclNlcnZpY2Uuc2V0VmFsdWUobmV3VmFsdWUpOyAvLyBJZiBub3Qgc2VsZWN0IGEgZGF0ZSBjdXJyZW50bHksIHVzZSB0b2RheVxuICAgIH1cbiAgICB0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLmlucHV0UGFydENoYW5nZSQubmV4dCgpO1xuICAgIHRoaXMuYnVpbGRUaW1lT3B0aW9ucygpO1xuICB9XG5cbiAgY2hhbmdlVmFsdWVGcm9tU2VsZWN0KHZhbHVlOiBDYW5keURhdGUsIGVtaXRWYWx1ZTogYm9vbGVhbiA9IHRydWUpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc1JhbmdlKSB7XG4gICAgICBjb25zdCBzZWxlY3RlZFZhbHVlOiBTaW5nbGVWYWx1ZVtdID0gY2xvbmVEYXRlKHRoaXMuZGF0ZVBpY2tlclNlcnZpY2UudmFsdWUpIGFzIENhbmR5RGF0ZVtdO1xuICAgICAgY29uc3QgY2hlY2tlZFBhcnQ6IFJhbmdlUGFydFR5cGUgPSB0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLmFjdGl2ZUlucHV0O1xuICAgICAgbGV0IG5leHRQYXJ0OiBSYW5nZVBhcnRUeXBlID0gY2hlY2tlZFBhcnQ7XG5cbiAgICAgIHNlbGVjdGVkVmFsdWVbdGhpcy5kYXRlUGlja2VyU2VydmljZS5nZXRBY3RpdmVJbmRleChjaGVja2VkUGFydCldID0gdmFsdWU7XG4gICAgICB0aGlzLmNoZWNrZWRQYXJ0QXJyW3RoaXMuZGF0ZVBpY2tlclNlcnZpY2UuZ2V0QWN0aXZlSW5kZXgoY2hlY2tlZFBhcnQpXSA9IHRydWU7XG4gICAgICB0aGlzLmhvdmVyVmFsdWUgPSBzZWxlY3RlZFZhbHVlO1xuXG4gICAgICBpZiAoZW1pdFZhbHVlKSB7XG4gICAgICAgIGlmICh0aGlzLmlubGluZSkge1xuICAgICAgICAgIC8vIEZvciBVRSwgU2hvdWxkIGFsd2F5cyBiZSByZXZlcnNlZCwgYW5kIGNsZWFyIHZhdWUgd2hlbiBuZXh0IHBhcnQgaXMgcmlnaHRcbiAgICAgICAgICBuZXh0UGFydCA9IHRoaXMucmV2ZXJzZWRQYXJ0KGNoZWNrZWRQYXJ0KTtcbiAgICAgICAgICBpZiAobmV4dFBhcnQgPT09ICdyaWdodCcpIHtcbiAgICAgICAgICAgIHNlbGVjdGVkVmFsdWVbdGhpcy5kYXRlUGlja2VyU2VydmljZS5nZXRBY3RpdmVJbmRleChuZXh0UGFydCldID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tlZFBhcnRBcnJbdGhpcy5kYXRlUGlja2VyU2VydmljZS5nZXRBY3RpdmVJbmRleChuZXh0UGFydCldID0gZmFsc2U7XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMuZGF0ZVBpY2tlclNlcnZpY2Uuc2V0VmFsdWUoc2VsZWN0ZWRWYWx1ZSk7XG4gICAgICAgICAgdGhpcy5jYWxlbmRhckNoYW5nZS5lbWl0KHNlbGVjdGVkVmFsdWUpO1xuICAgICAgICAgIGlmICh0aGlzLmlzQm90aEFsbG93ZWQoc2VsZWN0ZWRWYWx1ZSkgJiYgdGhpcy5jaGVja2VkUGFydEFyclswXSAmJiB0aGlzLmNoZWNrZWRQYXJ0QXJyWzFdKSB7XG4gICAgICAgICAgICB0aGlzLmNsZWFySG92ZXJWYWx1ZSgpO1xuICAgICAgICAgICAgdGhpcy5kYXRlUGlja2VyU2VydmljZS5lbWl0VmFsdWUkLm5leHQoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogaWYgc29ydCBvcmRlciBpcyB3cm9uZywgY2xlYXIgdGhlIG90aGVyIHBhcnQncyB2YWx1ZVxuICAgICAgICAgICAqL1xuICAgICAgICAgIGlmICh3cm9uZ1NvcnRPcmRlcihzZWxlY3RlZFZhbHVlKSkge1xuICAgICAgICAgICAgbmV4dFBhcnQgPSB0aGlzLnJldmVyc2VkUGFydChjaGVja2VkUGFydCk7XG4gICAgICAgICAgICBzZWxlY3RlZFZhbHVlW3RoaXMuZGF0ZVBpY2tlclNlcnZpY2UuZ2V0QWN0aXZlSW5kZXgobmV4dFBhcnQpXSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLmNoZWNrZWRQYXJ0QXJyW3RoaXMuZGF0ZVBpY2tlclNlcnZpY2UuZ2V0QWN0aXZlSW5kZXgobmV4dFBhcnQpXSA9IGZhbHNlO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuZGF0ZVBpY2tlclNlcnZpY2Uuc2V0VmFsdWUoc2VsZWN0ZWRWYWx1ZSk7XG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogcmFuZ2UgZGF0ZSB1c3VhbGx5IHNlbGVjdGVkIHBhaXJlZCxcbiAgICAgICAgICAgKiBzbyB3ZSBlbWl0IHRoZSBkYXRlIHZhbHVlIG9ubHkgYm90aCBkYXRlIGlzIGFsbG93ZWQgYW5kIGJvdGggcGFydCBhcmUgY2hlY2tlZFxuICAgICAgICAgICAqL1xuICAgICAgICAgIGlmICh0aGlzLmlzQm90aEFsbG93ZWQoc2VsZWN0ZWRWYWx1ZSkgJiYgdGhpcy5jaGVja2VkUGFydEFyclswXSAmJiB0aGlzLmNoZWNrZWRQYXJ0QXJyWzFdKSB7XG4gICAgICAgICAgICB0aGlzLmNhbGVuZGFyQ2hhbmdlLmVtaXQoc2VsZWN0ZWRWYWx1ZSk7XG4gICAgICAgICAgICB0aGlzLmNsZWFySG92ZXJWYWx1ZSgpO1xuICAgICAgICAgICAgdGhpcy5kYXRlUGlja2VyU2VydmljZS5lbWl0VmFsdWUkLm5leHQoKTtcbiAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNBbGxvd2VkKHNlbGVjdGVkVmFsdWUpKSB7XG4gICAgICAgICAgICBuZXh0UGFydCA9IHRoaXMucmV2ZXJzZWRQYXJ0KGNoZWNrZWRQYXJ0KTtcbiAgICAgICAgICAgIHRoaXMuY2FsZW5kYXJDaGFuZ2UuZW1pdChbdmFsdWUuY2xvbmUoKV0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5kYXRlUGlja2VyU2VydmljZS5zZXRWYWx1ZShzZWxlY3RlZFZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZGF0ZVBpY2tlclNlcnZpY2UuaW5wdXRQYXJ0Q2hhbmdlJC5uZXh0KG5leHRQYXJ0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kYXRlUGlja2VyU2VydmljZS5zZXRWYWx1ZSh2YWx1ZSk7XG4gICAgICB0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLmlucHV0UGFydENoYW5nZSQubmV4dCgpO1xuXG4gICAgICBpZiAoZW1pdFZhbHVlICYmIHRoaXMuaXNBbGxvd2VkKHZhbHVlKSkge1xuICAgICAgICB0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLmVtaXRWYWx1ZSQubmV4dCgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldmVyc2VkUGFydChwYXJ0OiBSYW5nZVBhcnRUeXBlKTogUmFuZ2VQYXJ0VHlwZSB7XG4gICAgcmV0dXJuIHBhcnQgPT09ICdsZWZ0JyA/ICdyaWdodCcgOiAnbGVmdCc7XG4gIH1cblxuICBnZXRQYW5lbE1vZGUocGFuZWxNb2RlOiBOekRhdGVNb2RlIHwgTnpEYXRlTW9kZVtdLCBwYXJ0VHlwZT86IFJhbmdlUGFydFR5cGUpOiBOekRhdGVNb2RlIHtcbiAgICBpZiAodGhpcy5pc1JhbmdlKSB7XG4gICAgICByZXR1cm4gcGFuZWxNb2RlW3RoaXMuZGF0ZVBpY2tlclNlcnZpY2UuZ2V0QWN0aXZlSW5kZXgocGFydFR5cGUpXSBhcyBOekRhdGVNb2RlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gcGFuZWxNb2RlIGFzIE56RGF0ZU1vZGU7XG4gICAgfVxuICB9XG5cbiAgLy8gR2V0IHNpbmdsZSB2YWx1ZSBvciBwYXJ0IHZhbHVlIG9mIGEgcmFuZ2VcbiAgZ2V0VmFsdWUocGFydFR5cGU/OiBSYW5nZVBhcnRUeXBlKTogQ2FuZHlEYXRlIHtcbiAgICBpZiAodGhpcy5pc1JhbmdlKSB7XG4gICAgICByZXR1cm4gKCh0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLnZhbHVlIGFzIENhbmR5RGF0ZVtdKSB8fCBbXSlbdGhpcy5kYXRlUGlja2VyU2VydmljZS5nZXRBY3RpdmVJbmRleChwYXJ0VHlwZSldO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5kYXRlUGlja2VyU2VydmljZS52YWx1ZSBhcyBDYW5keURhdGU7XG4gICAgfVxuICB9XG5cbiAgZ2V0QWN0aXZlRGF0ZShwYXJ0VHlwZT86IFJhbmdlUGFydFR5cGUpOiBDYW5keURhdGUge1xuICAgIGlmICh0aGlzLmlzUmFuZ2UpIHtcbiAgICAgIHJldHVybiAodGhpcy5kYXRlUGlja2VyU2VydmljZS5hY3RpdmVEYXRlIGFzIENhbmR5RGF0ZVtdKVt0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLmdldEFjdGl2ZUluZGV4KHBhcnRUeXBlKV07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLmFjdGl2ZURhdGUgYXMgQ2FuZHlEYXRlO1xuICAgIH1cbiAgfVxuXG4gIGRpc2FibGVkU3RhcnRUaW1lOiBEaXNhYmxlZFRpbWVGbiA9ICh2YWx1ZTogRGF0ZSB8IERhdGVbXSkgPT4ge1xuICAgIHJldHVybiB0aGlzLmRpc2FibGVkVGltZSAmJiB0aGlzLmRpc2FibGVkVGltZSh2YWx1ZSwgJ3N0YXJ0Jyk7XG4gIH07XG5cbiAgZGlzYWJsZWRFbmRUaW1lOiBEaXNhYmxlZFRpbWVGbiA9ICh2YWx1ZTogRGF0ZSB8IERhdGVbXSkgPT4ge1xuICAgIHJldHVybiB0aGlzLmRpc2FibGVkVGltZSAmJiB0aGlzLmRpc2FibGVkVGltZSh2YWx1ZSwgJ2VuZCcpO1xuICB9O1xuXG4gIGlzT25lQWxsb3dlZChzZWxlY3RlZFZhbHVlOiBTaW5nbGVWYWx1ZVtdKTogYm9vbGVhbiB7XG4gICAgY29uc3QgaW5kZXggPSB0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLmdldEFjdGl2ZUluZGV4KCk7XG4gICAgY29uc3QgZGlzYWJsZWRUaW1lQXJyID0gW3RoaXMuZGlzYWJsZWRTdGFydFRpbWUsIHRoaXMuZGlzYWJsZWRFbmRUaW1lXTtcbiAgICByZXR1cm4gaXNBbGxvd2VkRGF0ZShzZWxlY3RlZFZhbHVlW2luZGV4XSEsIHRoaXMuZGlzYWJsZWREYXRlLCBkaXNhYmxlZFRpbWVBcnJbaW5kZXhdKTtcbiAgfVxuXG4gIGlzQm90aEFsbG93ZWQoc2VsZWN0ZWRWYWx1ZTogU2luZ2xlVmFsdWVbXSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICBpc0FsbG93ZWREYXRlKHNlbGVjdGVkVmFsdWVbMF0hLCB0aGlzLmRpc2FibGVkRGF0ZSwgdGhpcy5kaXNhYmxlZFN0YXJ0VGltZSkgJiZcbiAgICAgIGlzQWxsb3dlZERhdGUoc2VsZWN0ZWRWYWx1ZVsxXSEsIHRoaXMuZGlzYWJsZWREYXRlLCB0aGlzLmRpc2FibGVkRW5kVGltZSlcbiAgICApO1xuICB9XG5cbiAgaXNBbGxvd2VkKHZhbHVlOiBDb21wYXRpYmxlVmFsdWUsIGlzQm90aDogYm9vbGVhbiA9IGZhbHNlKTogYm9vbGVhbiB7XG4gICAgaWYgKHRoaXMuaXNSYW5nZSkge1xuICAgICAgcmV0dXJuIGlzQm90aCA/IHRoaXMuaXNCb3RoQWxsb3dlZCh2YWx1ZSBhcyBDYW5keURhdGVbXSkgOiB0aGlzLmlzT25lQWxsb3dlZCh2YWx1ZSBhcyBDYW5keURhdGVbXSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBpc0FsbG93ZWREYXRlKHZhbHVlIGFzIENhbmR5RGF0ZSwgdGhpcy5kaXNhYmxlZERhdGUsIHRoaXMuZGlzYWJsZWRUaW1lKTtcbiAgICB9XG4gIH1cblxuICBnZXRUaW1lT3B0aW9ucyhwYXJ0VHlwZT86IFJhbmdlUGFydFR5cGUpOiBTdXBwb3J0VGltZU9wdGlvbnMgfCBudWxsIHtcbiAgICBpZiAodGhpcy5zaG93VGltZSAmJiB0aGlzLnRpbWVPcHRpb25zKSB7XG4gICAgICByZXR1cm4gdGhpcy50aW1lT3B0aW9ucyBpbnN0YW5jZW9mIEFycmF5ID8gdGhpcy50aW1lT3B0aW9uc1t0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLmdldEFjdGl2ZUluZGV4KHBhcnRUeXBlKV0gOiB0aGlzLnRpbWVPcHRpb25zO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIG9uQ2xpY2tQcmVzZXRSYW5nZSh2YWw6IFByZXNldFJhbmdlc1trZXlvZiBQcmVzZXRSYW5nZXNdKTogdm9pZCB7XG4gICAgY29uc3QgdmFsdWUgPSB0eXBlb2YgdmFsID09PSAnZnVuY3Rpb24nID8gdmFsKCkgOiB2YWw7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLnNldFZhbHVlKFtuZXcgQ2FuZHlEYXRlKHZhbHVlWzBdKSwgbmV3IENhbmR5RGF0ZSh2YWx1ZVsxXSldKTtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlclNlcnZpY2UuZW1pdFZhbHVlJC5uZXh0KCk7XG4gICAgfVxuICB9XG5cbiAgb25QcmVzZXRSYW5nZU1vdXNlTGVhdmUoKTogdm9pZCB7XG4gICAgdGhpcy5jbGVhckhvdmVyVmFsdWUoKTtcbiAgfVxuXG4gIG9uSG92ZXJQcmVzZXRSYW5nZSh2YWw6IFByZXNldFJhbmdlc1trZXlvZiBQcmVzZXRSYW5nZXNdKTogdm9pZCB7XG4gICAgaWYgKHR5cGVvZiB2YWwgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMuaG92ZXJWYWx1ZSA9IFtuZXcgQ2FuZHlEYXRlKHZhbFswXSksIG5ldyBDYW5keURhdGUodmFsWzFdKV07XG4gICAgfVxuICB9XG5cbiAgZ2V0T2JqZWN0S2V5cyhvYmo/OiBQcmVzZXRSYW5nZXMpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIG9iaiA/IE9iamVjdC5rZXlzKG9iaikgOiBbXTtcbiAgfVxuXG4gIHNob3cocGFydFR5cGU6IFJhbmdlUGFydFR5cGUpOiBib29sZWFuIHtcbiAgICBjb25zdCBoaWRlID0gdGhpcy5zaG93VGltZSAmJiB0aGlzLmlzUmFuZ2UgJiYgdGhpcy5kYXRlUGlja2VyU2VydmljZS5hY3RpdmVJbnB1dCAhPT0gcGFydFR5cGU7XG4gICAgcmV0dXJuICFoaWRlO1xuICB9XG5cbiAgcHJpdmF0ZSBjbGVhckhvdmVyVmFsdWUoKTogdm9pZCB7XG4gICAgdGhpcy5ob3ZlclZhbHVlID0gW107XG4gIH1cblxuICBwcml2YXRlIGJ1aWxkVGltZU9wdGlvbnMoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc2hvd1RpbWUpIHtcbiAgICAgIGNvbnN0IHNob3dUaW1lID0gdHlwZW9mIHRoaXMuc2hvd1RpbWUgPT09ICdvYmplY3QnID8gdGhpcy5zaG93VGltZSA6IHt9O1xuICAgICAgaWYgKHRoaXMuaXNSYW5nZSkge1xuICAgICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZGF0ZVBpY2tlclNlcnZpY2UudmFsdWUgYXMgQ2FuZHlEYXRlW107XG4gICAgICAgIHRoaXMudGltZU9wdGlvbnMgPSBbdGhpcy5vdmVycmlkZVRpbWVPcHRpb25zKHNob3dUaW1lLCB2YWx1ZVswXSwgJ3N0YXJ0JyksIHRoaXMub3ZlcnJpZGVUaW1lT3B0aW9ucyhzaG93VGltZSwgdmFsdWVbMV0sICdlbmQnKV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnRpbWVPcHRpb25zID0gdGhpcy5vdmVycmlkZVRpbWVPcHRpb25zKHNob3dUaW1lLCB0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLnZhbHVlIGFzIENhbmR5RGF0ZSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMudGltZU9wdGlvbnMgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgb3ZlcnJpZGVUaW1lT3B0aW9ucyhvcmlnaW46IFN1cHBvcnRUaW1lT3B0aW9ucywgdmFsdWU6IENhbmR5RGF0ZSwgcGFydGlhbD86IERpc2FibGVkVGltZVBhcnRpYWwpOiBTdXBwb3J0VGltZU9wdGlvbnMge1xuICAgIGxldCBkaXNhYmxlZFRpbWVGbjtcbiAgICBpZiAocGFydGlhbCkge1xuICAgICAgZGlzYWJsZWRUaW1lRm4gPSBwYXJ0aWFsID09PSAnc3RhcnQnID8gdGhpcy5kaXNhYmxlZFN0YXJ0VGltZSA6IHRoaXMuZGlzYWJsZWRFbmRUaW1lO1xuICAgIH0gZWxzZSB7XG4gICAgICBkaXNhYmxlZFRpbWVGbiA9IHRoaXMuZGlzYWJsZWRUaW1lO1xuICAgIH1cbiAgICByZXR1cm4geyAuLi5vcmlnaW4sIC4uLmdldFRpbWVDb25maWcodmFsdWUsIGRpc2FibGVkVGltZUZuKSB9O1xuICB9XG5cbiAgcHJpdmF0ZSBvdmVycmlkZUhtcyhuZXdWYWx1ZTogQ2FuZHlEYXRlIHwgbnVsbCwgb2xkVmFsdWU6IENhbmR5RGF0ZSB8IG51bGwpOiBDYW5keURhdGUge1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1wYXJhbWV0ZXItcmVhc3NpZ25tZW50XG4gICAgbmV3VmFsdWUgPSBuZXdWYWx1ZSB8fCBuZXcgQ2FuZHlEYXRlKCk7XG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLXBhcmFtZXRlci1yZWFzc2lnbm1lbnRcbiAgICBvbGRWYWx1ZSA9IG9sZFZhbHVlIHx8IG5ldyBDYW5keURhdGUoKTtcbiAgICByZXR1cm4gb2xkVmFsdWUuc2V0SG1zKG5ld1ZhbHVlLmdldEhvdXJzKCksIG5ld1ZhbHVlLmdldE1pbnV0ZXMoKSwgbmV3VmFsdWUuZ2V0U2Vjb25kcygpKTtcbiAgfVxufVxuIl19