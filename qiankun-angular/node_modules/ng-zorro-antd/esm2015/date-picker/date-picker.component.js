/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { __decorate, __metadata } from "tslib";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Host, Inject, Input, Optional, Output, QueryList, Renderer2, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { slideMotion } from 'ng-zorro-antd/core/animation';
import { NzNoAnimationDirective } from 'ng-zorro-antd/core/no-animation';
import { NzResizeObserver } from 'ng-zorro-antd/core/resize-observers';
import { CandyDate, cloneDate, wrongSortOrder } from 'ng-zorro-antd/core/time';
import { InputBoolean, toBoolean, valueFunctionProp } from 'ng-zorro-antd/core/util';
import { DateHelperService, NzI18nService } from 'ng-zorro-antd/i18n';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DatePickerService } from './date-picker.service';
import { DateRangePopupComponent } from './date-range-popup.component';
import { PREFIX_CLASS } from './util';
import { Directionality } from '@angular/cdk/bidi';
import { ESCAPE } from '@angular/cdk/keycodes';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { NzConfigService, WithConfig } from 'ng-zorro-antd/core/config';
const POPUP_STYLE_PATCH = { position: 'relative' }; // Aim to override antd's style to support overlay's position strategy (position:absolute will cause it not working because the overlay can't get the height/width of it's content)
const NZ_CONFIG_MODULE_NAME = 'datePicker';
/**
 * The base picker for all common APIs
 */
export class NzDatePickerComponent {
    // ------------------------------------------------------------------------
    // Input API End
    // ------------------------------------------------------------------------
    constructor(nzConfigService, datePickerService, i18n, cdr, renderer, elementRef, dateHelper, nzResizeObserver, platform, doc, directionality, noAnimation) {
        this.nzConfigService = nzConfigService;
        this.datePickerService = datePickerService;
        this.i18n = i18n;
        this.cdr = cdr;
        this.renderer = renderer;
        this.elementRef = elementRef;
        this.dateHelper = dateHelper;
        this.nzResizeObserver = nzResizeObserver;
        this.platform = platform;
        this.directionality = directionality;
        this.noAnimation = noAnimation;
        this._nzModuleName = NZ_CONFIG_MODULE_NAME;
        this.isRange = false; // Indicate whether the value is a range value
        this.dir = 'ltr';
        this.panelMode = 'date';
        this.destroyed$ = new Subject();
        this.isCustomPlaceHolder = false;
        this.isCustomFormat = false;
        this.showTime = false;
        // --- Common API
        this.nzAllowClear = true;
        this.nzAutoFocus = false;
        this.nzDisabled = false;
        this.nzBorderless = false;
        this.nzInputReadOnly = false;
        this.nzInline = false;
        this.nzPlaceHolder = '';
        this.nzPopupStyle = POPUP_STYLE_PATCH;
        this.nzSize = 'default';
        this.nzShowToday = true;
        this.nzMode = 'date';
        this.nzShowNow = true;
        this.nzDefaultPickerValue = null;
        this.nzSeparator = undefined;
        this.nzSuffixIcon = 'calendar';
        this.nzBackdrop = false;
        this.nzId = null;
        // TODO(@wenqi73) The PanelMode need named for each pickers and export
        this.nzOnPanelChange = new EventEmitter();
        this.nzOnCalendarChange = new EventEmitter();
        this.nzOnOk = new EventEmitter();
        this.nzOnOpenChange = new EventEmitter();
        this.inputSize = 12;
        this.destroy$ = new Subject();
        this.prefixCls = PREFIX_CLASS;
        this.activeBarStyle = {};
        this.overlayOpen = false; // Available when "nzOpen" = undefined
        this.overlayPositions = [
            {
                offsetY: 2,
                originX: 'start',
                originY: 'bottom',
                overlayX: 'start',
                overlayY: 'top'
            },
            {
                offsetY: -2,
                originX: 'start',
                originY: 'top',
                overlayX: 'start',
                overlayY: 'bottom'
            },
            {
                offsetY: 2,
                originX: 'end',
                originY: 'bottom',
                overlayX: 'end',
                overlayY: 'top'
            },
            {
                offsetY: -2,
                originX: 'end',
                originY: 'top',
                overlayX: 'end',
                overlayY: 'bottom'
            }
        ];
        this.currentPositionX = 'start';
        this.currentPositionY = 'bottom';
        // ------------------------------------------------------------------------
        // | Control value accessor implements
        // ------------------------------------------------------------------------
        // NOTE: onChangeFn/onTouchedFn will not be assigned if user not use as ngModel
        this.onChangeFn = () => void 0;
        this.onTouchedFn = () => void 0;
        this.document = doc;
        this.origin = new CdkOverlayOrigin(this.elementRef);
    }
    get nzShowTime() {
        return this.showTime;
    }
    set nzShowTime(value) {
        this.showTime = typeof value === 'object' ? value : toBoolean(value);
    }
    get realOpenState() {
        // The value that really decide the open state of overlay
        return this.isOpenHandledByUser() ? !!this.nzOpen : this.overlayOpen;
    }
    ngAfterViewInit() {
        if (this.nzAutoFocus) {
            this.focus();
        }
        if (this.isRange && this.platform.isBrowser) {
            this.nzResizeObserver
                .observe(this.elementRef)
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                this.updateInputWidthAndArrowLeft();
            });
        }
        this.datePickerService.inputPartChange$.pipe(takeUntil(this.destroy$)).subscribe(partType => {
            if (partType) {
                this.datePickerService.activeInput = partType;
            }
            this.focus();
            this.updateInputWidthAndArrowLeft();
        });
    }
    updateInputWidthAndArrowLeft() {
        var _a, _b, _c;
        this.inputWidth = ((_b = (_a = this.rangePickerInputs) === null || _a === void 0 ? void 0 : _a.first) === null || _b === void 0 ? void 0 : _b.nativeElement.offsetWidth) || 0;
        const baseStyle = { position: 'absolute', width: `${this.inputWidth}px` };
        this.datePickerService.arrowLeft =
            this.datePickerService.activeInput === 'left' ? 0 : this.inputWidth + ((_c = this.separatorElement) === null || _c === void 0 ? void 0 : _c.nativeElement.offsetWidth) || 0;
        if (this.dir === 'rtl') {
            this.activeBarStyle = Object.assign(Object.assign({}, baseStyle), { right: `${this.datePickerService.arrowLeft}px` });
        }
        else {
            this.activeBarStyle = Object.assign(Object.assign({}, baseStyle), { left: `${this.datePickerService.arrowLeft}px` });
        }
        this.cdr.markForCheck();
    }
    getInput(partType) {
        var _a, _b;
        if (this.nzInline) {
            return undefined;
        }
        return this.isRange
            ? partType === 'left'
                ? (_a = this.rangePickerInputs) === null || _a === void 0 ? void 0 : _a.first.nativeElement : (_b = this.rangePickerInputs) === null || _b === void 0 ? void 0 : _b.last.nativeElement
            : this.pickerInput.nativeElement;
    }
    focus() {
        const activeInputElement = this.getInput(this.datePickerService.activeInput);
        if (this.document.activeElement !== activeInputElement) {
            activeInputElement === null || activeInputElement === void 0 ? void 0 : activeInputElement.focus();
        }
    }
    onFocus(event, partType) {
        event.preventDefault();
        if (partType) {
            this.datePickerService.inputPartChange$.next(partType);
        }
        this.renderClass(true);
    }
    // blur event has not the relatedTarget in IE11, use focusout instead.
    onFocusout(event) {
        event.preventDefault();
        if (!this.elementRef.nativeElement.contains(event.relatedTarget)) {
            this.checkAndClose();
        }
        this.renderClass(false);
    }
    // Show overlay content
    open() {
        if (this.nzInline) {
            return;
        }
        if (!this.realOpenState && !this.nzDisabled) {
            this.updateInputWidthAndArrowLeft();
            this.overlayOpen = true;
            this.nzOnOpenChange.emit(true);
            this.cdr.markForCheck();
        }
    }
    close() {
        if (this.nzInline) {
            return;
        }
        if (this.realOpenState) {
            this.overlayOpen = false;
            this.nzOnOpenChange.emit(false);
        }
    }
    showClear() {
        return !this.nzDisabled && !this.isEmptyValue(this.datePickerService.value) && this.nzAllowClear;
    }
    checkAndClose() {
        if (!this.realOpenState) {
            return;
        }
        if (this.panel.isAllowed(this.datePickerService.value, true)) {
            if (Array.isArray(this.datePickerService.value) && wrongSortOrder(this.datePickerService.value)) {
                const index = this.datePickerService.getActiveIndex();
                const value = this.datePickerService.value[index];
                this.panel.changeValueFromSelect(value, true);
                return;
            }
            this.updateInputValue();
            this.datePickerService.emitValue$.next();
        }
        else {
            this.datePickerService.setValue(this.datePickerService.initialValue);
            this.close();
        }
    }
    onClickInputBox(event) {
        event.stopPropagation();
        this.focus();
        if (!this.isOpenHandledByUser()) {
            this.open();
        }
    }
    onOverlayKeydown(event) {
        if (event.keyCode === ESCAPE) {
            this.datePickerService.initValue();
        }
    }
    // NOTE: A issue here, the first time position change, the animation will not be triggered.
    // Because the overlay's "positionChange" event is emitted after the content's full shown up.
    // All other components like "nz-dropdown" which depends on overlay also has the same issue.
    // See: https://github.com/NG-ZORRO/ng-zorro-antd/issues/1429
    onPositionChange(position) {
        this.currentPositionX = position.connectionPair.originX;
        this.currentPositionY = position.connectionPair.originY;
        this.cdr.detectChanges(); // Take side-effects to position styles
    }
    onClickClear(event) {
        event.preventDefault();
        event.stopPropagation();
        this.datePickerService.initValue(true);
        this.datePickerService.emitValue$.next();
    }
    updateInputValue() {
        const newValue = this.datePickerService.value;
        if (this.isRange) {
            this.inputValue = newValue ? newValue.map(v => this.formatValue(v)) : ['', ''];
        }
        else {
            this.inputValue = this.formatValue(newValue);
        }
        this.cdr.markForCheck();
    }
    formatValue(value) {
        return this.dateHelper.format(value && value.nativeDate, this.nzFormat);
    }
    onInputChange(value, isEnter = false) {
        /**
         * in IE11 focus/blur will trigger ngModelChange if placeholder changes,
         * so we forbidden IE11 to open panel through input change
         */
        if (!this.platform.TRIDENT &&
            this.document.activeElement === this.getInput(this.datePickerService.activeInput) &&
            !this.realOpenState) {
            this.open();
            return;
        }
        const date = this.checkValidDate(value);
        // Can only change date when it's open
        if (date && this.realOpenState) {
            this.panel.changeValueFromSelect(date, isEnter);
        }
    }
    onKeyupEnter(event) {
        this.onInputChange(event.target.value, true);
    }
    checkValidDate(value) {
        const date = new CandyDate(this.dateHelper.parseDate(value, this.nzFormat));
        if (!date.isValid() || value !== this.dateHelper.format(date.nativeDate, this.nzFormat)) {
            return null;
        }
        return date;
    }
    getPlaceholder(partType) {
        return this.isRange ? this.nzPlaceHolder[this.datePickerService.getActiveIndex(partType)] : this.nzPlaceHolder;
    }
    isEmptyValue(value) {
        if (value === null) {
            return true;
        }
        else if (this.isRange) {
            return !value || !Array.isArray(value) || value.every(val => !val);
        }
        else {
            return !value;
        }
    }
    // Whether open state is permanently controlled by user himself
    isOpenHandledByUser() {
        return this.nzOpen !== undefined;
    }
    ngOnInit() {
        var _a;
        // Subscribe the every locale change if the nzLocale is not handled by user
        if (!this.nzLocale) {
            this.i18n.localeChange.pipe(takeUntil(this.destroyed$)).subscribe(() => this.setLocale());
        }
        // Default value
        this.datePickerService.isRange = this.isRange;
        this.datePickerService.initValue(true);
        this.datePickerService.emitValue$.pipe(takeUntil(this.destroyed$)).subscribe(_ => {
            var _a, _b, _c, _d;
            const value = this.datePickerService.value;
            this.datePickerService.initialValue = cloneDate(value);
            if (this.isRange) {
                const vAsRange = value;
                if (vAsRange.length) {
                    this.onChangeFn([(_b = (_a = vAsRange[0]) === null || _a === void 0 ? void 0 : _a.nativeDate) !== null && _b !== void 0 ? _b : null, (_d = (_c = vAsRange[1]) === null || _c === void 0 ? void 0 : _c.nativeDate) !== null && _d !== void 0 ? _d : null]);
                }
                else {
                    this.onChangeFn([]);
                }
            }
            else {
                if (value) {
                    this.onChangeFn(value.nativeDate);
                }
                else {
                    this.onChangeFn(null);
                }
            }
            this.onTouchedFn();
            // When value emitted, overlay will be closed
            this.close();
        });
        (_a = this.directionality.change) === null || _a === void 0 ? void 0 : _a.pipe(takeUntil(this.destroyed$)).subscribe((direction) => {
            this.dir = direction;
            this.cdr.detectChanges();
        });
        this.dir = this.directionality.value;
        this.inputValue = this.isRange ? ['', ''] : '';
        this.setModeAndFormat();
        this.datePickerService.valueChange$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.updateInputValue();
        });
    }
    ngOnChanges(changes) {
        var _a, _b;
        if (changes.nzPopupStyle) {
            // Always assign the popup style patch
            this.nzPopupStyle = this.nzPopupStyle ? Object.assign(Object.assign({}, this.nzPopupStyle), POPUP_STYLE_PATCH) : POPUP_STYLE_PATCH;
        }
        // Mark as customized placeholder by user once nzPlaceHolder assigned at the first time
        if ((_a = changes.nzPlaceHolder) === null || _a === void 0 ? void 0 : _a.currentValue) {
            this.isCustomPlaceHolder = true;
        }
        if ((_b = changes.nzFormat) === null || _b === void 0 ? void 0 : _b.currentValue) {
            this.isCustomFormat = true;
        }
        if (changes.nzLocale) {
            // The nzLocale is currently handled by user
            this.setDefaultPlaceHolder();
        }
        if (changes.nzRenderExtraFooter) {
            this.extraFooter = valueFunctionProp(this.nzRenderExtraFooter);
        }
        if (changes.nzMode) {
            this.setDefaultPlaceHolder();
            this.setModeAndFormat();
        }
    }
    ngOnDestroy() {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
    setModeAndFormat() {
        const inputFormats = {
            year: 'yyyy',
            month: 'yyyy-MM',
            week: this.i18n.getDateLocale() ? 'RRRR-II' : 'yyyy-ww',
            date: this.nzShowTime ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'
        };
        if (!this.nzMode) {
            this.nzMode = 'date';
        }
        this.panelMode = this.isRange ? [this.nzMode, this.nzMode] : this.nzMode;
        // Default format when it's empty
        if (!this.isCustomFormat) {
            this.nzFormat = inputFormats[this.nzMode];
        }
        this.inputSize = Math.max(10, this.nzFormat.length) + 2;
        this.updateInputValue();
    }
    /**
     * Triggered when overlayOpen changes (different with realOpenState)
     * @param open The overlayOpen in picker component
     */
    onOpenChange(open) {
        this.nzOnOpenChange.emit(open);
    }
    writeValue(value) {
        this.setValue(value);
        this.cdr.markForCheck();
    }
    registerOnChange(fn) {
        this.onChangeFn = fn;
    }
    registerOnTouched(fn) {
        this.onTouchedFn = fn;
    }
    setDisabledState(isDisabled) {
        this.nzDisabled = isDisabled;
        this.cdr.markForCheck();
    }
    // ------------------------------------------------------------------------
    // | Internal methods
    // ------------------------------------------------------------------------
    // Reload locale from i18n with side effects
    setLocale() {
        this.nzLocale = this.i18n.getLocaleData('DatePicker', {});
        this.setDefaultPlaceHolder();
        this.cdr.markForCheck();
    }
    setDefaultPlaceHolder() {
        if (!this.isCustomPlaceHolder && this.nzLocale) {
            const defaultPlaceholder = {
                year: this.getPropertyOfLocale('yearPlaceholder'),
                month: this.getPropertyOfLocale('monthPlaceholder'),
                week: this.getPropertyOfLocale('weekPlaceholder'),
                date: this.getPropertyOfLocale('placeholder')
            };
            const defaultRangePlaceholder = {
                year: this.getPropertyOfLocale('rangeYearPlaceholder'),
                month: this.getPropertyOfLocale('rangeMonthPlaceholder'),
                week: this.getPropertyOfLocale('rangeWeekPlaceholder'),
                date: this.getPropertyOfLocale('rangePlaceholder')
            };
            this.nzPlaceHolder = this.isRange
                ? defaultRangePlaceholder[this.nzMode]
                : defaultPlaceholder[this.nzMode];
        }
    }
    getPropertyOfLocale(type) {
        return this.nzLocale.lang[type] || this.i18n.getLocaleData(`DatePicker.lang.${type}`);
    }
    // Safe way of setting value with default
    setValue(value) {
        const newValue = this.datePickerService.makeValue(value);
        this.datePickerService.setValue(newValue);
        this.datePickerService.initialValue = newValue;
    }
    renderClass(value) {
        // TODO: avoid autoFocus cause change after checked error
        if (value) {
            this.renderer.addClass(this.elementRef.nativeElement, 'ant-picker-focused');
        }
        else {
            this.renderer.removeClass(this.elementRef.nativeElement, 'ant-picker-focused');
        }
    }
    onPanelModeChange(panelMode) {
        this.nzOnPanelChange.emit(panelMode);
    }
    // Emit nzOnCalendarChange when select date by nz-range-picker
    onCalendarChange(value) {
        if (this.isRange && Array.isArray(value)) {
            const rangeValue = value.filter(x => x instanceof CandyDate).map(x => x.nativeDate);
            this.nzOnCalendarChange.emit(rangeValue);
        }
    }
    onResultOk() {
        var _a, _b;
        if (this.isRange) {
            const value = this.datePickerService.value;
            if (value.length) {
                this.nzOnOk.emit([((_a = value[0]) === null || _a === void 0 ? void 0 : _a.nativeDate) || null, ((_b = value[1]) === null || _b === void 0 ? void 0 : _b.nativeDate) || null]);
            }
            else {
                this.nzOnOk.emit([]);
            }
        }
        else {
            if (this.datePickerService.value) {
                this.nzOnOk.emit(this.datePickerService.value.nativeDate);
            }
            else {
                this.nzOnOk.emit(null);
            }
        }
    }
}
NzDatePickerComponent.decorators = [
    { type: Component, args: [{
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                selector: 'nz-date-picker,nz-week-picker,nz-month-picker,nz-year-picker,nz-range-picker',
                exportAs: 'nzDatePicker',
                template: `
    <ng-container *ngIf="!nzInline; else inlineMode">
      <!-- Content of single picker -->
      <div *ngIf="!isRange" class="{{ prefixCls }}-input">
        <input
          #pickerInput
          [attr.id]="nzId"
          [class.ant-input-disabled]="nzDisabled"
          [disabled]="nzDisabled"
          [readOnly]="nzInputReadOnly"
          [(ngModel)]="inputValue"
          placeholder="{{ getPlaceholder() }}"
          [size]="inputSize"
          (focus)="onFocus($event)"
          (focusout)="onFocusout($event)"
          (ngModelChange)="onInputChange($event)"
          (keyup.enter)="onKeyupEnter($event)"
        />
        <ng-container *ngTemplateOutlet="tplRightRest"></ng-container>
      </div>

      <!-- Content of range picker -->
      <ng-container *ngIf="isRange">
        <div class="{{ prefixCls }}-input">
          <ng-container *ngTemplateOutlet="tplRangeInput; context: { partType: 'left' }"></ng-container>
        </div>
        <div #separatorElement class="{{ prefixCls }}-range-separator">
          <span class="{{ prefixCls }}-separator">
            <ng-container *ngIf="nzSeparator; else defaultSeparator">{{ nzSeparator }}</ng-container>
          </span>
          <ng-template #defaultSeparator>
            <i nz-icon nzType="swap-right" nzTheme="outline"></i>
          </ng-template>
        </div>
        <div class="{{ prefixCls }}-input">
          <ng-container *ngTemplateOutlet="tplRangeInput; context: { partType: 'right' }"></ng-container>
        </div>
        <ng-container *ngTemplateOutlet="tplRightRest"></ng-container>
      </ng-container>
    </ng-container>
    <!-- Input for Range ONLY -->
    <ng-template #tplRangeInput let-partType="partType">
      <input
        #rangePickerInput
        [disabled]="nzDisabled"
        [readOnly]="nzInputReadOnly"
        [size]="inputSize"
        (click)="onClickInputBox($event)"
        (focusout)="onFocusout($event)"
        (focus)="onFocus($event, partType)"
        (keyup.enter)="onKeyupEnter($event)"
        [(ngModel)]="inputValue[datePickerService.getActiveIndex(partType)]"
        (ngModelChange)="onInputChange($event)"
        placeholder="{{ getPlaceholder(partType) }}"
      />
    </ng-template>

    <!-- Right operator icons -->
    <ng-template #tplRightRest>
      <div class="{{ prefixCls }}-active-bar" [ngStyle]="activeBarStyle"></div>
      <span *ngIf="showClear()" class="{{ prefixCls }}-clear" (click)="onClickClear($event)">
        <i nz-icon nzType="close-circle" nzTheme="fill"></i>
      </span>
      <span class="{{ prefixCls }}-suffix">
        <ng-container *nzStringTemplateOutlet="nzSuffixIcon; let suffixIcon">
          <i nz-icon [nzType]="suffixIcon"></i>
        </ng-container>
      </span>
    </ng-template>

    <ng-template #inlineMode>
      <div class="ant-picker-wrapper" [nzNoAnimation]="!!noAnimation?.nzNoAnimation" [@slideMotion]="'enter'" style="position: relative;">
        <div
          class="{{ prefixCls }}-dropdown {{ nzDropdownClassName }}"
          [class.ant-picker-dropdown-rtl]="dir === 'rtl'"
          [class.ant-picker-dropdown-placement-bottomLeft]="currentPositionY === 'bottom' && currentPositionX === 'start'"
          [class.ant-picker-dropdown-placement-topLeft]="currentPositionY === 'top' && currentPositionX === 'start'"
          [class.ant-picker-dropdown-placement-bottomRight]="currentPositionY === 'bottom' && currentPositionX === 'end'"
          [class.ant-picker-dropdown-placement-topRight]="currentPositionY === 'top' && currentPositionX === 'end'"
          [class.ant-picker-dropdown-range]="isRange"
          [class.ant-picker-active-left]="datePickerService.activeInput === 'left'"
          [class.ant-picker-active-right]="datePickerService.activeInput === 'right'"
          [ngStyle]="nzPopupStyle"
        >
          <date-range-popup
            [isRange]="isRange"
            [inline]="nzInline"
            [defaultPickerValue]="nzDefaultPickerValue"
            [showWeek]="nzMode === 'week'"
            [panelMode]="panelMode"
            (panelModeChange)="onPanelModeChange($event)"
            (calendarChange)="onCalendarChange($event)"
            [locale]="nzLocale?.lang!"
            [showToday]="nzMode === 'date' && nzShowToday && !isRange && !nzShowTime"
            [showNow]="nzMode === 'date' && nzShowNow && !isRange && !!nzShowTime"
            [showTime]="nzShowTime"
            [dateRender]="nzDateRender"
            [disabledDate]="nzDisabledDate"
            [disabledTime]="nzDisabledTime"
            [extraFooter]="extraFooter"
            [ranges]="nzRanges"
            [dir]="dir"
            (resultOk)="onResultOk()"
          ></date-range-popup>
        </div>
      </div>
    </ng-template>

    <!-- Overlay -->
    <ng-template
      cdkConnectedOverlay
      nzConnectedOverlay
      [cdkConnectedOverlayHasBackdrop]="nzBackdrop"
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayOpen]="realOpenState"
      [cdkConnectedOverlayPositions]="overlayPositions"
      [cdkConnectedOverlayTransformOriginOn]="'.ant-picker-wrapper'"
      (positionChange)="onPositionChange($event)"
      (detach)="close()"
      (overlayKeydown)="onOverlayKeydown($event)"
    >
      <ng-container *ngTemplateOutlet="inlineMode"></ng-container>
    </ng-template>
  `,
                host: {
                    '[class.ant-picker]': `true`,
                    '[class.ant-picker-range]': `isRange`,
                    '[class.ant-picker-large]': `nzSize === 'large'`,
                    '[class.ant-picker-small]': `nzSize === 'small'`,
                    '[class.ant-picker-disabled]': `nzDisabled`,
                    '[class.ant-picker-rtl]': `dir === 'rtl'`,
                    '[class.ant-picker-borderless]': `nzBorderless`,
                    '[class.ant-picker-inline]': `nzInline`,
                    '(click)': 'onClickInputBox($event)'
                },
                providers: [
                    DatePickerService,
                    {
                        provide: NG_VALUE_ACCESSOR,
                        multi: true,
                        useExisting: forwardRef(() => NzDatePickerComponent)
                    }
                ],
                animations: [slideMotion]
            },] }
];
NzDatePickerComponent.ctorParameters = () => [
    { type: NzConfigService },
    { type: DatePickerService },
    { type: NzI18nService },
    { type: ChangeDetectorRef },
    { type: Renderer2 },
    { type: ElementRef },
    { type: DateHelperService },
    { type: NzResizeObserver },
    { type: Platform },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
    { type: Directionality, decorators: [{ type: Optional }] },
    { type: NzNoAnimationDirective, decorators: [{ type: Host }, { type: Optional }] }
];
NzDatePickerComponent.propDecorators = {
    nzAllowClear: [{ type: Input }],
    nzAutoFocus: [{ type: Input }],
    nzDisabled: [{ type: Input }],
    nzBorderless: [{ type: Input }],
    nzInputReadOnly: [{ type: Input }],
    nzInline: [{ type: Input }],
    nzOpen: [{ type: Input }],
    nzDisabledDate: [{ type: Input }],
    nzLocale: [{ type: Input }],
    nzPlaceHolder: [{ type: Input }],
    nzPopupStyle: [{ type: Input }],
    nzDropdownClassName: [{ type: Input }],
    nzSize: [{ type: Input }],
    nzFormat: [{ type: Input }],
    nzDateRender: [{ type: Input }],
    nzDisabledTime: [{ type: Input }],
    nzRenderExtraFooter: [{ type: Input }],
    nzShowToday: [{ type: Input }],
    nzMode: [{ type: Input }],
    nzShowNow: [{ type: Input }],
    nzRanges: [{ type: Input }],
    nzDefaultPickerValue: [{ type: Input }],
    nzSeparator: [{ type: Input }],
    nzSuffixIcon: [{ type: Input }],
    nzBackdrop: [{ type: Input }],
    nzId: [{ type: Input }],
    nzOnPanelChange: [{ type: Output }],
    nzOnCalendarChange: [{ type: Output }],
    nzOnOk: [{ type: Output }],
    nzOnOpenChange: [{ type: Output }],
    nzShowTime: [{ type: Input }],
    cdkConnectedOverlay: [{ type: ViewChild, args: [CdkConnectedOverlay, { static: false },] }],
    panel: [{ type: ViewChild, args: [DateRangePopupComponent, { static: false },] }],
    separatorElement: [{ type: ViewChild, args: ['separatorElement', { static: false },] }],
    pickerInput: [{ type: ViewChild, args: ['pickerInput', { static: false },] }],
    rangePickerInputs: [{ type: ViewChildren, args: ['rangePickerInput',] }]
};
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzDatePickerComponent.prototype, "nzAllowClear", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzDatePickerComponent.prototype, "nzAutoFocus", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzDatePickerComponent.prototype, "nzDisabled", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzDatePickerComponent.prototype, "nzBorderless", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzDatePickerComponent.prototype, "nzInputReadOnly", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzDatePickerComponent.prototype, "nzInline", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzDatePickerComponent.prototype, "nzOpen", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzDatePickerComponent.prototype, "nzShowToday", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzDatePickerComponent.prototype, "nzShowNow", void 0);
__decorate([
    WithConfig(),
    __metadata("design:type", String)
], NzDatePickerComponent.prototype, "nzSeparator", void 0);
__decorate([
    WithConfig(),
    __metadata("design:type", Object)
], NzDatePickerComponent.prototype, "nzSuffixIcon", void 0);
__decorate([
    WithConfig(),
    __metadata("design:type", Object)
], NzDatePickerComponent.prototype, "nzBackdrop", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1waWNrZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY29tcG9uZW50cy9kYXRlLXBpY2tlci9kYXRlLXBpY2tlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHOztBQUVILE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixJQUFJLEVBQ0osTUFBTSxFQUNOLEtBQUssRUFJTCxRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsRUFDVCxTQUFTLEVBR1QsU0FBUyxFQUNULFlBQVksRUFDWixpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUF3QixpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3pFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUMzRCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUN6RSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUN2RSxPQUFPLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBbUIsY0FBYyxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFFaEcsT0FBTyxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUNyRixPQUFPLEVBQUUsaUJBQWlCLEVBQTRELGFBQWEsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ2hJLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0IsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzFELE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDhCQUE4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NUI7SUFBZixZQUFZLEVBQUU7OzJEQUErQjtBQUM5QjtJQUFmLFlBQVksRUFBRTs7OERBQWtDO0FBQ2pDO0lBQWYsWUFBWSxFQUFFOzt1REFBMkI7QUFDMUI7SUFBZixZQUFZLEVBQUU7O3FEQUFrQjtBQVdqQjtJQUFmLFlBQVksRUFBRTs7MERBQTZCO0FBRTVCO0lBQWYsWUFBWSxFQUFFOzt3REFBMkI7QUFHNUI7SUFBYixVQUFVLEVBQUU7OzBEQUFrQztBQUNqQztJQUFiLFVBQVUsRUFBRTs7MkRBQTREO0FBQzNEO0lBQWIsVUFBVSxFQUFFOzt5REFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9ORy1aT1JSTy9uZy16b3Jyby1hbnRkL2Jsb2IvbWFzdGVyL0xJQ0VOU0VcbiAqL1xuXG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBIb3N0LFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFJlbmRlcmVyMixcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0NoaWxkcmVuLFxuICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IHNsaWRlTW90aW9uIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL2FuaW1hdGlvbic7XG5pbXBvcnQgeyBOek5vQW5pbWF0aW9uRGlyZWN0aXZlIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL25vLWFuaW1hdGlvbic7XG5pbXBvcnQgeyBOelJlc2l6ZU9ic2VydmVyIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL3Jlc2l6ZS1vYnNlcnZlcnMnO1xuaW1wb3J0IHsgQ2FuZHlEYXRlLCBjbG9uZURhdGUsIENvbXBhdGlibGVWYWx1ZSwgd3JvbmdTb3J0T3JkZXIgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvdGltZSc7XG5pbXBvcnQgeyBCb29sZWFuSW5wdXQsIEZ1bmN0aW9uUHJvcCwgTnpTYWZlQW55LCBPbkNoYW5nZVR5cGUsIE9uVG91Y2hlZFR5cGUgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvdHlwZXMnO1xuaW1wb3J0IHsgSW5wdXRCb29sZWFuLCB0b0Jvb2xlYW4sIHZhbHVlRnVuY3Rpb25Qcm9wIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL3V0aWwnO1xuaW1wb3J0IHsgRGF0ZUhlbHBlclNlcnZpY2UsIE56RGF0ZVBpY2tlckkxOG5JbnRlcmZhY2UsIE56RGF0ZVBpY2tlckxhbmdJMThuSW50ZXJmYWNlLCBOekkxOG5TZXJ2aWNlIH0gZnJvbSAnbmctem9ycm8tYW50ZC9pMThuJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IERhdGVQaWNrZXJTZXJ2aWNlIH0gZnJvbSAnLi9kYXRlLXBpY2tlci5zZXJ2aWNlJztcbmltcG9ydCB7IERhdGVSYW5nZVBvcHVwQ29tcG9uZW50IH0gZnJvbSAnLi9kYXRlLXJhbmdlLXBvcHVwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBQUkVGSVhfQ0xBU1MgfSBmcm9tICcuL3V0aWwnO1xuXG5pbXBvcnQgeyBEaXJlY3Rpb24sIERpcmVjdGlvbmFsaXR5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHsgRVNDQVBFIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7XG4gIENka0Nvbm5lY3RlZE92ZXJsYXksXG4gIENka092ZXJsYXlPcmlnaW4sXG4gIENvbm5lY3RlZE92ZXJsYXlQb3NpdGlvbkNoYW5nZSxcbiAgQ29ubmVjdGlvblBvc2l0aW9uUGFpcixcbiAgSG9yaXpvbnRhbENvbm5lY3Rpb25Qb3MsXG4gIFZlcnRpY2FsQ29ubmVjdGlvblBvc1xufSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQgeyBQbGF0Zm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQgeyBOekNvbmZpZ0tleSwgTnpDb25maWdTZXJ2aWNlLCBXaXRoQ29uZmlnIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL2NvbmZpZyc7XG5pbXBvcnQgeyBDb21wYXRpYmxlRGF0ZSwgRGlzYWJsZWRUaW1lRm4sIE56RGF0ZU1vZGUsIFByZXNldFJhbmdlcywgUmFuZ2VQYXJ0VHlwZSwgU3VwcG9ydFRpbWVPcHRpb25zIH0gZnJvbSAnLi9zdGFuZGFyZC10eXBlcyc7XG5cbmNvbnN0IFBPUFVQX1NUWUxFX1BBVENIID0geyBwb3NpdGlvbjogJ3JlbGF0aXZlJyB9OyAvLyBBaW0gdG8gb3ZlcnJpZGUgYW50ZCdzIHN0eWxlIHRvIHN1cHBvcnQgb3ZlcmxheSdzIHBvc2l0aW9uIHN0cmF0ZWd5IChwb3NpdGlvbjphYnNvbHV0ZSB3aWxsIGNhdXNlIGl0IG5vdCB3b3JraW5nIGJlY2F1c2UgdGhlIG92ZXJsYXkgY2FuJ3QgZ2V0IHRoZSBoZWlnaHQvd2lkdGggb2YgaXQncyBjb250ZW50KVxuY29uc3QgTlpfQ09ORklHX01PRFVMRV9OQU1FOiBOekNvbmZpZ0tleSA9ICdkYXRlUGlja2VyJztcblxuZXhwb3J0IHR5cGUgTnpEYXRlUGlja2VyU2l6ZVR5cGUgPSAnbGFyZ2UnIHwgJ2RlZmF1bHQnIHwgJ3NtYWxsJztcblxuLyoqXG4gKiBUaGUgYmFzZSBwaWNrZXIgZm9yIGFsbCBjb21tb24gQVBJc1xuICovXG5AQ29tcG9uZW50KHtcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHNlbGVjdG9yOiAnbnotZGF0ZS1waWNrZXIsbnotd2Vlay1waWNrZXIsbnotbW9udGgtcGlja2VyLG56LXllYXItcGlja2VyLG56LXJhbmdlLXBpY2tlcicsXG4gIGV4cG9ydEFzOiAnbnpEYXRlUGlja2VyJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiIW56SW5saW5lOyBlbHNlIGlubGluZU1vZGVcIj5cbiAgICAgIDwhLS0gQ29udGVudCBvZiBzaW5nbGUgcGlja2VyIC0tPlxuICAgICAgPGRpdiAqbmdJZj1cIiFpc1JhbmdlXCIgY2xhc3M9XCJ7eyBwcmVmaXhDbHMgfX0taW5wdXRcIj5cbiAgICAgICAgPGlucHV0XG4gICAgICAgICAgI3BpY2tlcklucHV0XG4gICAgICAgICAgW2F0dHIuaWRdPVwibnpJZFwiXG4gICAgICAgICAgW2NsYXNzLmFudC1pbnB1dC1kaXNhYmxlZF09XCJuekRpc2FibGVkXCJcbiAgICAgICAgICBbZGlzYWJsZWRdPVwibnpEaXNhYmxlZFwiXG4gICAgICAgICAgW3JlYWRPbmx5XT1cIm56SW5wdXRSZWFkT25seVwiXG4gICAgICAgICAgWyhuZ01vZGVsKV09XCJpbnB1dFZhbHVlXCJcbiAgICAgICAgICBwbGFjZWhvbGRlcj1cInt7IGdldFBsYWNlaG9sZGVyKCkgfX1cIlxuICAgICAgICAgIFtzaXplXT1cImlucHV0U2l6ZVwiXG4gICAgICAgICAgKGZvY3VzKT1cIm9uRm9jdXMoJGV2ZW50KVwiXG4gICAgICAgICAgKGZvY3Vzb3V0KT1cIm9uRm9jdXNvdXQoJGV2ZW50KVwiXG4gICAgICAgICAgKG5nTW9kZWxDaGFuZ2UpPVwib25JbnB1dENoYW5nZSgkZXZlbnQpXCJcbiAgICAgICAgICAoa2V5dXAuZW50ZXIpPVwib25LZXl1cEVudGVyKCRldmVudClcIlxuICAgICAgICAvPlxuICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwidHBsUmlnaHRSZXN0XCI+PC9uZy1jb250YWluZXI+XG4gICAgICA8L2Rpdj5cblxuICAgICAgPCEtLSBDb250ZW50IG9mIHJhbmdlIHBpY2tlciAtLT5cbiAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJpc1JhbmdlXCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJ7eyBwcmVmaXhDbHMgfX0taW5wdXRcIj5cbiAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwidHBsUmFuZ2VJbnB1dDsgY29udGV4dDogeyBwYXJ0VHlwZTogJ2xlZnQnIH1cIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxkaXYgI3NlcGFyYXRvckVsZW1lbnQgY2xhc3M9XCJ7eyBwcmVmaXhDbHMgfX0tcmFuZ2Utc2VwYXJhdG9yXCI+XG4gICAgICAgICAgPHNwYW4gY2xhc3M9XCJ7eyBwcmVmaXhDbHMgfX0tc2VwYXJhdG9yXCI+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwibnpTZXBhcmF0b3I7IGVsc2UgZGVmYXVsdFNlcGFyYXRvclwiPnt7IG56U2VwYXJhdG9yIH19PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgIDxuZy10ZW1wbGF0ZSAjZGVmYXVsdFNlcGFyYXRvcj5cbiAgICAgICAgICAgIDxpIG56LWljb24gbnpUeXBlPVwic3dhcC1yaWdodFwiIG56VGhlbWU9XCJvdXRsaW5lXCI+PC9pPlxuICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwie3sgcHJlZml4Q2xzIH19LWlucHV0XCI+XG4gICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cInRwbFJhbmdlSW5wdXQ7IGNvbnRleHQ6IHsgcGFydFR5cGU6ICdyaWdodCcgfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cInRwbFJpZ2h0UmVzdFwiPjwvbmctY29udGFpbmVyPlxuICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgPC9uZy1jb250YWluZXI+XG4gICAgPCEtLSBJbnB1dCBmb3IgUmFuZ2UgT05MWSAtLT5cbiAgICA8bmctdGVtcGxhdGUgI3RwbFJhbmdlSW5wdXQgbGV0LXBhcnRUeXBlPVwicGFydFR5cGVcIj5cbiAgICAgIDxpbnB1dFxuICAgICAgICAjcmFuZ2VQaWNrZXJJbnB1dFxuICAgICAgICBbZGlzYWJsZWRdPVwibnpEaXNhYmxlZFwiXG4gICAgICAgIFtyZWFkT25seV09XCJueklucHV0UmVhZE9ubHlcIlxuICAgICAgICBbc2l6ZV09XCJpbnB1dFNpemVcIlxuICAgICAgICAoY2xpY2spPVwib25DbGlja0lucHV0Qm94KCRldmVudClcIlxuICAgICAgICAoZm9jdXNvdXQpPVwib25Gb2N1c291dCgkZXZlbnQpXCJcbiAgICAgICAgKGZvY3VzKT1cIm9uRm9jdXMoJGV2ZW50LCBwYXJ0VHlwZSlcIlxuICAgICAgICAoa2V5dXAuZW50ZXIpPVwib25LZXl1cEVudGVyKCRldmVudClcIlxuICAgICAgICBbKG5nTW9kZWwpXT1cImlucHV0VmFsdWVbZGF0ZVBpY2tlclNlcnZpY2UuZ2V0QWN0aXZlSW5kZXgocGFydFR5cGUpXVwiXG4gICAgICAgIChuZ01vZGVsQ2hhbmdlKT1cIm9uSW5wdXRDaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAgIHBsYWNlaG9sZGVyPVwie3sgZ2V0UGxhY2Vob2xkZXIocGFydFR5cGUpIH19XCJcbiAgICAgIC8+XG4gICAgPC9uZy10ZW1wbGF0ZT5cblxuICAgIDwhLS0gUmlnaHQgb3BlcmF0b3IgaWNvbnMgLS0+XG4gICAgPG5nLXRlbXBsYXRlICN0cGxSaWdodFJlc3Q+XG4gICAgICA8ZGl2IGNsYXNzPVwie3sgcHJlZml4Q2xzIH19LWFjdGl2ZS1iYXJcIiBbbmdTdHlsZV09XCJhY3RpdmVCYXJTdHlsZVwiPjwvZGl2PlxuICAgICAgPHNwYW4gKm5nSWY9XCJzaG93Q2xlYXIoKVwiIGNsYXNzPVwie3sgcHJlZml4Q2xzIH19LWNsZWFyXCIgKGNsaWNrKT1cIm9uQ2xpY2tDbGVhcigkZXZlbnQpXCI+XG4gICAgICAgIDxpIG56LWljb24gbnpUeXBlPVwiY2xvc2UtY2lyY2xlXCIgbnpUaGVtZT1cImZpbGxcIj48L2k+XG4gICAgICA8L3NwYW4+XG4gICAgICA8c3BhbiBjbGFzcz1cInt7IHByZWZpeENscyB9fS1zdWZmaXhcIj5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbnpTdHJpbmdUZW1wbGF0ZU91dGxldD1cIm56U3VmZml4SWNvbjsgbGV0IHN1ZmZpeEljb25cIj5cbiAgICAgICAgICA8aSBuei1pY29uIFtuelR5cGVdPVwic3VmZml4SWNvblwiPjwvaT5cbiAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICA8L3NwYW4+XG4gICAgPC9uZy10ZW1wbGF0ZT5cblxuICAgIDxuZy10ZW1wbGF0ZSAjaW5saW5lTW9kZT5cbiAgICAgIDxkaXYgY2xhc3M9XCJhbnQtcGlja2VyLXdyYXBwZXJcIiBbbnpOb0FuaW1hdGlvbl09XCIhIW5vQW5pbWF0aW9uPy5uek5vQW5pbWF0aW9uXCIgW0BzbGlkZU1vdGlvbl09XCInZW50ZXInXCIgc3R5bGU9XCJwb3NpdGlvbjogcmVsYXRpdmU7XCI+XG4gICAgICAgIDxkaXZcbiAgICAgICAgICBjbGFzcz1cInt7IHByZWZpeENscyB9fS1kcm9wZG93biB7eyBuekRyb3Bkb3duQ2xhc3NOYW1lIH19XCJcbiAgICAgICAgICBbY2xhc3MuYW50LXBpY2tlci1kcm9wZG93bi1ydGxdPVwiZGlyID09PSAncnRsJ1wiXG4gICAgICAgICAgW2NsYXNzLmFudC1waWNrZXItZHJvcGRvd24tcGxhY2VtZW50LWJvdHRvbUxlZnRdPVwiY3VycmVudFBvc2l0aW9uWSA9PT0gJ2JvdHRvbScgJiYgY3VycmVudFBvc2l0aW9uWCA9PT0gJ3N0YXJ0J1wiXG4gICAgICAgICAgW2NsYXNzLmFudC1waWNrZXItZHJvcGRvd24tcGxhY2VtZW50LXRvcExlZnRdPVwiY3VycmVudFBvc2l0aW9uWSA9PT0gJ3RvcCcgJiYgY3VycmVudFBvc2l0aW9uWCA9PT0gJ3N0YXJ0J1wiXG4gICAgICAgICAgW2NsYXNzLmFudC1waWNrZXItZHJvcGRvd24tcGxhY2VtZW50LWJvdHRvbVJpZ2h0XT1cImN1cnJlbnRQb3NpdGlvblkgPT09ICdib3R0b20nICYmIGN1cnJlbnRQb3NpdGlvblggPT09ICdlbmQnXCJcbiAgICAgICAgICBbY2xhc3MuYW50LXBpY2tlci1kcm9wZG93bi1wbGFjZW1lbnQtdG9wUmlnaHRdPVwiY3VycmVudFBvc2l0aW9uWSA9PT0gJ3RvcCcgJiYgY3VycmVudFBvc2l0aW9uWCA9PT0gJ2VuZCdcIlxuICAgICAgICAgIFtjbGFzcy5hbnQtcGlja2VyLWRyb3Bkb3duLXJhbmdlXT1cImlzUmFuZ2VcIlxuICAgICAgICAgIFtjbGFzcy5hbnQtcGlja2VyLWFjdGl2ZS1sZWZ0XT1cImRhdGVQaWNrZXJTZXJ2aWNlLmFjdGl2ZUlucHV0ID09PSAnbGVmdCdcIlxuICAgICAgICAgIFtjbGFzcy5hbnQtcGlja2VyLWFjdGl2ZS1yaWdodF09XCJkYXRlUGlja2VyU2VydmljZS5hY3RpdmVJbnB1dCA9PT0gJ3JpZ2h0J1wiXG4gICAgICAgICAgW25nU3R5bGVdPVwibnpQb3B1cFN0eWxlXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxkYXRlLXJhbmdlLXBvcHVwXG4gICAgICAgICAgICBbaXNSYW5nZV09XCJpc1JhbmdlXCJcbiAgICAgICAgICAgIFtpbmxpbmVdPVwibnpJbmxpbmVcIlxuICAgICAgICAgICAgW2RlZmF1bHRQaWNrZXJWYWx1ZV09XCJuekRlZmF1bHRQaWNrZXJWYWx1ZVwiXG4gICAgICAgICAgICBbc2hvd1dlZWtdPVwibnpNb2RlID09PSAnd2VlaydcIlxuICAgICAgICAgICAgW3BhbmVsTW9kZV09XCJwYW5lbE1vZGVcIlxuICAgICAgICAgICAgKHBhbmVsTW9kZUNoYW5nZSk9XCJvblBhbmVsTW9kZUNoYW5nZSgkZXZlbnQpXCJcbiAgICAgICAgICAgIChjYWxlbmRhckNoYW5nZSk9XCJvbkNhbGVuZGFyQ2hhbmdlKCRldmVudClcIlxuICAgICAgICAgICAgW2xvY2FsZV09XCJuekxvY2FsZT8ubGFuZyFcIlxuICAgICAgICAgICAgW3Nob3dUb2RheV09XCJuek1vZGUgPT09ICdkYXRlJyAmJiBuelNob3dUb2RheSAmJiAhaXNSYW5nZSAmJiAhbnpTaG93VGltZVwiXG4gICAgICAgICAgICBbc2hvd05vd109XCJuek1vZGUgPT09ICdkYXRlJyAmJiBuelNob3dOb3cgJiYgIWlzUmFuZ2UgJiYgISFuelNob3dUaW1lXCJcbiAgICAgICAgICAgIFtzaG93VGltZV09XCJuelNob3dUaW1lXCJcbiAgICAgICAgICAgIFtkYXRlUmVuZGVyXT1cIm56RGF0ZVJlbmRlclwiXG4gICAgICAgICAgICBbZGlzYWJsZWREYXRlXT1cIm56RGlzYWJsZWREYXRlXCJcbiAgICAgICAgICAgIFtkaXNhYmxlZFRpbWVdPVwibnpEaXNhYmxlZFRpbWVcIlxuICAgICAgICAgICAgW2V4dHJhRm9vdGVyXT1cImV4dHJhRm9vdGVyXCJcbiAgICAgICAgICAgIFtyYW5nZXNdPVwibnpSYW5nZXNcIlxuICAgICAgICAgICAgW2Rpcl09XCJkaXJcIlxuICAgICAgICAgICAgKHJlc3VsdE9rKT1cIm9uUmVzdWx0T2soKVwiXG4gICAgICAgICAgPjwvZGF0ZS1yYW5nZS1wb3B1cD5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L25nLXRlbXBsYXRlPlxuXG4gICAgPCEtLSBPdmVybGF5IC0tPlxuICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgY2RrQ29ubmVjdGVkT3ZlcmxheVxuICAgICAgbnpDb25uZWN0ZWRPdmVybGF5XG4gICAgICBbY2RrQ29ubmVjdGVkT3ZlcmxheUhhc0JhY2tkcm9wXT1cIm56QmFja2Ryb3BcIlxuICAgICAgW2Nka0Nvbm5lY3RlZE92ZXJsYXlPcmlnaW5dPVwib3JpZ2luXCJcbiAgICAgIFtjZGtDb25uZWN0ZWRPdmVybGF5T3Blbl09XCJyZWFsT3BlblN0YXRlXCJcbiAgICAgIFtjZGtDb25uZWN0ZWRPdmVybGF5UG9zaXRpb25zXT1cIm92ZXJsYXlQb3NpdGlvbnNcIlxuICAgICAgW2Nka0Nvbm5lY3RlZE92ZXJsYXlUcmFuc2Zvcm1PcmlnaW5Pbl09XCInLmFudC1waWNrZXItd3JhcHBlcidcIlxuICAgICAgKHBvc2l0aW9uQ2hhbmdlKT1cIm9uUG9zaXRpb25DaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAoZGV0YWNoKT1cImNsb3NlKClcIlxuICAgICAgKG92ZXJsYXlLZXlkb3duKT1cIm9uT3ZlcmxheUtleWRvd24oJGV2ZW50KVwiXG4gICAgPlxuICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cImlubGluZU1vZGVcIj48L25nLWNvbnRhaW5lcj5cbiAgICA8L25nLXRlbXBsYXRlPlxuICBgLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5hbnQtcGlja2VyXSc6IGB0cnVlYCxcbiAgICAnW2NsYXNzLmFudC1waWNrZXItcmFuZ2VdJzogYGlzUmFuZ2VgLFxuICAgICdbY2xhc3MuYW50LXBpY2tlci1sYXJnZV0nOiBgbnpTaXplID09PSAnbGFyZ2UnYCxcbiAgICAnW2NsYXNzLmFudC1waWNrZXItc21hbGxdJzogYG56U2l6ZSA9PT0gJ3NtYWxsJ2AsXG4gICAgJ1tjbGFzcy5hbnQtcGlja2VyLWRpc2FibGVkXSc6IGBuekRpc2FibGVkYCxcbiAgICAnW2NsYXNzLmFudC1waWNrZXItcnRsXSc6IGBkaXIgPT09ICdydGwnYCxcbiAgICAnW2NsYXNzLmFudC1waWNrZXItYm9yZGVybGVzc10nOiBgbnpCb3JkZXJsZXNzYCxcbiAgICAnW2NsYXNzLmFudC1waWNrZXItaW5saW5lXSc6IGBueklubGluZWAsXG4gICAgJyhjbGljayknOiAnb25DbGlja0lucHV0Qm94KCRldmVudCknXG4gIH0sXG4gIHByb3ZpZGVyczogW1xuICAgIERhdGVQaWNrZXJTZXJ2aWNlLFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgbXVsdGk6IHRydWUsXG4gICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOekRhdGVQaWNrZXJDb21wb25lbnQpXG4gICAgfVxuICBdLFxuICBhbmltYXRpb25zOiBbc2xpZGVNb3Rpb25dXG59KVxuZXhwb3J0IGNsYXNzIE56RGF0ZVBpY2tlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXQsIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcbiAgcmVhZG9ubHkgX256TW9kdWxlTmFtZTogTnpDb25maWdLZXkgPSBOWl9DT05GSUdfTU9EVUxFX05BTUU7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uekFsbG93Q2xlYXI6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX256QXV0b0ZvY3VzOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uekRpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uekJvcmRlcmxlc3M6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX256SW5wdXRSZWFkT25seTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpJbmxpbmU6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX256T3BlbjogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpTaG93VG9kYXk6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX256U2hvd05vdzogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpNb2RlOiBOekRhdGVNb2RlIHwgTnpEYXRlTW9kZVtdIHwgc3RyaW5nIHwgc3RyaW5nW10gfCBudWxsIHwgdW5kZWZpbmVkO1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpTaG93VGltZTogQm9vbGVhbklucHV0IHwgU3VwcG9ydFRpbWVPcHRpb25zIHwgbnVsbCB8IHVuZGVmaW5lZDtcblxuICBpc1JhbmdlOiBib29sZWFuID0gZmFsc2U7IC8vIEluZGljYXRlIHdoZXRoZXIgdGhlIHZhbHVlIGlzIGEgcmFuZ2UgdmFsdWVcbiAgZXh0cmFGb290ZXI/OiBUZW1wbGF0ZVJlZjxOelNhZmVBbnk+IHwgc3RyaW5nO1xuICBkaXI6IERpcmVjdGlvbiA9ICdsdHInO1xuXG4gIHB1YmxpYyBwYW5lbE1vZGU6IE56RGF0ZU1vZGUgfCBOekRhdGVNb2RlW10gPSAnZGF0ZSc7XG4gIHByaXZhdGUgZGVzdHJveWVkJDogU3ViamVjdDx2b2lkPiA9IG5ldyBTdWJqZWN0KCk7XG4gIHByaXZhdGUgaXNDdXN0b21QbGFjZUhvbGRlcjogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIGlzQ3VzdG9tRm9ybWF0OiBib29sZWFuID0gZmFsc2U7XG4gIHByaXZhdGUgc2hvd1RpbWU6IFN1cHBvcnRUaW1lT3B0aW9ucyB8IGJvb2xlYW4gPSBmYWxzZTtcblxuICAvLyAtLS0gQ29tbW9uIEFQSVxuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpBbGxvd0NsZWFyOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0KCkgQElucHV0Qm9vbGVhbigpIG56QXV0b0ZvY3VzOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBuekRpc2FibGVkOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBuekJvcmRlcmxlc3M6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgQElucHV0Qm9vbGVhbigpIG56SW5wdXRSZWFkT25seTogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpJbmxpbmU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgQElucHV0Qm9vbGVhbigpIG56T3Blbj86IGJvb2xlYW47XG4gIEBJbnB1dCgpIG56RGlzYWJsZWREYXRlPzogKGQ6IERhdGUpID0+IGJvb2xlYW47XG4gIEBJbnB1dCgpIG56TG9jYWxlITogTnpEYXRlUGlja2VySTE4bkludGVyZmFjZTtcbiAgQElucHV0KCkgbnpQbGFjZUhvbGRlcjogc3RyaW5nIHwgc3RyaW5nW10gPSAnJztcbiAgQElucHV0KCkgbnpQb3B1cFN0eWxlOiBvYmplY3QgPSBQT1BVUF9TVFlMRV9QQVRDSDtcbiAgQElucHV0KCkgbnpEcm9wZG93bkNsYXNzTmFtZT86IHN0cmluZztcbiAgQElucHV0KCkgbnpTaXplOiBOekRhdGVQaWNrZXJTaXplVHlwZSA9ICdkZWZhdWx0JztcbiAgQElucHV0KCkgbnpGb3JtYXQhOiBzdHJpbmc7XG4gIEBJbnB1dCgpIG56RGF0ZVJlbmRlcj86IFRlbXBsYXRlUmVmPE56U2FmZUFueT4gfCBzdHJpbmcgfCBGdW5jdGlvblByb3A8VGVtcGxhdGVSZWY8RGF0ZT4gfCBzdHJpbmc+O1xuICBASW5wdXQoKSBuekRpc2FibGVkVGltZT86IERpc2FibGVkVGltZUZuO1xuICBASW5wdXQoKSBuelJlbmRlckV4dHJhRm9vdGVyPzogVGVtcGxhdGVSZWY8TnpTYWZlQW55PiB8IHN0cmluZyB8IEZ1bmN0aW9uUHJvcDxUZW1wbGF0ZVJlZjxOelNhZmVBbnk+IHwgc3RyaW5nPjtcbiAgQElucHV0KCkgQElucHV0Qm9vbGVhbigpIG56U2hvd1RvZGF5OiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0KCkgbnpNb2RlOiBOekRhdGVNb2RlID0gJ2RhdGUnO1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpTaG93Tm93OiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0KCkgbnpSYW5nZXM/OiBQcmVzZXRSYW5nZXM7XG4gIEBJbnB1dCgpIG56RGVmYXVsdFBpY2tlclZhbHVlOiBDb21wYXRpYmxlRGF0ZSB8IG51bGwgPSBudWxsO1xuICBASW5wdXQoKSBAV2l0aENvbmZpZygpIG56U2VwYXJhdG9yPzogc3RyaW5nID0gdW5kZWZpbmVkO1xuICBASW5wdXQoKSBAV2l0aENvbmZpZygpIG56U3VmZml4SWNvbjogc3RyaW5nIHwgVGVtcGxhdGVSZWY8TnpTYWZlQW55PiA9ICdjYWxlbmRhcic7XG4gIEBJbnB1dCgpIEBXaXRoQ29uZmlnKCkgbnpCYWNrZHJvcCA9IGZhbHNlO1xuICBASW5wdXQoKSBueklkOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICAvLyBUT0RPKEB3ZW5xaTczKSBUaGUgUGFuZWxNb2RlIG5lZWQgbmFtZWQgZm9yIGVhY2ggcGlja2VycyBhbmQgZXhwb3J0XG4gIEBPdXRwdXQoKSByZWFkb25seSBuek9uUGFuZWxDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPE56RGF0ZU1vZGUgfCBOekRhdGVNb2RlW10gfCBzdHJpbmcgfCBzdHJpbmdbXT4oKTtcbiAgQE91dHB1dCgpIHJlYWRvbmx5IG56T25DYWxlbmRhckNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8QXJyYXk8RGF0ZSB8IG51bGw+PigpO1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbnpPbk9rID0gbmV3IEV2ZW50RW1pdHRlcjxDb21wYXRpYmxlRGF0ZSB8IG51bGw+KCk7XG4gIEBPdXRwdXQoKSByZWFkb25seSBuek9uT3BlbkNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuICBASW5wdXQoKSBnZXQgbnpTaG93VGltZSgpOiBTdXBwb3J0VGltZU9wdGlvbnMgfCBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zaG93VGltZTtcbiAgfVxuXG4gIHNldCBuelNob3dUaW1lKHZhbHVlOiBTdXBwb3J0VGltZU9wdGlvbnMgfCBib29sZWFuKSB7XG4gICAgdGhpcy5zaG93VGltZSA9IHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgPyB2YWx1ZSA6IHRvQm9vbGVhbih2YWx1ZSk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gSW5wdXQgQVBJIFN0YXJ0XG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICBAVmlld0NoaWxkKENka0Nvbm5lY3RlZE92ZXJsYXksIHsgc3RhdGljOiBmYWxzZSB9KSBjZGtDb25uZWN0ZWRPdmVybGF5PzogQ2RrQ29ubmVjdGVkT3ZlcmxheTtcbiAgQFZpZXdDaGlsZChEYXRlUmFuZ2VQb3B1cENvbXBvbmVudCwgeyBzdGF0aWM6IGZhbHNlIH0pIHBhbmVsITogRGF0ZVJhbmdlUG9wdXBDb21wb25lbnQ7XG4gIEBWaWV3Q2hpbGQoJ3NlcGFyYXRvckVsZW1lbnQnLCB7IHN0YXRpYzogZmFsc2UgfSkgc2VwYXJhdG9yRWxlbWVudD86IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ3BpY2tlcklucHV0JywgeyBzdGF0aWM6IGZhbHNlIH0pIHBpY2tlcklucHV0PzogRWxlbWVudFJlZjxIVE1MSW5wdXRFbGVtZW50PjtcbiAgQFZpZXdDaGlsZHJlbigncmFuZ2VQaWNrZXJJbnB1dCcpIHJhbmdlUGlja2VySW5wdXRzPzogUXVlcnlMaXN0PEVsZW1lbnRSZWY8SFRNTElucHV0RWxlbWVudD4+O1xuXG4gIG9yaWdpbjogQ2RrT3ZlcmxheU9yaWdpbjtcbiAgZG9jdW1lbnQ6IERvY3VtZW50O1xuICBpbnB1dFNpemU6IG51bWJlciA9IDEyO1xuICBpbnB1dFdpZHRoPzogbnVtYmVyO1xuICBkZXN0cm95JCA9IG5ldyBTdWJqZWN0KCk7XG4gIHByZWZpeENscyA9IFBSRUZJWF9DTEFTUztcbiAgaW5wdXRWYWx1ZSE6IE56U2FmZUFueTtcbiAgYWN0aXZlQmFyU3R5bGU6IG9iamVjdCA9IHt9O1xuICBvdmVybGF5T3BlbjogYm9vbGVhbiA9IGZhbHNlOyAvLyBBdmFpbGFibGUgd2hlbiBcIm56T3BlblwiID0gdW5kZWZpbmVkXG4gIG92ZXJsYXlQb3NpdGlvbnM6IENvbm5lY3Rpb25Qb3NpdGlvblBhaXJbXSA9IFtcbiAgICB7XG4gICAgICBvZmZzZXRZOiAyLFxuICAgICAgb3JpZ2luWDogJ3N0YXJ0JyxcbiAgICAgIG9yaWdpblk6ICdib3R0b20nLFxuICAgICAgb3ZlcmxheVg6ICdzdGFydCcsXG4gICAgICBvdmVybGF5WTogJ3RvcCdcbiAgICB9LFxuICAgIHtcbiAgICAgIG9mZnNldFk6IC0yLFxuICAgICAgb3JpZ2luWDogJ3N0YXJ0JyxcbiAgICAgIG9yaWdpblk6ICd0b3AnLFxuICAgICAgb3ZlcmxheVg6ICdzdGFydCcsXG4gICAgICBvdmVybGF5WTogJ2JvdHRvbSdcbiAgICB9LFxuICAgIHtcbiAgICAgIG9mZnNldFk6IDIsXG4gICAgICBvcmlnaW5YOiAnZW5kJyxcbiAgICAgIG9yaWdpblk6ICdib3R0b20nLFxuICAgICAgb3ZlcmxheVg6ICdlbmQnLFxuICAgICAgb3ZlcmxheVk6ICd0b3AnXG4gICAgfSxcbiAgICB7XG4gICAgICBvZmZzZXRZOiAtMixcbiAgICAgIG9yaWdpblg6ICdlbmQnLFxuICAgICAgb3JpZ2luWTogJ3RvcCcsXG4gICAgICBvdmVybGF5WDogJ2VuZCcsXG4gICAgICBvdmVybGF5WTogJ2JvdHRvbSdcbiAgICB9XG4gIF0gYXMgQ29ubmVjdGlvblBvc2l0aW9uUGFpcltdO1xuICBjdXJyZW50UG9zaXRpb25YOiBIb3Jpem9udGFsQ29ubmVjdGlvblBvcyA9ICdzdGFydCc7XG4gIGN1cnJlbnRQb3NpdGlvblk6IFZlcnRpY2FsQ29ubmVjdGlvblBvcyA9ICdib3R0b20nO1xuXG4gIGdldCByZWFsT3BlblN0YXRlKCk6IGJvb2xlYW4ge1xuICAgIC8vIFRoZSB2YWx1ZSB0aGF0IHJlYWxseSBkZWNpZGUgdGhlIG9wZW4gc3RhdGUgb2Ygb3ZlcmxheVxuICAgIHJldHVybiB0aGlzLmlzT3BlbkhhbmRsZWRCeVVzZXIoKSA/ICEhdGhpcy5uek9wZW4gOiB0aGlzLm92ZXJsYXlPcGVuO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLm56QXV0b0ZvY3VzKSB7XG4gICAgICB0aGlzLmZvY3VzKCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaXNSYW5nZSAmJiB0aGlzLnBsYXRmb3JtLmlzQnJvd3Nlcikge1xuICAgICAgdGhpcy5uelJlc2l6ZU9ic2VydmVyXG4gICAgICAgIC5vYnNlcnZlKHRoaXMuZWxlbWVudFJlZilcbiAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKVxuICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICB0aGlzLnVwZGF0ZUlucHV0V2lkdGhBbmRBcnJvd0xlZnQoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdGhpcy5kYXRlUGlja2VyU2VydmljZS5pbnB1dFBhcnRDaGFuZ2UkLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKS5zdWJzY3JpYmUocGFydFR5cGUgPT4ge1xuICAgICAgaWYgKHBhcnRUeXBlKSB7XG4gICAgICAgIHRoaXMuZGF0ZVBpY2tlclNlcnZpY2UuYWN0aXZlSW5wdXQgPSBwYXJ0VHlwZTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZm9jdXMoKTtcbiAgICAgIHRoaXMudXBkYXRlSW5wdXRXaWR0aEFuZEFycm93TGVmdCgpO1xuICAgIH0pO1xuICB9XG5cbiAgdXBkYXRlSW5wdXRXaWR0aEFuZEFycm93TGVmdCgpOiB2b2lkIHtcbiAgICB0aGlzLmlucHV0V2lkdGggPSB0aGlzLnJhbmdlUGlja2VySW5wdXRzPy5maXJzdD8ubmF0aXZlRWxlbWVudC5vZmZzZXRXaWR0aCB8fCAwO1xuXG4gICAgY29uc3QgYmFzZVN0eWxlID0geyBwb3NpdGlvbjogJ2Fic29sdXRlJywgd2lkdGg6IGAke3RoaXMuaW5wdXRXaWR0aH1weGAgfTtcbiAgICB0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLmFycm93TGVmdCA9XG4gICAgICB0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLmFjdGl2ZUlucHV0ID09PSAnbGVmdCcgPyAwIDogdGhpcy5pbnB1dFdpZHRoICsgdGhpcy5zZXBhcmF0b3JFbGVtZW50Py5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoIHx8IDA7XG5cbiAgICBpZiAodGhpcy5kaXIgPT09ICdydGwnKSB7XG4gICAgICB0aGlzLmFjdGl2ZUJhclN0eWxlID0geyAuLi5iYXNlU3R5bGUsIHJpZ2h0OiBgJHt0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLmFycm93TGVmdH1weGAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5hY3RpdmVCYXJTdHlsZSA9IHsgLi4uYmFzZVN0eWxlLCBsZWZ0OiBgJHt0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLmFycm93TGVmdH1weGAgfTtcbiAgICB9XG5cbiAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIGdldElucHV0KHBhcnRUeXBlPzogUmFuZ2VQYXJ0VHlwZSk6IEhUTUxJbnB1dEVsZW1lbnQgfCB1bmRlZmluZWQge1xuICAgIGlmICh0aGlzLm56SW5saW5lKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5pc1JhbmdlXG4gICAgICA/IHBhcnRUeXBlID09PSAnbGVmdCdcbiAgICAgICAgPyB0aGlzLnJhbmdlUGlja2VySW5wdXRzPy5maXJzdC5uYXRpdmVFbGVtZW50XG4gICAgICAgIDogdGhpcy5yYW5nZVBpY2tlcklucHV0cz8ubGFzdC5uYXRpdmVFbGVtZW50XG4gICAgICA6IHRoaXMucGlja2VySW5wdXQhLm5hdGl2ZUVsZW1lbnQ7XG4gIH1cblxuICBmb2N1cygpOiB2b2lkIHtcbiAgICBjb25zdCBhY3RpdmVJbnB1dEVsZW1lbnQgPSB0aGlzLmdldElucHV0KHRoaXMuZGF0ZVBpY2tlclNlcnZpY2UuYWN0aXZlSW5wdXQpO1xuICAgIGlmICh0aGlzLmRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgIT09IGFjdGl2ZUlucHV0RWxlbWVudCkge1xuICAgICAgYWN0aXZlSW5wdXRFbGVtZW50Py5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIG9uRm9jdXMoZXZlbnQ6IEZvY3VzRXZlbnQsIHBhcnRUeXBlPzogUmFuZ2VQYXJ0VHlwZSk6IHZvaWQge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgaWYgKHBhcnRUeXBlKSB7XG4gICAgICB0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLmlucHV0UGFydENoYW5nZSQubmV4dChwYXJ0VHlwZSk7XG4gICAgfVxuICAgIHRoaXMucmVuZGVyQ2xhc3ModHJ1ZSk7XG4gIH1cblxuICAvLyBibHVyIGV2ZW50IGhhcyBub3QgdGhlIHJlbGF0ZWRUYXJnZXQgaW4gSUUxMSwgdXNlIGZvY3Vzb3V0IGluc3RlYWQuXG4gIG9uRm9jdXNvdXQoZXZlbnQ6IEZvY3VzRXZlbnQpOiB2b2lkIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlmICghdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoZXZlbnQucmVsYXRlZFRhcmdldCkpIHtcbiAgICAgIHRoaXMuY2hlY2tBbmRDbG9zZSgpO1xuICAgIH1cbiAgICB0aGlzLnJlbmRlckNsYXNzKGZhbHNlKTtcbiAgfVxuXG4gIC8vIFNob3cgb3ZlcmxheSBjb250ZW50XG4gIG9wZW4oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMubnpJbmxpbmUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKCF0aGlzLnJlYWxPcGVuU3RhdGUgJiYgIXRoaXMubnpEaXNhYmxlZCkge1xuICAgICAgdGhpcy51cGRhdGVJbnB1dFdpZHRoQW5kQXJyb3dMZWZ0KCk7XG4gICAgICB0aGlzLm92ZXJsYXlPcGVuID0gdHJ1ZTtcbiAgICAgIHRoaXMubnpPbk9wZW5DaGFuZ2UuZW1pdCh0cnVlKTtcbiAgICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIGNsb3NlKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLm56SW5saW5lKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh0aGlzLnJlYWxPcGVuU3RhdGUpIHtcbiAgICAgIHRoaXMub3ZlcmxheU9wZW4gPSBmYWxzZTtcbiAgICAgIHRoaXMubnpPbk9wZW5DaGFuZ2UuZW1pdChmYWxzZSk7XG4gICAgfVxuICB9XG5cbiAgc2hvd0NsZWFyKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhdGhpcy5uekRpc2FibGVkICYmICF0aGlzLmlzRW1wdHlWYWx1ZSh0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLnZhbHVlKSAmJiB0aGlzLm56QWxsb3dDbGVhcjtcbiAgfVxuXG4gIGNoZWNrQW5kQ2xvc2UoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnJlYWxPcGVuU3RhdGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5wYW5lbC5pc0FsbG93ZWQodGhpcy5kYXRlUGlja2VyU2VydmljZS52YWx1ZSEsIHRydWUpKSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLnZhbHVlKSAmJiB3cm9uZ1NvcnRPcmRlcih0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLnZhbHVlKSkge1xuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuZGF0ZVBpY2tlclNlcnZpY2UuZ2V0QWN0aXZlSW5kZXgoKTtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLnZhbHVlW2luZGV4XTtcbiAgICAgICAgdGhpcy5wYW5lbC5jaGFuZ2VWYWx1ZUZyb21TZWxlY3QodmFsdWUhLCB0cnVlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy51cGRhdGVJbnB1dFZhbHVlKCk7XG4gICAgICB0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLmVtaXRWYWx1ZSQubmV4dCgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLnNldFZhbHVlKHRoaXMuZGF0ZVBpY2tlclNlcnZpY2UuaW5pdGlhbFZhbHVlISk7XG4gICAgICB0aGlzLmNsb3NlKCk7XG4gICAgfVxuICB9XG5cbiAgb25DbGlja0lucHV0Qm94KGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgdGhpcy5mb2N1cygpO1xuICAgIGlmICghdGhpcy5pc09wZW5IYW5kbGVkQnlVc2VyKCkpIHtcbiAgICAgIHRoaXMub3BlbigpO1xuICAgIH1cbiAgfVxuXG4gIG9uT3ZlcmxheUtleWRvd24oZXZlbnQ6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gRVNDQVBFKSB7XG4gICAgICB0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLmluaXRWYWx1ZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8vIE5PVEU6IEEgaXNzdWUgaGVyZSwgdGhlIGZpcnN0IHRpbWUgcG9zaXRpb24gY2hhbmdlLCB0aGUgYW5pbWF0aW9uIHdpbGwgbm90IGJlIHRyaWdnZXJlZC5cbiAgLy8gQmVjYXVzZSB0aGUgb3ZlcmxheSdzIFwicG9zaXRpb25DaGFuZ2VcIiBldmVudCBpcyBlbWl0dGVkIGFmdGVyIHRoZSBjb250ZW50J3MgZnVsbCBzaG93biB1cC5cbiAgLy8gQWxsIG90aGVyIGNvbXBvbmVudHMgbGlrZSBcIm56LWRyb3Bkb3duXCIgd2hpY2ggZGVwZW5kcyBvbiBvdmVybGF5IGFsc28gaGFzIHRoZSBzYW1lIGlzc3VlLlxuICAvLyBTZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9ORy1aT1JSTy9uZy16b3Jyby1hbnRkL2lzc3Vlcy8xNDI5XG4gIG9uUG9zaXRpb25DaGFuZ2UocG9zaXRpb246IENvbm5lY3RlZE92ZXJsYXlQb3NpdGlvbkNoYW5nZSk6IHZvaWQge1xuICAgIHRoaXMuY3VycmVudFBvc2l0aW9uWCA9IHBvc2l0aW9uLmNvbm5lY3Rpb25QYWlyLm9yaWdpblg7XG4gICAgdGhpcy5jdXJyZW50UG9zaXRpb25ZID0gcG9zaXRpb24uY29ubmVjdGlvblBhaXIub3JpZ2luWTtcbiAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7IC8vIFRha2Ugc2lkZS1lZmZlY3RzIHRvIHBvc2l0aW9uIHN0eWxlc1xuICB9XG5cbiAgb25DbGlja0NsZWFyKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgIHRoaXMuZGF0ZVBpY2tlclNlcnZpY2UuaW5pdFZhbHVlKHRydWUpO1xuICAgIHRoaXMuZGF0ZVBpY2tlclNlcnZpY2UuZW1pdFZhbHVlJC5uZXh0KCk7XG4gIH1cblxuICB1cGRhdGVJbnB1dFZhbHVlKCk6IHZvaWQge1xuICAgIGNvbnN0IG5ld1ZhbHVlID0gdGhpcy5kYXRlUGlja2VyU2VydmljZS52YWx1ZTtcbiAgICBpZiAodGhpcy5pc1JhbmdlKSB7XG4gICAgICB0aGlzLmlucHV0VmFsdWUgPSBuZXdWYWx1ZSA/IChuZXdWYWx1ZSBhcyBDYW5keURhdGVbXSkubWFwKHYgPT4gdGhpcy5mb3JtYXRWYWx1ZSh2KSkgOiBbJycsICcnXTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5pbnB1dFZhbHVlID0gdGhpcy5mb3JtYXRWYWx1ZShuZXdWYWx1ZSBhcyBDYW5keURhdGUpO1xuICAgIH1cbiAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIGZvcm1hdFZhbHVlKHZhbHVlOiBDYW5keURhdGUpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmRhdGVIZWxwZXIuZm9ybWF0KHZhbHVlICYmICh2YWx1ZSBhcyBDYW5keURhdGUpLm5hdGl2ZURhdGUsIHRoaXMubnpGb3JtYXQpO1xuICB9XG5cbiAgb25JbnB1dENoYW5nZSh2YWx1ZTogc3RyaW5nLCBpc0VudGVyOiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcbiAgICAvKipcbiAgICAgKiBpbiBJRTExIGZvY3VzL2JsdXIgd2lsbCB0cmlnZ2VyIG5nTW9kZWxDaGFuZ2UgaWYgcGxhY2Vob2xkZXIgY2hhbmdlcyxcbiAgICAgKiBzbyB3ZSBmb3JiaWRkZW4gSUUxMSB0byBvcGVuIHBhbmVsIHRocm91Z2ggaW5wdXQgY2hhbmdlXG4gICAgICovXG4gICAgaWYgKFxuICAgICAgIXRoaXMucGxhdGZvcm0uVFJJREVOVCAmJlxuICAgICAgdGhpcy5kb2N1bWVudC5hY3RpdmVFbGVtZW50ID09PSB0aGlzLmdldElucHV0KHRoaXMuZGF0ZVBpY2tlclNlcnZpY2UuYWN0aXZlSW5wdXQpICYmXG4gICAgICAhdGhpcy5yZWFsT3BlblN0YXRlXG4gICAgKSB7XG4gICAgICB0aGlzLm9wZW4oKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBkYXRlID0gdGhpcy5jaGVja1ZhbGlkRGF0ZSh2YWx1ZSk7XG4gICAgLy8gQ2FuIG9ubHkgY2hhbmdlIGRhdGUgd2hlbiBpdCdzIG9wZW5cbiAgICBpZiAoZGF0ZSAmJiB0aGlzLnJlYWxPcGVuU3RhdGUpIHtcbiAgICAgIHRoaXMucGFuZWwuY2hhbmdlVmFsdWVGcm9tU2VsZWN0KGRhdGUsIGlzRW50ZXIpO1xuICAgIH1cbiAgfVxuXG4gIG9uS2V5dXBFbnRlcihldmVudDogRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLm9uSW5wdXRDaGFuZ2UoKGV2ZW50LnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZSwgdHJ1ZSk7XG4gIH1cblxuICBwcml2YXRlIGNoZWNrVmFsaWREYXRlKHZhbHVlOiBzdHJpbmcpOiBDYW5keURhdGUgfCBudWxsIHtcbiAgICBjb25zdCBkYXRlID0gbmV3IENhbmR5RGF0ZSh0aGlzLmRhdGVIZWxwZXIucGFyc2VEYXRlKHZhbHVlLCB0aGlzLm56Rm9ybWF0KSk7XG5cbiAgICBpZiAoIWRhdGUuaXNWYWxpZCgpIHx8IHZhbHVlICE9PSB0aGlzLmRhdGVIZWxwZXIuZm9ybWF0KGRhdGUubmF0aXZlRGF0ZSwgdGhpcy5uekZvcm1hdCkpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHJldHVybiBkYXRlO1xuICB9XG5cbiAgZ2V0UGxhY2Vob2xkZXIocGFydFR5cGU/OiBSYW5nZVBhcnRUeXBlKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5pc1JhbmdlID8gdGhpcy5uelBsYWNlSG9sZGVyW3RoaXMuZGF0ZVBpY2tlclNlcnZpY2UuZ2V0QWN0aXZlSW5kZXgocGFydFR5cGUhKV0gOiAodGhpcy5uelBsYWNlSG9sZGVyIGFzIHN0cmluZyk7XG4gIH1cblxuICBpc0VtcHR5VmFsdWUodmFsdWU6IENvbXBhdGlibGVWYWx1ZSk6IGJvb2xlYW4ge1xuICAgIGlmICh2YWx1ZSA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfSBlbHNlIGlmICh0aGlzLmlzUmFuZ2UpIHtcbiAgICAgIHJldHVybiAhdmFsdWUgfHwgIUFycmF5LmlzQXJyYXkodmFsdWUpIHx8IHZhbHVlLmV2ZXJ5KHZhbCA9PiAhdmFsKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuICF2YWx1ZTtcbiAgICB9XG4gIH1cblxuICAvLyBXaGV0aGVyIG9wZW4gc3RhdGUgaXMgcGVybWFuZW50bHkgY29udHJvbGxlZCBieSB1c2VyIGhpbXNlbGZcbiAgaXNPcGVuSGFuZGxlZEJ5VXNlcigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5uek9wZW4gIT09IHVuZGVmaW5lZDtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyBJbnB1dCBBUEkgRW5kXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBuekNvbmZpZ1NlcnZpY2U6IE56Q29uZmlnU2VydmljZSxcbiAgICBwdWJsaWMgZGF0ZVBpY2tlclNlcnZpY2U6IERhdGVQaWNrZXJTZXJ2aWNlLFxuICAgIHByb3RlY3RlZCBpMThuOiBOekkxOG5TZXJ2aWNlLFxuICAgIHByb3RlY3RlZCBjZHI6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBkYXRlSGVscGVyOiBEYXRlSGVscGVyU2VydmljZSxcbiAgICBwcml2YXRlIG56UmVzaXplT2JzZXJ2ZXI6IE56UmVzaXplT2JzZXJ2ZXIsXG4gICAgcHJpdmF0ZSBwbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgQEluamVjdChET0NVTUVOVCkgZG9jOiBOelNhZmVBbnksXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBkaXJlY3Rpb25hbGl0eTogRGlyZWN0aW9uYWxpdHksXG4gICAgQEhvc3QoKSBAT3B0aW9uYWwoKSBwdWJsaWMgbm9BbmltYXRpb24/OiBOek5vQW5pbWF0aW9uRGlyZWN0aXZlXG4gICkge1xuICAgIHRoaXMuZG9jdW1lbnQgPSBkb2M7XG4gICAgdGhpcy5vcmlnaW4gPSBuZXcgQ2RrT3ZlcmxheU9yaWdpbih0aGlzLmVsZW1lbnRSZWYpO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgLy8gU3Vic2NyaWJlIHRoZSBldmVyeSBsb2NhbGUgY2hhbmdlIGlmIHRoZSBuekxvY2FsZSBpcyBub3QgaGFuZGxlZCBieSB1c2VyXG4gICAgaWYgKCF0aGlzLm56TG9jYWxlKSB7XG4gICAgICB0aGlzLmkxOG4ubG9jYWxlQ2hhbmdlLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveWVkJCkpLnN1YnNjcmliZSgoKSA9PiB0aGlzLnNldExvY2FsZSgpKTtcbiAgICB9XG5cbiAgICAvLyBEZWZhdWx0IHZhbHVlXG4gICAgdGhpcy5kYXRlUGlja2VyU2VydmljZS5pc1JhbmdlID0gdGhpcy5pc1JhbmdlO1xuICAgIHRoaXMuZGF0ZVBpY2tlclNlcnZpY2UuaW5pdFZhbHVlKHRydWUpO1xuICAgIHRoaXMuZGF0ZVBpY2tlclNlcnZpY2UuZW1pdFZhbHVlJC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3llZCQpKS5zdWJzY3JpYmUoXyA9PiB7XG4gICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZGF0ZVBpY2tlclNlcnZpY2UudmFsdWU7XG4gICAgICB0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLmluaXRpYWxWYWx1ZSA9IGNsb25lRGF0ZSh2YWx1ZSk7XG4gICAgICBpZiAodGhpcy5pc1JhbmdlKSB7XG4gICAgICAgIGNvbnN0IHZBc1JhbmdlID0gdmFsdWUgYXMgQ2FuZHlEYXRlW107XG4gICAgICAgIGlmICh2QXNSYW5nZS5sZW5ndGgpIHtcbiAgICAgICAgICB0aGlzLm9uQ2hhbmdlRm4oW3ZBc1JhbmdlWzBdPy5uYXRpdmVEYXRlID8/IG51bGwsIHZBc1JhbmdlWzFdPy5uYXRpdmVEYXRlID8/IG51bGxdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLm9uQ2hhbmdlRm4oW10pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICB0aGlzLm9uQ2hhbmdlRm4oKHZhbHVlIGFzIENhbmR5RGF0ZSkubmF0aXZlRGF0ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5vbkNoYW5nZUZuKG51bGwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLm9uVG91Y2hlZEZuKCk7XG4gICAgICAvLyBXaGVuIHZhbHVlIGVtaXR0ZWQsIG92ZXJsYXkgd2lsbCBiZSBjbG9zZWRcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuZGlyZWN0aW9uYWxpdHkuY2hhbmdlPy5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3llZCQpKS5zdWJzY3JpYmUoKGRpcmVjdGlvbjogRGlyZWN0aW9uKSA9PiB7XG4gICAgICB0aGlzLmRpciA9IGRpcmVjdGlvbjtcbiAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICB9KTtcbiAgICB0aGlzLmRpciA9IHRoaXMuZGlyZWN0aW9uYWxpdHkudmFsdWU7XG4gICAgdGhpcy5pbnB1dFZhbHVlID0gdGhpcy5pc1JhbmdlID8gWycnLCAnJ10gOiAnJztcbiAgICB0aGlzLnNldE1vZGVBbmRGb3JtYXQoKTtcblxuICAgIHRoaXMuZGF0ZVBpY2tlclNlcnZpY2UudmFsdWVDaGFuZ2UkLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVJbnB1dFZhbHVlKCk7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKGNoYW5nZXMubnpQb3B1cFN0eWxlKSB7XG4gICAgICAvLyBBbHdheXMgYXNzaWduIHRoZSBwb3B1cCBzdHlsZSBwYXRjaFxuICAgICAgdGhpcy5uelBvcHVwU3R5bGUgPSB0aGlzLm56UG9wdXBTdHlsZSA/IHsgLi4udGhpcy5uelBvcHVwU3R5bGUsIC4uLlBPUFVQX1NUWUxFX1BBVENIIH0gOiBQT1BVUF9TVFlMRV9QQVRDSDtcbiAgICB9XG5cbiAgICAvLyBNYXJrIGFzIGN1c3RvbWl6ZWQgcGxhY2Vob2xkZXIgYnkgdXNlciBvbmNlIG56UGxhY2VIb2xkZXIgYXNzaWduZWQgYXQgdGhlIGZpcnN0IHRpbWVcbiAgICBpZiAoY2hhbmdlcy5uelBsYWNlSG9sZGVyPy5jdXJyZW50VmFsdWUpIHtcbiAgICAgIHRoaXMuaXNDdXN0b21QbGFjZUhvbGRlciA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZXMubnpGb3JtYXQ/LmN1cnJlbnRWYWx1ZSkge1xuICAgICAgdGhpcy5pc0N1c3RvbUZvcm1hdCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZXMubnpMb2NhbGUpIHtcbiAgICAgIC8vIFRoZSBuekxvY2FsZSBpcyBjdXJyZW50bHkgaGFuZGxlZCBieSB1c2VyXG4gICAgICB0aGlzLnNldERlZmF1bHRQbGFjZUhvbGRlcigpO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VzLm56UmVuZGVyRXh0cmFGb290ZXIpIHtcbiAgICAgIHRoaXMuZXh0cmFGb290ZXIgPSB2YWx1ZUZ1bmN0aW9uUHJvcCh0aGlzLm56UmVuZGVyRXh0cmFGb290ZXIhKTtcbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlcy5uek1vZGUpIHtcbiAgICAgIHRoaXMuc2V0RGVmYXVsdFBsYWNlSG9sZGVyKCk7XG4gICAgICB0aGlzLnNldE1vZGVBbmRGb3JtYXQoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmRlc3Ryb3llZCQubmV4dCgpO1xuICAgIHRoaXMuZGVzdHJveWVkJC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgc2V0TW9kZUFuZEZvcm1hdCgpOiB2b2lkIHtcbiAgICBjb25zdCBpbnB1dEZvcm1hdHM6IHsgW2tleSBpbiBOekRhdGVNb2RlXT86IHN0cmluZyB9ID0ge1xuICAgICAgeWVhcjogJ3l5eXknLFxuICAgICAgbW9udGg6ICd5eXl5LU1NJyxcbiAgICAgIHdlZWs6IHRoaXMuaTE4bi5nZXREYXRlTG9jYWxlKCkgPyAnUlJSUi1JSScgOiAneXl5eS13dycsIC8vIEZvcm1hdCBmb3Igd2Vla1xuICAgICAgZGF0ZTogdGhpcy5uelNob3dUaW1lID8gJ3l5eXktTU0tZGQgSEg6bW06c3MnIDogJ3l5eXktTU0tZGQnXG4gICAgfTtcblxuICAgIGlmICghdGhpcy5uek1vZGUpIHtcbiAgICAgIHRoaXMubnpNb2RlID0gJ2RhdGUnO1xuICAgIH1cblxuICAgIHRoaXMucGFuZWxNb2RlID0gdGhpcy5pc1JhbmdlID8gW3RoaXMubnpNb2RlLCB0aGlzLm56TW9kZV0gOiB0aGlzLm56TW9kZTtcblxuICAgIC8vIERlZmF1bHQgZm9ybWF0IHdoZW4gaXQncyBlbXB0eVxuICAgIGlmICghdGhpcy5pc0N1c3RvbUZvcm1hdCkge1xuICAgICAgdGhpcy5uekZvcm1hdCA9IGlucHV0Rm9ybWF0c1t0aGlzLm56TW9kZSBhcyBOekRhdGVNb2RlXSE7XG4gICAgfVxuXG4gICAgdGhpcy5pbnB1dFNpemUgPSBNYXRoLm1heCgxMCwgdGhpcy5uekZvcm1hdC5sZW5ndGgpICsgMjtcbiAgICB0aGlzLnVwZGF0ZUlucHV0VmFsdWUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmlnZ2VyZWQgd2hlbiBvdmVybGF5T3BlbiBjaGFuZ2VzIChkaWZmZXJlbnQgd2l0aCByZWFsT3BlblN0YXRlKVxuICAgKiBAcGFyYW0gb3BlbiBUaGUgb3ZlcmxheU9wZW4gaW4gcGlja2VyIGNvbXBvbmVudFxuICAgKi9cbiAgb25PcGVuQ2hhbmdlKG9wZW46IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLm56T25PcGVuQ2hhbmdlLmVtaXQob3Blbik7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gfCBDb250cm9sIHZhbHVlIGFjY2Vzc29yIGltcGxlbWVudHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gTk9URTogb25DaGFuZ2VGbi9vblRvdWNoZWRGbiB3aWxsIG5vdCBiZSBhc3NpZ25lZCBpZiB1c2VyIG5vdCB1c2UgYXMgbmdNb2RlbFxuICBvbkNoYW5nZUZuOiBPbkNoYW5nZVR5cGUgPSAoKSA9PiB2b2lkIDA7XG4gIG9uVG91Y2hlZEZuOiBPblRvdWNoZWRUeXBlID0gKCkgPT4gdm9pZCAwO1xuXG4gIHdyaXRlVmFsdWUodmFsdWU6IENvbXBhdGlibGVEYXRlKTogdm9pZCB7XG4gICAgdGhpcy5zZXRWYWx1ZSh2YWx1ZSk7XG4gICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBPbkNoYW5nZVR5cGUpOiB2b2lkIHtcbiAgICB0aGlzLm9uQ2hhbmdlRm4gPSBmbjtcbiAgfVxuXG4gIHJlZ2lzdGVyT25Ub3VjaGVkKGZuOiBPblRvdWNoZWRUeXBlKTogdm9pZCB7XG4gICAgdGhpcy5vblRvdWNoZWRGbiA9IGZuO1xuICB9XG5cbiAgc2V0RGlzYWJsZWRTdGF0ZShpc0Rpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5uekRpc2FibGVkID0gaXNEaXNhYmxlZDtcbiAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvLyB8IEludGVybmFsIG1ldGhvZHNcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbiAgLy8gUmVsb2FkIGxvY2FsZSBmcm9tIGkxOG4gd2l0aCBzaWRlIGVmZmVjdHNcbiAgcHJpdmF0ZSBzZXRMb2NhbGUoKTogdm9pZCB7XG4gICAgdGhpcy5uekxvY2FsZSA9IHRoaXMuaTE4bi5nZXRMb2NhbGVEYXRhKCdEYXRlUGlja2VyJywge30pO1xuICAgIHRoaXMuc2V0RGVmYXVsdFBsYWNlSG9sZGVyKCk7XG4gICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBwcml2YXRlIHNldERlZmF1bHRQbGFjZUhvbGRlcigpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaXNDdXN0b21QbGFjZUhvbGRlciAmJiB0aGlzLm56TG9jYWxlKSB7XG4gICAgICBjb25zdCBkZWZhdWx0UGxhY2Vob2xkZXI6IHsgW2tleSBpbiBOekRhdGVNb2RlXT86IHN0cmluZyB9ID0ge1xuICAgICAgICB5ZWFyOiB0aGlzLmdldFByb3BlcnR5T2ZMb2NhbGUoJ3llYXJQbGFjZWhvbGRlcicpLFxuICAgICAgICBtb250aDogdGhpcy5nZXRQcm9wZXJ0eU9mTG9jYWxlKCdtb250aFBsYWNlaG9sZGVyJyksXG4gICAgICAgIHdlZWs6IHRoaXMuZ2V0UHJvcGVydHlPZkxvY2FsZSgnd2Vla1BsYWNlaG9sZGVyJyksXG4gICAgICAgIGRhdGU6IHRoaXMuZ2V0UHJvcGVydHlPZkxvY2FsZSgncGxhY2Vob2xkZXInKVxuICAgICAgfTtcblxuICAgICAgY29uc3QgZGVmYXVsdFJhbmdlUGxhY2Vob2xkZXI6IHsgW2tleSBpbiBOekRhdGVNb2RlXT86IHN0cmluZ1tdIH0gPSB7XG4gICAgICAgIHllYXI6IHRoaXMuZ2V0UHJvcGVydHlPZkxvY2FsZSgncmFuZ2VZZWFyUGxhY2Vob2xkZXInKSxcbiAgICAgICAgbW9udGg6IHRoaXMuZ2V0UHJvcGVydHlPZkxvY2FsZSgncmFuZ2VNb250aFBsYWNlaG9sZGVyJyksXG4gICAgICAgIHdlZWs6IHRoaXMuZ2V0UHJvcGVydHlPZkxvY2FsZSgncmFuZ2VXZWVrUGxhY2Vob2xkZXInKSxcbiAgICAgICAgZGF0ZTogdGhpcy5nZXRQcm9wZXJ0eU9mTG9jYWxlKCdyYW5nZVBsYWNlaG9sZGVyJylcbiAgICAgIH07XG5cbiAgICAgIHRoaXMubnpQbGFjZUhvbGRlciA9IHRoaXMuaXNSYW5nZVxuICAgICAgICA/IGRlZmF1bHRSYW5nZVBsYWNlaG9sZGVyW3RoaXMubnpNb2RlIGFzIE56RGF0ZU1vZGVdIVxuICAgICAgICA6IGRlZmF1bHRQbGFjZWhvbGRlclt0aGlzLm56TW9kZSBhcyBOekRhdGVNb2RlXSE7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBnZXRQcm9wZXJ0eU9mTG9jYWxlPFQgZXh0ZW5kcyBrZXlvZiBOekRhdGVQaWNrZXJMYW5nSTE4bkludGVyZmFjZT4odHlwZTogVCk6IE56RGF0ZVBpY2tlckxhbmdJMThuSW50ZXJmYWNlW1RdIHtcbiAgICByZXR1cm4gdGhpcy5uekxvY2FsZS5sYW5nW3R5cGVdIHx8IHRoaXMuaTE4bi5nZXRMb2NhbGVEYXRhKGBEYXRlUGlja2VyLmxhbmcuJHt0eXBlfWApO1xuICB9XG5cbiAgLy8gU2FmZSB3YXkgb2Ygc2V0dGluZyB2YWx1ZSB3aXRoIGRlZmF1bHRcbiAgcHJpdmF0ZSBzZXRWYWx1ZSh2YWx1ZTogQ29tcGF0aWJsZURhdGUpOiB2b2lkIHtcbiAgICBjb25zdCBuZXdWYWx1ZTogQ29tcGF0aWJsZVZhbHVlID0gdGhpcy5kYXRlUGlja2VyU2VydmljZS5tYWtlVmFsdWUodmFsdWUpO1xuICAgIHRoaXMuZGF0ZVBpY2tlclNlcnZpY2Uuc2V0VmFsdWUobmV3VmFsdWUpO1xuICAgIHRoaXMuZGF0ZVBpY2tlclNlcnZpY2UuaW5pdGlhbFZhbHVlID0gbmV3VmFsdWU7XG4gIH1cblxuICByZW5kZXJDbGFzcyh2YWx1ZTogYm9vbGVhbik6IHZvaWQge1xuICAgIC8vIFRPRE86IGF2b2lkIGF1dG9Gb2N1cyBjYXVzZSBjaGFuZ2UgYWZ0ZXIgY2hlY2tlZCBlcnJvclxuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2FudC1waWNrZXItZm9jdXNlZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnYW50LXBpY2tlci1mb2N1c2VkJyk7XG4gICAgfVxuICB9XG5cbiAgb25QYW5lbE1vZGVDaGFuZ2UocGFuZWxNb2RlOiBOekRhdGVNb2RlIHwgTnpEYXRlTW9kZVtdKTogdm9pZCB7XG4gICAgdGhpcy5uek9uUGFuZWxDaGFuZ2UuZW1pdChwYW5lbE1vZGUpO1xuICB9XG5cbiAgLy8gRW1pdCBuek9uQ2FsZW5kYXJDaGFuZ2Ugd2hlbiBzZWxlY3QgZGF0ZSBieSBuei1yYW5nZS1waWNrZXJcbiAgb25DYWxlbmRhckNoYW5nZSh2YWx1ZTogQ29tcGF0aWJsZVZhbHVlKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNSYW5nZSAmJiBBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgY29uc3QgcmFuZ2VWYWx1ZSA9IHZhbHVlLmZpbHRlcih4ID0+IHggaW5zdGFuY2VvZiBDYW5keURhdGUpLm1hcCh4ID0+IHghLm5hdGl2ZURhdGUpO1xuICAgICAgdGhpcy5uek9uQ2FsZW5kYXJDaGFuZ2UuZW1pdChyYW5nZVZhbHVlKTtcbiAgICB9XG4gIH1cblxuICBvblJlc3VsdE9rKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzUmFuZ2UpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gdGhpcy5kYXRlUGlja2VyU2VydmljZS52YWx1ZSBhcyBDYW5keURhdGVbXTtcbiAgICAgIGlmICh2YWx1ZS5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5uek9uT2suZW1pdChbdmFsdWVbMF0/Lm5hdGl2ZURhdGUgfHwgbnVsbCwgdmFsdWVbMV0/Lm5hdGl2ZURhdGUgfHwgbnVsbF0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5uek9uT2suZW1pdChbXSk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLnZhbHVlKSB7XG4gICAgICAgIHRoaXMubnpPbk9rLmVtaXQoKHRoaXMuZGF0ZVBpY2tlclNlcnZpY2UudmFsdWUgYXMgQ2FuZHlEYXRlKS5uYXRpdmVEYXRlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubnpPbk9rLmVtaXQobnVsbCk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXX0=