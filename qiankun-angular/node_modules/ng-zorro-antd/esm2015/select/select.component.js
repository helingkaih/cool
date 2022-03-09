/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { __decorate, __metadata } from "tslib";
import { FocusMonitor } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { DOWN_ARROW, ENTER, ESCAPE, SPACE, TAB, UP_ARROW } from '@angular/cdk/keycodes';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { Platform } from '@angular/cdk/platform';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, ElementRef, EventEmitter, forwardRef, Host, Input, Optional, Output, QueryList, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { slideMotion } from 'ng-zorro-antd/core/animation';
import { NzConfigService, WithConfig } from 'ng-zorro-antd/core/config';
import { NzNoAnimationDirective } from 'ng-zorro-antd/core/no-animation';
import { reqAnimFrame } from 'ng-zorro-antd/core/polyfill';
import { InputBoolean, isNotNil } from 'ng-zorro-antd/core/util';
import { BehaviorSubject, combineLatest, merge, Subject } from 'rxjs';
import { startWith, switchMap, takeUntil } from 'rxjs/operators';
import { NzOptionGroupComponent } from './option-group.component';
import { NzOptionComponent } from './option.component';
import { NzSelectTopControlComponent } from './select-top-control.component';
const defaultFilterOption = (searchValue, item) => {
    if (item && item.nzLabel) {
        return item.nzLabel.toString().toLowerCase().indexOf(searchValue.toLowerCase()) > -1;
    }
    else {
        return false;
    }
};
const ɵ0 = defaultFilterOption;
const NZ_CONFIG_MODULE_NAME = 'select';
export class NzSelectComponent {
    constructor(nzConfigService, cdr, elementRef, platform, focusMonitor, directionality, noAnimation) {
        this.nzConfigService = nzConfigService;
        this.cdr = cdr;
        this.elementRef = elementRef;
        this.platform = platform;
        this.focusMonitor = focusMonitor;
        this.directionality = directionality;
        this.noAnimation = noAnimation;
        this._nzModuleName = NZ_CONFIG_MODULE_NAME;
        this.nzId = null;
        this.nzSize = 'default';
        this.nzOptionHeightPx = 32;
        this.nzOptionOverflowSize = 8;
        this.nzDropdownClassName = null;
        this.nzDropdownMatchSelectWidth = true;
        this.nzDropdownStyle = null;
        this.nzNotFoundContent = undefined;
        this.nzPlaceHolder = null;
        this.nzMaxTagCount = Infinity;
        this.nzDropdownRender = null;
        this.nzCustomTemplate = null;
        this.nzSuffixIcon = null;
        this.nzClearIcon = null;
        this.nzRemoveIcon = null;
        this.nzMenuItemSelectedIcon = null;
        this.nzTokenSeparators = [];
        this.nzMaxTagPlaceholder = null;
        this.nzMaxMultipleCount = Infinity;
        this.nzMode = 'default';
        this.nzFilterOption = defaultFilterOption;
        this.compareWith = (o1, o2) => o1 === o2;
        this.nzAllowClear = false;
        this.nzBorderless = false;
        this.nzShowSearch = false;
        this.nzLoading = false;
        this.nzAutoFocus = false;
        this.nzAutoClearSearchValue = true;
        this.nzServerSearch = false;
        this.nzDisabled = false;
        this.nzOpen = false;
        this.nzBackdrop = false;
        this.nzOptions = [];
        this.nzOnSearch = new EventEmitter();
        this.nzScrollToBottom = new EventEmitter();
        this.nzOpenChange = new EventEmitter();
        this.nzBlur = new EventEmitter();
        this.nzFocus = new EventEmitter();
        this.listOfValue$ = new BehaviorSubject([]);
        this.listOfTemplateItem$ = new BehaviorSubject([]);
        this.listOfTagAndTemplateItem = [];
        this.searchValue = '';
        this.isReactiveDriven = false;
        this.destroy$ = new Subject();
        this.onChange = () => { };
        this.onTouched = () => { };
        this.dropDownPosition = 'bottom';
        this.triggerWidth = null;
        this.listOfContainerItem = [];
        this.listOfTopItem = [];
        this.activatedValue = null;
        this.listOfValue = [];
        this.focused = false;
        this.dir = 'ltr';
        // TODO: move to host after View Engine deprecation
        this.elementRef.nativeElement.classList.add('ant-select');
    }
    set nzShowArrow(value) {
        this._nzShowArrow = value;
    }
    get nzShowArrow() {
        return this._nzShowArrow === undefined ? this.nzMode === 'default' : this._nzShowArrow;
    }
    generateTagItem(value) {
        return {
            nzValue: value,
            nzLabel: value,
            type: 'item'
        };
    }
    onItemClick(value) {
        this.activatedValue = value;
        if (this.nzMode === 'default') {
            if (this.listOfValue.length === 0 || !this.compareWith(this.listOfValue[0], value)) {
                this.updateListOfValue([value]);
            }
            this.setOpenState(false);
        }
        else {
            const targetIndex = this.listOfValue.findIndex(o => this.compareWith(o, value));
            if (targetIndex !== -1) {
                const listOfValueAfterRemoved = this.listOfValue.filter((_, i) => i !== targetIndex);
                this.updateListOfValue(listOfValueAfterRemoved);
            }
            else if (this.listOfValue.length < this.nzMaxMultipleCount) {
                const listOfValueAfterAdded = [...this.listOfValue, value];
                this.updateListOfValue(listOfValueAfterAdded);
            }
            this.focus();
            if (this.nzAutoClearSearchValue) {
                this.clearInput();
            }
        }
    }
    onItemDelete(item) {
        const listOfSelectedValue = this.listOfValue.filter(v => !this.compareWith(v, item.nzValue));
        this.updateListOfValue(listOfSelectedValue);
        this.clearInput();
    }
    onHostClick() {
        if ((this.nzOpen && this.nzShowSearch) || this.nzDisabled) {
            return;
        }
        this.setOpenState(!this.nzOpen);
    }
    updateListOfContainerItem() {
        let listOfContainerItem = this.listOfTagAndTemplateItem
            .filter(item => !item.nzHide)
            .filter(item => {
            if (!this.nzServerSearch && this.searchValue) {
                return this.nzFilterOption(this.searchValue, item);
            }
            else {
                return true;
            }
        });
        if (this.nzMode === 'tags' && this.searchValue) {
            const matchedItem = this.listOfTagAndTemplateItem.find(item => item.nzLabel === this.searchValue);
            if (!matchedItem) {
                const tagItem = this.generateTagItem(this.searchValue);
                listOfContainerItem = [tagItem, ...listOfContainerItem];
                this.activatedValue = tagItem.nzValue;
            }
            else {
                this.activatedValue = matchedItem.nzValue;
            }
        }
        const activatedItem = listOfContainerItem.find(item => this.compareWith(item.nzValue, this.listOfValue[0])) || listOfContainerItem[0];
        this.activatedValue = (activatedItem && activatedItem.nzValue) || null;
        let listOfGroupLabel = [];
        if (this.isReactiveDriven) {
            listOfGroupLabel = [...new Set(this.nzOptions.filter(o => o.groupLabel).map(o => o.groupLabel))];
        }
        else {
            if (this.listOfNzOptionGroupComponent) {
                listOfGroupLabel = this.listOfNzOptionGroupComponent.map(o => o.nzLabel);
            }
        }
        /** insert group item **/
        listOfGroupLabel.forEach(label => {
            const index = listOfContainerItem.findIndex(item => label === item.groupLabel);
            if (index > -1) {
                const groupItem = { groupLabel: label, type: 'group', key: label };
                listOfContainerItem.splice(index, 0, groupItem);
            }
        });
        this.listOfContainerItem = [...listOfContainerItem];
        this.updateCdkConnectedOverlayPositions();
    }
    clearInput() {
        this.nzSelectTopControlComponent.clearInputValue();
    }
    updateListOfValue(listOfValue) {
        const covertListToModel = (list, mode) => {
            if (mode === 'default') {
                if (list.length > 0) {
                    return list[0];
                }
                else {
                    return null;
                }
            }
            else {
                return list;
            }
        };
        const model = covertListToModel(listOfValue, this.nzMode);
        if (this.value !== model) {
            this.listOfValue = listOfValue;
            this.listOfValue$.next(listOfValue);
            this.value = model;
            this.onChange(this.value);
        }
    }
    onTokenSeparate(listOfLabel) {
        const listOfMatchedValue = this.listOfTagAndTemplateItem
            .filter(item => listOfLabel.findIndex(label => label === item.nzLabel) !== -1)
            .map(item => item.nzValue)
            .filter(item => this.listOfValue.findIndex(v => this.compareWith(v, item)) === -1);
        if (this.nzMode === 'multiple') {
            this.updateListOfValue([...this.listOfValue, ...listOfMatchedValue]);
        }
        else if (this.nzMode === 'tags') {
            const listOfUnMatchedLabel = listOfLabel.filter(label => this.listOfTagAndTemplateItem.findIndex(item => item.nzLabel === label) === -1);
            this.updateListOfValue([...this.listOfValue, ...listOfMatchedValue, ...listOfUnMatchedLabel]);
        }
        this.clearInput();
    }
    onOverlayKeyDown(e) {
        if (e.keyCode === ESCAPE) {
            this.setOpenState(false);
        }
    }
    onKeyDown(e) {
        if (this.nzDisabled) {
            return;
        }
        const listOfFilteredOptionNotDisabled = this.listOfContainerItem.filter(item => item.type === 'item').filter(item => !item.nzDisabled);
        const activatedIndex = listOfFilteredOptionNotDisabled.findIndex(item => this.compareWith(item.nzValue, this.activatedValue));
        switch (e.keyCode) {
            case UP_ARROW:
                e.preventDefault();
                if (this.nzOpen) {
                    const preIndex = activatedIndex > 0 ? activatedIndex - 1 : listOfFilteredOptionNotDisabled.length - 1;
                    this.activatedValue = listOfFilteredOptionNotDisabled[preIndex].nzValue;
                }
                break;
            case DOWN_ARROW:
                e.preventDefault();
                if (this.nzOpen) {
                    const nextIndex = activatedIndex < listOfFilteredOptionNotDisabled.length - 1 ? activatedIndex + 1 : 0;
                    this.activatedValue = listOfFilteredOptionNotDisabled[nextIndex].nzValue;
                }
                else {
                    this.setOpenState(true);
                }
                break;
            case ENTER:
                e.preventDefault();
                if (this.nzOpen) {
                    if (isNotNil(this.activatedValue)) {
                        this.onItemClick(this.activatedValue);
                    }
                }
                else {
                    this.setOpenState(true);
                }
                break;
            case SPACE:
                if (!this.nzOpen) {
                    this.setOpenState(true);
                    e.preventDefault();
                }
                break;
            case TAB:
                this.setOpenState(false);
                break;
            case ESCAPE:
                /**
                 * Skip the ESCAPE processing, it will be handled in {@link onOverlayKeyDown}.
                 */
                break;
            default:
                if (!this.nzOpen) {
                    this.setOpenState(true);
                }
        }
    }
    setOpenState(value) {
        if (this.nzOpen !== value) {
            this.nzOpen = value;
            this.nzOpenChange.emit(value);
            this.onOpenChange();
            this.cdr.markForCheck();
        }
    }
    onOpenChange() {
        this.updateCdkConnectedOverlayStatus();
        this.clearInput();
    }
    onInputValueChange(value) {
        this.searchValue = value;
        this.updateListOfContainerItem();
        this.nzOnSearch.emit(value);
        this.updateCdkConnectedOverlayPositions();
    }
    onClearSelection() {
        this.updateListOfValue([]);
    }
    onClickOutside(event) {
        if (!this.elementRef.nativeElement.contains(event.target)) {
            this.setOpenState(false);
        }
    }
    focus() {
        this.nzSelectTopControlComponent.focus();
    }
    blur() {
        this.nzSelectTopControlComponent.blur();
    }
    onPositionChange(position) {
        this.dropDownPosition = position.connectionPair.originY;
    }
    updateCdkConnectedOverlayStatus() {
        if (this.platform.isBrowser && this.originElement.nativeElement) {
            reqAnimFrame(() => {
                this.triggerWidth = this.originElement.nativeElement.getBoundingClientRect().width;
                this.cdr.markForCheck();
            });
        }
    }
    updateCdkConnectedOverlayPositions() {
        reqAnimFrame(() => {
            var _a, _b;
            (_b = (_a = this.cdkConnectedOverlay) === null || _a === void 0 ? void 0 : _a.overlayRef) === null || _b === void 0 ? void 0 : _b.updatePosition();
        });
    }
    writeValue(modelValue) {
        /** https://github.com/angular/angular/issues/14988 **/
        if (this.value !== modelValue) {
            this.value = modelValue;
            const covertModelToList = (model, mode) => {
                if (model === null || model === undefined) {
                    return [];
                }
                else if (mode === 'default') {
                    return [model];
                }
                else {
                    return model;
                }
            };
            const listOfValue = covertModelToList(modelValue, this.nzMode);
            this.listOfValue = listOfValue;
            this.listOfValue$.next(listOfValue);
            this.cdr.markForCheck();
        }
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    setDisabledState(disabled) {
        this.nzDisabled = disabled;
        if (disabled) {
            this.setOpenState(false);
        }
        this.cdr.markForCheck();
    }
    ngOnChanges(changes) {
        const { nzOpen, nzDisabled, nzOptions } = changes;
        if (nzOpen) {
            this.onOpenChange();
        }
        if (nzDisabled && this.nzDisabled) {
            this.setOpenState(false);
        }
        if (nzOptions) {
            this.isReactiveDriven = true;
            const listOfOptions = this.nzOptions || [];
            const listOfTransformedItem = listOfOptions.map(item => {
                return {
                    template: item.label instanceof TemplateRef ? item.label : null,
                    nzLabel: typeof item.label === 'string' || typeof item.label === 'number' ? item.label : null,
                    nzValue: item.value,
                    nzDisabled: item.disabled || false,
                    nzHide: item.hide || false,
                    nzCustomContent: item.label instanceof TemplateRef,
                    groupLabel: item.groupLabel || null,
                    type: 'item',
                    key: item.value
                };
            });
            this.listOfTemplateItem$.next(listOfTransformedItem);
        }
    }
    ngOnInit() {
        var _a;
        this.focusMonitor
            .monitor(this.elementRef, true)
            .pipe(takeUntil(this.destroy$))
            .subscribe(focusOrigin => {
            if (!focusOrigin) {
                this.focused = false;
                this.cdr.markForCheck();
                this.nzBlur.emit();
                Promise.resolve().then(() => {
                    this.onTouched();
                });
            }
            else {
                this.focused = true;
                this.cdr.markForCheck();
                this.nzFocus.emit();
            }
        });
        combineLatest([this.listOfValue$, this.listOfTemplateItem$])
            .pipe(takeUntil(this.destroy$))
            .subscribe(([listOfSelectedValue, listOfTemplateItem]) => {
            const listOfTagItem = listOfSelectedValue
                .filter(() => this.nzMode === 'tags')
                .filter(value => listOfTemplateItem.findIndex(o => this.compareWith(o.nzValue, value)) === -1)
                .map(value => this.listOfTopItem.find(o => this.compareWith(o.nzValue, value)) || this.generateTagItem(value));
            this.listOfTagAndTemplateItem = [...listOfTemplateItem, ...listOfTagItem];
            this.listOfTopItem = this.listOfValue
                .map(v => [...this.listOfTagAndTemplateItem, ...this.listOfTopItem].find(item => this.compareWith(v, item.nzValue)))
                .filter(item => !!item);
            this.updateListOfContainerItem();
        });
        (_a = this.directionality.change) === null || _a === void 0 ? void 0 : _a.pipe(takeUntil(this.destroy$)).subscribe((direction) => {
            this.dir = direction;
            this.cdr.detectChanges();
        });
        this.nzConfigService
            .getConfigChangeEventForComponent('select')
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
            this.cdr.markForCheck();
        });
        this.dir = this.directionality.value;
    }
    ngAfterContentInit() {
        if (!this.isReactiveDriven) {
            merge(this.listOfNzOptionGroupComponent.changes, this.listOfNzOptionComponent.changes)
                .pipe(startWith(true), switchMap(() => merge(...[
                this.listOfNzOptionComponent.changes,
                this.listOfNzOptionGroupComponent.changes,
                ...this.listOfNzOptionComponent.map(option => option.changes),
                ...this.listOfNzOptionGroupComponent.map(option => option.changes)
            ]).pipe(startWith(true))), takeUntil(this.destroy$))
                .subscribe(() => {
                const listOfOptionInterface = this.listOfNzOptionComponent.toArray().map(item => {
                    const { template, nzLabel, nzValue, nzDisabled, nzHide, nzCustomContent, groupLabel } = item;
                    return { template, nzLabel, nzValue, nzDisabled, nzHide, nzCustomContent, groupLabel, type: 'item', key: nzValue };
                });
                this.listOfTemplateItem$.next(listOfOptionInterface);
                this.cdr.markForCheck();
            });
        }
    }
    ngOnDestroy() {
        this.focusMonitor.stopMonitoring(this.elementRef);
        this.destroy$.next();
        this.destroy$.complete();
    }
}
NzSelectComponent.decorators = [
    { type: Component, args: [{
                selector: 'nz-select',
                exportAs: 'nzSelect',
                preserveWhitespaces: false,
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => NzSelectComponent),
                        multi: true
                    }
                ],
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                animations: [slideMotion],
                template: `
    <nz-select-top-control
      cdkOverlayOrigin
      #origin="cdkOverlayOrigin"
      [nzId]="nzId"
      [open]="nzOpen"
      [disabled]="nzDisabled"
      [mode]="nzMode"
      [@.disabled]="noAnimation?.nzNoAnimation"
      [nzNoAnimation]="noAnimation?.nzNoAnimation"
      [maxTagPlaceholder]="nzMaxTagPlaceholder"
      [removeIcon]="nzRemoveIcon"
      [placeHolder]="nzPlaceHolder"
      [maxTagCount]="nzMaxTagCount"
      [customTemplate]="nzCustomTemplate"
      [tokenSeparators]="nzTokenSeparators"
      [showSearch]="nzShowSearch"
      [autofocus]="nzAutoFocus"
      [listOfTopItem]="listOfTopItem"
      (inputValueChange)="onInputValueChange($event)"
      (tokenize)="onTokenSeparate($event)"
      (deleteItem)="onItemDelete($event)"
      (keydown)="onKeyDown($event)"
    ></nz-select-top-control>
    <nz-select-arrow
      *ngIf="nzShowArrow"
      [loading]="nzLoading"
      [search]="nzOpen && nzShowSearch"
      [suffixIcon]="nzSuffixIcon"
    ></nz-select-arrow>
    <nz-select-clear
      *ngIf="nzAllowClear && !nzDisabled && listOfValue.length"
      [clearIcon]="nzClearIcon"
      (clear)="onClearSelection()"
    ></nz-select-clear>
    <ng-template
      cdkConnectedOverlay
      nzConnectedOverlay
      [cdkConnectedOverlayHasBackdrop]="nzBackdrop"
      [cdkConnectedOverlayMinWidth]="$any(nzDropdownMatchSelectWidth ? null : triggerWidth)"
      [cdkConnectedOverlayWidth]="$any(nzDropdownMatchSelectWidth ? triggerWidth : null)"
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayTransformOriginOn]="'.ant-select-dropdown'"
      [cdkConnectedOverlayPanelClass]="nzDropdownClassName!"
      [cdkConnectedOverlayOpen]="nzOpen"
      (overlayKeydown)="onOverlayKeyDown($event)"
      (overlayOutsideClick)="onClickOutside($event)"
      (detach)="setOpenState(false)"
      (positionChange)="onPositionChange($event)"
    >
      <nz-option-container
        [ngStyle]="nzDropdownStyle"
        [itemSize]="nzOptionHeightPx"
        [maxItemLength]="nzOptionOverflowSize"
        [matchWidth]="nzDropdownMatchSelectWidth"
        [class.ant-select-dropdown-placement-bottomLeft]="dropDownPosition === 'bottom'"
        [class.ant-select-dropdown-placement-topLeft]="dropDownPosition === 'top'"
        [@slideMotion]="'enter'"
        [@.disabled]="noAnimation?.nzNoAnimation"
        [nzNoAnimation]="noAnimation?.nzNoAnimation"
        [listOfContainerItem]="listOfContainerItem"
        [menuItemSelectedIcon]="nzMenuItemSelectedIcon"
        [notFoundContent]="nzNotFoundContent"
        [activatedValue]="activatedValue"
        [listOfSelectedValue]="listOfValue"
        [dropdownRender]="nzDropdownRender"
        [compareWith]="compareWith"
        [mode]="nzMode"
        (keydown)="onKeyDown($event)"
        (itemClick)="onItemClick($event)"
        (scrollToBottom)="nzScrollToBottom.emit()"
      ></nz-option-container>
    </ng-template>
  `,
                host: {
                    '[class.ant-select-lg]': 'nzSize === "large"',
                    '[class.ant-select-sm]': 'nzSize === "small"',
                    '[class.ant-select-show-arrow]': `nzShowArrow`,
                    '[class.ant-select-disabled]': 'nzDisabled',
                    '[class.ant-select-show-search]': `(nzShowSearch || nzMode !== 'default') && !nzDisabled`,
                    '[class.ant-select-allow-clear]': 'nzAllowClear',
                    '[class.ant-select-borderless]': 'nzBorderless',
                    '[class.ant-select-open]': 'nzOpen',
                    '[class.ant-select-focused]': 'nzOpen || focused',
                    '[class.ant-select-single]': `nzMode === 'default'`,
                    '[class.ant-select-multiple]': `nzMode !== 'default'`,
                    '[class.ant-select-rtl]': `dir === 'rtl'`,
                    '(click)': 'onHostClick()'
                }
            },] }
];
NzSelectComponent.ctorParameters = () => [
    { type: NzConfigService },
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: Platform },
    { type: FocusMonitor },
    { type: Directionality, decorators: [{ type: Optional }] },
    { type: NzNoAnimationDirective, decorators: [{ type: Host }, { type: Optional }] }
];
NzSelectComponent.propDecorators = {
    nzId: [{ type: Input }],
    nzSize: [{ type: Input }],
    nzOptionHeightPx: [{ type: Input }],
    nzOptionOverflowSize: [{ type: Input }],
    nzDropdownClassName: [{ type: Input }],
    nzDropdownMatchSelectWidth: [{ type: Input }],
    nzDropdownStyle: [{ type: Input }],
    nzNotFoundContent: [{ type: Input }],
    nzPlaceHolder: [{ type: Input }],
    nzMaxTagCount: [{ type: Input }],
    nzDropdownRender: [{ type: Input }],
    nzCustomTemplate: [{ type: Input }],
    nzSuffixIcon: [{ type: Input }],
    nzClearIcon: [{ type: Input }],
    nzRemoveIcon: [{ type: Input }],
    nzMenuItemSelectedIcon: [{ type: Input }],
    nzTokenSeparators: [{ type: Input }],
    nzMaxTagPlaceholder: [{ type: Input }],
    nzMaxMultipleCount: [{ type: Input }],
    nzMode: [{ type: Input }],
    nzFilterOption: [{ type: Input }],
    compareWith: [{ type: Input }],
    nzAllowClear: [{ type: Input }],
    nzBorderless: [{ type: Input }],
    nzShowSearch: [{ type: Input }],
    nzLoading: [{ type: Input }],
    nzAutoFocus: [{ type: Input }],
    nzAutoClearSearchValue: [{ type: Input }],
    nzServerSearch: [{ type: Input }],
    nzDisabled: [{ type: Input }],
    nzOpen: [{ type: Input }],
    nzBackdrop: [{ type: Input }],
    nzOptions: [{ type: Input }],
    nzShowArrow: [{ type: Input }],
    nzOnSearch: [{ type: Output }],
    nzScrollToBottom: [{ type: Output }],
    nzOpenChange: [{ type: Output }],
    nzBlur: [{ type: Output }],
    nzFocus: [{ type: Output }],
    originElement: [{ type: ViewChild, args: [CdkOverlayOrigin, { static: true, read: ElementRef },] }],
    cdkConnectedOverlay: [{ type: ViewChild, args: [CdkConnectedOverlay, { static: true },] }],
    nzSelectTopControlComponent: [{ type: ViewChild, args: [NzSelectTopControlComponent, { static: true },] }],
    listOfNzOptionComponent: [{ type: ContentChildren, args: [NzOptionComponent, { descendants: true },] }],
    listOfNzOptionGroupComponent: [{ type: ContentChildren, args: [NzOptionGroupComponent, { descendants: true },] }],
    nzOptionGroupComponentElement: [{ type: ViewChild, args: [NzOptionGroupComponent, { static: true, read: ElementRef },] }],
    nzSelectTopControlComponentElement: [{ type: ViewChild, args: [NzSelectTopControlComponent, { static: true, read: ElementRef },] }]
};
__decorate([
    WithConfig(),
    __metadata("design:type", Object)
], NzSelectComponent.prototype, "nzSuffixIcon", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzSelectComponent.prototype, "nzAllowClear", void 0);
__decorate([
    WithConfig(),
    InputBoolean(),
    __metadata("design:type", Object)
], NzSelectComponent.prototype, "nzBorderless", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzSelectComponent.prototype, "nzShowSearch", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzSelectComponent.prototype, "nzLoading", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzSelectComponent.prototype, "nzAutoFocus", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzSelectComponent.prototype, "nzAutoClearSearchValue", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzSelectComponent.prototype, "nzServerSearch", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzSelectComponent.prototype, "nzDisabled", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzSelectComponent.prototype, "nzOpen", void 0);
__decorate([
    WithConfig(),
    InputBoolean(),
    __metadata("design:type", Object)
], NzSelectComponent.prototype, "nzBackdrop", void 0);
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2NvbXBvbmVudHMvc2VsZWN0L3NlbGVjdC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHOztBQUVILE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQWEsY0FBYyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDOUQsT0FBTyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsUUFBUSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDeEYsT0FBTyxFQUFFLG1CQUFtQixFQUFFLGdCQUFnQixFQUFrQyxNQUFNLHNCQUFzQixDQUFDO0FBQzdHLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNqRCxPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsZUFBZSxFQUNmLFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxFQUNWLElBQUksRUFDSixLQUFLLEVBSUwsUUFBUSxFQUNSLE1BQU0sRUFDTixTQUFTLEVBRVQsV0FBVyxFQUNYLFNBQVMsRUFDVCxpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUF3QixpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3pFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUMzRCxPQUFPLEVBQWUsZUFBZSxFQUFFLFVBQVUsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3JGLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ3pFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUUzRCxPQUFPLEVBQUUsWUFBWSxFQUFFLFFBQVEsRUFBRSxNQUFNLHlCQUF5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QWYsWUFBWSxFQUFFOztxREFBb0I7QUFDbkI7SUFBZixZQUFZLEVBQUU7O2lEQUFnQjtBQUNRO0lBQXRDLFVBQVUsRUFBVztJQUFFLFlBQVksRUFBRTs7cURBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2dpdGh1Yi5jb20vTkctWk9SUk8vbmctem9ycm8tYW50ZC9ibG9iL21hc3Rlci9MSUNFTlNFXG4gKi9cblxuaW1wb3J0IHsgRm9jdXNNb25pdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHsgRGlyZWN0aW9uLCBEaXJlY3Rpb25hbGl0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7IERPV05fQVJST1csIEVOVEVSLCBFU0NBUEUsIFNQQUNFLCBUQUIsIFVQX0FSUk9XIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7IENka0Nvbm5lY3RlZE92ZXJsYXksIENka092ZXJsYXlPcmlnaW4sIENvbm5lY3RlZE92ZXJsYXlQb3NpdGlvbkNoYW5nZSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7IFBsYXRmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgZm9yd2FyZFJlZixcbiAgSG9zdCxcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IHNsaWRlTW90aW9uIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL2FuaW1hdGlvbic7XG5pbXBvcnQgeyBOekNvbmZpZ0tleSwgTnpDb25maWdTZXJ2aWNlLCBXaXRoQ29uZmlnIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL2NvbmZpZyc7XG5pbXBvcnQgeyBOek5vQW5pbWF0aW9uRGlyZWN0aXZlIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL25vLWFuaW1hdGlvbic7XG5pbXBvcnQgeyByZXFBbmltRnJhbWUgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvcG9seWZpbGwnO1xuaW1wb3J0IHsgQm9vbGVhbklucHV0LCBOelNhZmVBbnksIE9uQ2hhbmdlVHlwZSwgT25Ub3VjaGVkVHlwZSB9IGZyb20gJ25nLXpvcnJvLWFudGQvY29yZS90eXBlcyc7XG5pbXBvcnQgeyBJbnB1dEJvb2xlYW4sIGlzTm90TmlsIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL3V0aWwnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBjb21iaW5lTGF0ZXN0LCBtZXJnZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgc3RhcnRXaXRoLCBzd2l0Y2hNYXAsIHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IE56T3B0aW9uR3JvdXBDb21wb25lbnQgfSBmcm9tICcuL29wdGlvbi1ncm91cC5jb21wb25lbnQnO1xuaW1wb3J0IHsgTnpPcHRpb25Db21wb25lbnQgfSBmcm9tICcuL29wdGlvbi5jb21wb25lbnQnO1xuaW1wb3J0IHsgTnpTZWxlY3RUb3BDb250cm9sQ29tcG9uZW50IH0gZnJvbSAnLi9zZWxlY3QtdG9wLWNvbnRyb2wuY29tcG9uZW50JztcbmltcG9ydCB7IE56RmlsdGVyT3B0aW9uVHlwZSwgTnpTZWxlY3RJdGVtSW50ZXJmYWNlLCBOelNlbGVjdE1vZGVUeXBlLCBOelNlbGVjdE9wdGlvbkludGVyZmFjZSB9IGZyb20gJy4vc2VsZWN0LnR5cGVzJztcblxuY29uc3QgZGVmYXVsdEZpbHRlck9wdGlvbjogTnpGaWx0ZXJPcHRpb25UeXBlID0gKHNlYXJjaFZhbHVlOiBzdHJpbmcsIGl0ZW06IE56U2VsZWN0SXRlbUludGVyZmFjZSk6IGJvb2xlYW4gPT4ge1xuICBpZiAoaXRlbSAmJiBpdGVtLm56TGFiZWwpIHtcbiAgICByZXR1cm4gaXRlbS5uekxhYmVsLnRvU3RyaW5nKCkudG9Mb3dlckNhc2UoKS5pbmRleE9mKHNlYXJjaFZhbHVlLnRvTG93ZXJDYXNlKCkpID4gLTE7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59O1xuXG5jb25zdCBOWl9DT05GSUdfTU9EVUxFX05BTUU6IE56Q29uZmlnS2V5ID0gJ3NlbGVjdCc7XG5cbmV4cG9ydCB0eXBlIE56U2VsZWN0U2l6ZVR5cGUgPSAnbGFyZ2UnIHwgJ2RlZmF1bHQnIHwgJ3NtYWxsJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbnotc2VsZWN0JyxcbiAgZXhwb3J0QXM6ICduelNlbGVjdCcsXG4gIHByZXNlcnZlV2hpdGVzcGFjZXM6IGZhbHNlLFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE56U2VsZWN0Q29tcG9uZW50KSxcbiAgICAgIG11bHRpOiB0cnVlXG4gICAgfVxuICBdLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgYW5pbWF0aW9uczogW3NsaWRlTW90aW9uXSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bnotc2VsZWN0LXRvcC1jb250cm9sXG4gICAgICBjZGtPdmVybGF5T3JpZ2luXG4gICAgICAjb3JpZ2luPVwiY2RrT3ZlcmxheU9yaWdpblwiXG4gICAgICBbbnpJZF09XCJueklkXCJcbiAgICAgIFtvcGVuXT1cIm56T3BlblwiXG4gICAgICBbZGlzYWJsZWRdPVwibnpEaXNhYmxlZFwiXG4gICAgICBbbW9kZV09XCJuek1vZGVcIlxuICAgICAgW0AuZGlzYWJsZWRdPVwibm9BbmltYXRpb24/Lm56Tm9BbmltYXRpb25cIlxuICAgICAgW256Tm9BbmltYXRpb25dPVwibm9BbmltYXRpb24/Lm56Tm9BbmltYXRpb25cIlxuICAgICAgW21heFRhZ1BsYWNlaG9sZGVyXT1cIm56TWF4VGFnUGxhY2Vob2xkZXJcIlxuICAgICAgW3JlbW92ZUljb25dPVwibnpSZW1vdmVJY29uXCJcbiAgICAgIFtwbGFjZUhvbGRlcl09XCJuelBsYWNlSG9sZGVyXCJcbiAgICAgIFttYXhUYWdDb3VudF09XCJuek1heFRhZ0NvdW50XCJcbiAgICAgIFtjdXN0b21UZW1wbGF0ZV09XCJuekN1c3RvbVRlbXBsYXRlXCJcbiAgICAgIFt0b2tlblNlcGFyYXRvcnNdPVwibnpUb2tlblNlcGFyYXRvcnNcIlxuICAgICAgW3Nob3dTZWFyY2hdPVwibnpTaG93U2VhcmNoXCJcbiAgICAgIFthdXRvZm9jdXNdPVwibnpBdXRvRm9jdXNcIlxuICAgICAgW2xpc3RPZlRvcEl0ZW1dPVwibGlzdE9mVG9wSXRlbVwiXG4gICAgICAoaW5wdXRWYWx1ZUNoYW5nZSk9XCJvbklucHV0VmFsdWVDaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAodG9rZW5pemUpPVwib25Ub2tlblNlcGFyYXRlKCRldmVudClcIlxuICAgICAgKGRlbGV0ZUl0ZW0pPVwib25JdGVtRGVsZXRlKCRldmVudClcIlxuICAgICAgKGtleWRvd24pPVwib25LZXlEb3duKCRldmVudClcIlxuICAgID48L256LXNlbGVjdC10b3AtY29udHJvbD5cbiAgICA8bnotc2VsZWN0LWFycm93XG4gICAgICAqbmdJZj1cIm56U2hvd0Fycm93XCJcbiAgICAgIFtsb2FkaW5nXT1cIm56TG9hZGluZ1wiXG4gICAgICBbc2VhcmNoXT1cIm56T3BlbiAmJiBuelNob3dTZWFyY2hcIlxuICAgICAgW3N1ZmZpeEljb25dPVwibnpTdWZmaXhJY29uXCJcbiAgICA+PC9uei1zZWxlY3QtYXJyb3c+XG4gICAgPG56LXNlbGVjdC1jbGVhclxuICAgICAgKm5nSWY9XCJuekFsbG93Q2xlYXIgJiYgIW56RGlzYWJsZWQgJiYgbGlzdE9mVmFsdWUubGVuZ3RoXCJcbiAgICAgIFtjbGVhckljb25dPVwibnpDbGVhckljb25cIlxuICAgICAgKGNsZWFyKT1cIm9uQ2xlYXJTZWxlY3Rpb24oKVwiXG4gICAgPjwvbnotc2VsZWN0LWNsZWFyPlxuICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgY2RrQ29ubmVjdGVkT3ZlcmxheVxuICAgICAgbnpDb25uZWN0ZWRPdmVybGF5XG4gICAgICBbY2RrQ29ubmVjdGVkT3ZlcmxheUhhc0JhY2tkcm9wXT1cIm56QmFja2Ryb3BcIlxuICAgICAgW2Nka0Nvbm5lY3RlZE92ZXJsYXlNaW5XaWR0aF09XCIkYW55KG56RHJvcGRvd25NYXRjaFNlbGVjdFdpZHRoID8gbnVsbCA6IHRyaWdnZXJXaWR0aClcIlxuICAgICAgW2Nka0Nvbm5lY3RlZE92ZXJsYXlXaWR0aF09XCIkYW55KG56RHJvcGRvd25NYXRjaFNlbGVjdFdpZHRoID8gdHJpZ2dlcldpZHRoIDogbnVsbClcIlxuICAgICAgW2Nka0Nvbm5lY3RlZE92ZXJsYXlPcmlnaW5dPVwib3JpZ2luXCJcbiAgICAgIFtjZGtDb25uZWN0ZWRPdmVybGF5VHJhbnNmb3JtT3JpZ2luT25dPVwiJy5hbnQtc2VsZWN0LWRyb3Bkb3duJ1wiXG4gICAgICBbY2RrQ29ubmVjdGVkT3ZlcmxheVBhbmVsQ2xhc3NdPVwibnpEcm9wZG93bkNsYXNzTmFtZSFcIlxuICAgICAgW2Nka0Nvbm5lY3RlZE92ZXJsYXlPcGVuXT1cIm56T3BlblwiXG4gICAgICAob3ZlcmxheUtleWRvd24pPVwib25PdmVybGF5S2V5RG93bigkZXZlbnQpXCJcbiAgICAgIChvdmVybGF5T3V0c2lkZUNsaWNrKT1cIm9uQ2xpY2tPdXRzaWRlKCRldmVudClcIlxuICAgICAgKGRldGFjaCk9XCJzZXRPcGVuU3RhdGUoZmFsc2UpXCJcbiAgICAgIChwb3NpdGlvbkNoYW5nZSk9XCJvblBvc2l0aW9uQ2hhbmdlKCRldmVudClcIlxuICAgID5cbiAgICAgIDxuei1vcHRpb24tY29udGFpbmVyXG4gICAgICAgIFtuZ1N0eWxlXT1cIm56RHJvcGRvd25TdHlsZVwiXG4gICAgICAgIFtpdGVtU2l6ZV09XCJuek9wdGlvbkhlaWdodFB4XCJcbiAgICAgICAgW21heEl0ZW1MZW5ndGhdPVwibnpPcHRpb25PdmVyZmxvd1NpemVcIlxuICAgICAgICBbbWF0Y2hXaWR0aF09XCJuekRyb3Bkb3duTWF0Y2hTZWxlY3RXaWR0aFwiXG4gICAgICAgIFtjbGFzcy5hbnQtc2VsZWN0LWRyb3Bkb3duLXBsYWNlbWVudC1ib3R0b21MZWZ0XT1cImRyb3BEb3duUG9zaXRpb24gPT09ICdib3R0b20nXCJcbiAgICAgICAgW2NsYXNzLmFudC1zZWxlY3QtZHJvcGRvd24tcGxhY2VtZW50LXRvcExlZnRdPVwiZHJvcERvd25Qb3NpdGlvbiA9PT0gJ3RvcCdcIlxuICAgICAgICBbQHNsaWRlTW90aW9uXT1cIidlbnRlcidcIlxuICAgICAgICBbQC5kaXNhYmxlZF09XCJub0FuaW1hdGlvbj8ubnpOb0FuaW1hdGlvblwiXG4gICAgICAgIFtuek5vQW5pbWF0aW9uXT1cIm5vQW5pbWF0aW9uPy5uek5vQW5pbWF0aW9uXCJcbiAgICAgICAgW2xpc3RPZkNvbnRhaW5lckl0ZW1dPVwibGlzdE9mQ29udGFpbmVySXRlbVwiXG4gICAgICAgIFttZW51SXRlbVNlbGVjdGVkSWNvbl09XCJuek1lbnVJdGVtU2VsZWN0ZWRJY29uXCJcbiAgICAgICAgW25vdEZvdW5kQ29udGVudF09XCJuek5vdEZvdW5kQ29udGVudFwiXG4gICAgICAgIFthY3RpdmF0ZWRWYWx1ZV09XCJhY3RpdmF0ZWRWYWx1ZVwiXG4gICAgICAgIFtsaXN0T2ZTZWxlY3RlZFZhbHVlXT1cImxpc3RPZlZhbHVlXCJcbiAgICAgICAgW2Ryb3Bkb3duUmVuZGVyXT1cIm56RHJvcGRvd25SZW5kZXJcIlxuICAgICAgICBbY29tcGFyZVdpdGhdPVwiY29tcGFyZVdpdGhcIlxuICAgICAgICBbbW9kZV09XCJuek1vZGVcIlxuICAgICAgICAoa2V5ZG93bik9XCJvbktleURvd24oJGV2ZW50KVwiXG4gICAgICAgIChpdGVtQ2xpY2spPVwib25JdGVtQ2xpY2soJGV2ZW50KVwiXG4gICAgICAgIChzY3JvbGxUb0JvdHRvbSk9XCJuelNjcm9sbFRvQm90dG9tLmVtaXQoKVwiXG4gICAgICA+PC9uei1vcHRpb24tY29udGFpbmVyPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gIGAsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLmFudC1zZWxlY3QtbGddJzogJ256U2l6ZSA9PT0gXCJsYXJnZVwiJyxcbiAgICAnW2NsYXNzLmFudC1zZWxlY3Qtc21dJzogJ256U2l6ZSA9PT0gXCJzbWFsbFwiJyxcbiAgICAnW2NsYXNzLmFudC1zZWxlY3Qtc2hvdy1hcnJvd10nOiBgbnpTaG93QXJyb3dgLFxuICAgICdbY2xhc3MuYW50LXNlbGVjdC1kaXNhYmxlZF0nOiAnbnpEaXNhYmxlZCcsXG4gICAgJ1tjbGFzcy5hbnQtc2VsZWN0LXNob3ctc2VhcmNoXSc6IGAobnpTaG93U2VhcmNoIHx8IG56TW9kZSAhPT0gJ2RlZmF1bHQnKSAmJiAhbnpEaXNhYmxlZGAsXG4gICAgJ1tjbGFzcy5hbnQtc2VsZWN0LWFsbG93LWNsZWFyXSc6ICduekFsbG93Q2xlYXInLFxuICAgICdbY2xhc3MuYW50LXNlbGVjdC1ib3JkZXJsZXNzXSc6ICduekJvcmRlcmxlc3MnLFxuICAgICdbY2xhc3MuYW50LXNlbGVjdC1vcGVuXSc6ICduek9wZW4nLFxuICAgICdbY2xhc3MuYW50LXNlbGVjdC1mb2N1c2VkXSc6ICduek9wZW4gfHwgZm9jdXNlZCcsXG4gICAgJ1tjbGFzcy5hbnQtc2VsZWN0LXNpbmdsZV0nOiBgbnpNb2RlID09PSAnZGVmYXVsdCdgLFxuICAgICdbY2xhc3MuYW50LXNlbGVjdC1tdWx0aXBsZV0nOiBgbnpNb2RlICE9PSAnZGVmYXVsdCdgLFxuICAgICdbY2xhc3MuYW50LXNlbGVjdC1ydGxdJzogYGRpciA9PT0gJ3J0bCdgLFxuICAgICcoY2xpY2spJzogJ29uSG9zdENsaWNrKCknXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTnpTZWxlY3RDb21wb25lbnQgaW1wbGVtZW50cyBDb250cm9sVmFsdWVBY2Nlc3NvciwgT25Jbml0LCBPbkRlc3Ryb3ksIEFmdGVyQ29udGVudEluaXQsIE9uQ2hhbmdlcyB7XG4gIHJlYWRvbmx5IF9uek1vZHVsZU5hbWU6IE56Q29uZmlnS2V5ID0gTlpfQ09ORklHX01PRFVMRV9OQU1FO1xuXG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uekFsbG93Q2xlYXI6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX256Qm9yZGVybGVzczogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpTaG93U2VhcmNoOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uekxvYWRpbmc6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX256QXV0b0ZvY3VzOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uekF1dG9DbGVhclNlYXJjaFZhbHVlOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uelNlcnZlclNlYXJjaDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpEaXNhYmxlZDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpPcGVuOiBCb29sZWFuSW5wdXQ7XG5cbiAgQElucHV0KCkgbnpJZDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIEBJbnB1dCgpIG56U2l6ZTogTnpTZWxlY3RTaXplVHlwZSA9ICdkZWZhdWx0JztcbiAgQElucHV0KCkgbnpPcHRpb25IZWlnaHRQeCA9IDMyO1xuICBASW5wdXQoKSBuek9wdGlvbk92ZXJmbG93U2l6ZSA9IDg7XG4gIEBJbnB1dCgpIG56RHJvcGRvd25DbGFzc05hbWU6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBASW5wdXQoKSBuekRyb3Bkb3duTWF0Y2hTZWxlY3RXaWR0aCA9IHRydWU7XG4gIEBJbnB1dCgpIG56RHJvcGRvd25TdHlsZTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSB8IG51bGwgPSBudWxsO1xuICBASW5wdXQoKSBuek5vdEZvdW5kQ29udGVudDogc3RyaW5nIHwgVGVtcGxhdGVSZWY8TnpTYWZlQW55PiB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgbnpQbGFjZUhvbGRlcjogc3RyaW5nIHwgVGVtcGxhdGVSZWY8TnpTYWZlQW55PiB8IG51bGwgPSBudWxsO1xuICBASW5wdXQoKSBuek1heFRhZ0NvdW50ID0gSW5maW5pdHk7XG4gIEBJbnB1dCgpIG56RHJvcGRvd25SZW5kZXI6IFRlbXBsYXRlUmVmPE56U2FmZUFueT4gfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgbnpDdXN0b21UZW1wbGF0ZTogVGVtcGxhdGVSZWY8eyAkaW1wbGljaXQ6IE56U2VsZWN0SXRlbUludGVyZmFjZSB9PiB8IG51bGwgPSBudWxsO1xuICBASW5wdXQoKVxuICBAV2l0aENvbmZpZzxUZW1wbGF0ZVJlZjxOelNhZmVBbnk+IHwgc3RyaW5nIHwgbnVsbD4oKVxuICBuelN1ZmZpeEljb246IFRlbXBsYXRlUmVmPE56U2FmZUFueT4gfCBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgbnpDbGVhckljb246IFRlbXBsYXRlUmVmPE56U2FmZUFueT4gfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgbnpSZW1vdmVJY29uOiBUZW1wbGF0ZVJlZjxOelNhZmVBbnk+IHwgbnVsbCA9IG51bGw7XG4gIEBJbnB1dCgpIG56TWVudUl0ZW1TZWxlY3RlZEljb246IFRlbXBsYXRlUmVmPE56U2FmZUFueT4gfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgbnpUb2tlblNlcGFyYXRvcnM6IHN0cmluZ1tdID0gW107XG4gIEBJbnB1dCgpIG56TWF4VGFnUGxhY2Vob2xkZXI6IFRlbXBsYXRlUmVmPHsgJGltcGxpY2l0OiBOelNhZmVBbnlbXSB9PiB8IG51bGwgPSBudWxsO1xuICBASW5wdXQoKSBuek1heE11bHRpcGxlQ291bnQgPSBJbmZpbml0eTtcbiAgQElucHV0KCkgbnpNb2RlOiBOelNlbGVjdE1vZGVUeXBlID0gJ2RlZmF1bHQnO1xuICBASW5wdXQoKSBuekZpbHRlck9wdGlvbjogTnpGaWx0ZXJPcHRpb25UeXBlID0gZGVmYXVsdEZpbHRlck9wdGlvbjtcbiAgQElucHV0KCkgY29tcGFyZVdpdGg6IChvMTogTnpTYWZlQW55LCBvMjogTnpTYWZlQW55KSA9PiBib29sZWFuID0gKG8xOiBOelNhZmVBbnksIG8yOiBOelNhZmVBbnkpID0+IG8xID09PSBvMjtcbiAgQElucHV0KCkgQElucHV0Qm9vbGVhbigpIG56QWxsb3dDbGVhciA9IGZhbHNlO1xuICBASW5wdXQoKSBAV2l0aENvbmZpZzxib29sZWFuPigpIEBJbnB1dEJvb2xlYW4oKSBuekJvcmRlcmxlc3MgPSBmYWxzZTtcbiAgQElucHV0KCkgQElucHV0Qm9vbGVhbigpIG56U2hvd1NlYXJjaCA9IGZhbHNlO1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpMb2FkaW5nID0gZmFsc2U7XG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBuekF1dG9Gb2N1cyA9IGZhbHNlO1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpBdXRvQ2xlYXJTZWFyY2hWYWx1ZSA9IHRydWU7XG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBuelNlcnZlclNlYXJjaCA9IGZhbHNlO1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpEaXNhYmxlZCA9IGZhbHNlO1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpPcGVuID0gZmFsc2U7XG4gIEBJbnB1dCgpIEBXaXRoQ29uZmlnPGJvb2xlYW4+KCkgQElucHV0Qm9vbGVhbigpIG56QmFja2Ryb3AgPSBmYWxzZTtcbiAgQElucHV0KCkgbnpPcHRpb25zOiBOelNlbGVjdE9wdGlvbkludGVyZmFjZVtdID0gW107XG5cbiAgQElucHV0KClcbiAgc2V0IG56U2hvd0Fycm93KHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5fbnpTaG93QXJyb3cgPSB2YWx1ZTtcbiAgfVxuICBnZXQgbnpTaG93QXJyb3coKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX256U2hvd0Fycm93ID09PSB1bmRlZmluZWQgPyB0aGlzLm56TW9kZSA9PT0gJ2RlZmF1bHQnIDogdGhpcy5fbnpTaG93QXJyb3c7XG4gIH1cblxuICBAT3V0cHV0KCkgcmVhZG9ubHkgbnpPblNlYXJjaCA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbnpTY3JvbGxUb0JvdHRvbSA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcbiAgQE91dHB1dCgpIHJlYWRvbmx5IG56T3BlbkNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcbiAgQE91dHB1dCgpIHJlYWRvbmx5IG56Qmx1ciA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcbiAgQE91dHB1dCgpIHJlYWRvbmx5IG56Rm9jdXMgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG4gIEBWaWV3Q2hpbGQoQ2RrT3ZlcmxheU9yaWdpbiwgeyBzdGF0aWM6IHRydWUsIHJlYWQ6IEVsZW1lbnRSZWYgfSkgb3JpZ2luRWxlbWVudCE6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoQ2RrQ29ubmVjdGVkT3ZlcmxheSwgeyBzdGF0aWM6IHRydWUgfSkgY2RrQ29ubmVjdGVkT3ZlcmxheSE6IENka0Nvbm5lY3RlZE92ZXJsYXk7XG4gIEBWaWV3Q2hpbGQoTnpTZWxlY3RUb3BDb250cm9sQ29tcG9uZW50LCB7IHN0YXRpYzogdHJ1ZSB9KSBuelNlbGVjdFRvcENvbnRyb2xDb21wb25lbnQhOiBOelNlbGVjdFRvcENvbnRyb2xDb21wb25lbnQ7XG4gIEBDb250ZW50Q2hpbGRyZW4oTnpPcHRpb25Db21wb25lbnQsIHsgZGVzY2VuZGFudHM6IHRydWUgfSkgbGlzdE9mTnpPcHRpb25Db21wb25lbnQhOiBRdWVyeUxpc3Q8TnpPcHRpb25Db21wb25lbnQ+O1xuICBAQ29udGVudENoaWxkcmVuKE56T3B0aW9uR3JvdXBDb21wb25lbnQsIHsgZGVzY2VuZGFudHM6IHRydWUgfSkgbGlzdE9mTnpPcHRpb25Hcm91cENvbXBvbmVudCE6IFF1ZXJ5TGlzdDxOek9wdGlvbkdyb3VwQ29tcG9uZW50PjtcbiAgQFZpZXdDaGlsZChOek9wdGlvbkdyb3VwQ29tcG9uZW50LCB7IHN0YXRpYzogdHJ1ZSwgcmVhZDogRWxlbWVudFJlZiB9KSBuek9wdGlvbkdyb3VwQ29tcG9uZW50RWxlbWVudCE6IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoTnpTZWxlY3RUb3BDb250cm9sQ29tcG9uZW50LCB7IHN0YXRpYzogdHJ1ZSwgcmVhZDogRWxlbWVudFJlZiB9KSBuelNlbGVjdFRvcENvbnRyb2xDb21wb25lbnRFbGVtZW50ITogRWxlbWVudFJlZjtcbiAgcHJpdmF0ZSBsaXN0T2ZWYWx1ZSQgPSBuZXcgQmVoYXZpb3JTdWJqZWN0PE56U2FmZUFueVtdPihbXSk7XG4gIHByaXZhdGUgbGlzdE9mVGVtcGxhdGVJdGVtJCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8TnpTZWxlY3RJdGVtSW50ZXJmYWNlW10+KFtdKTtcbiAgcHJpdmF0ZSBsaXN0T2ZUYWdBbmRUZW1wbGF0ZUl0ZW06IE56U2VsZWN0SXRlbUludGVyZmFjZVtdID0gW107XG4gIHByaXZhdGUgc2VhcmNoVmFsdWU6IHN0cmluZyA9ICcnO1xuICBwcml2YXRlIGlzUmVhY3RpdmVEcml2ZW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSB2YWx1ZTogTnpTYWZlQW55IHwgTnpTYWZlQW55W107XG4gIHByaXZhdGUgZGVzdHJveSQgPSBuZXcgU3ViamVjdCgpO1xuICBwcml2YXRlIF9uelNob3dBcnJvdzogYm9vbGVhbiB8IHVuZGVmaW5lZDtcbiAgb25DaGFuZ2U6IE9uQ2hhbmdlVHlwZSA9ICgpID0+IHt9O1xuICBvblRvdWNoZWQ6IE9uVG91Y2hlZFR5cGUgPSAoKSA9PiB7fTtcbiAgZHJvcERvd25Qb3NpdGlvbjogJ3RvcCcgfCAnY2VudGVyJyB8ICdib3R0b20nID0gJ2JvdHRvbSc7XG4gIHRyaWdnZXJXaWR0aDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG4gIGxpc3RPZkNvbnRhaW5lckl0ZW06IE56U2VsZWN0SXRlbUludGVyZmFjZVtdID0gW107XG4gIGxpc3RPZlRvcEl0ZW06IE56U2VsZWN0SXRlbUludGVyZmFjZVtdID0gW107XG4gIGFjdGl2YXRlZFZhbHVlOiBOelNhZmVBbnkgfCBudWxsID0gbnVsbDtcbiAgbGlzdE9mVmFsdWU6IE56U2FmZUFueVtdID0gW107XG4gIGZvY3VzZWQgPSBmYWxzZTtcbiAgZGlyOiBEaXJlY3Rpb24gPSAnbHRyJztcblxuICBnZW5lcmF0ZVRhZ0l0ZW0odmFsdWU6IHN0cmluZyk6IE56U2VsZWN0SXRlbUludGVyZmFjZSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIG56VmFsdWU6IHZhbHVlLFxuICAgICAgbnpMYWJlbDogdmFsdWUsXG4gICAgICB0eXBlOiAnaXRlbSdcbiAgICB9O1xuICB9XG5cbiAgb25JdGVtQ2xpY2sodmFsdWU6IE56U2FmZUFueSk6IHZvaWQge1xuICAgIHRoaXMuYWN0aXZhdGVkVmFsdWUgPSB2YWx1ZTtcbiAgICBpZiAodGhpcy5uek1vZGUgPT09ICdkZWZhdWx0Jykge1xuICAgICAgaWYgKHRoaXMubGlzdE9mVmFsdWUubGVuZ3RoID09PSAwIHx8ICF0aGlzLmNvbXBhcmVXaXRoKHRoaXMubGlzdE9mVmFsdWVbMF0sIHZhbHVlKSkge1xuICAgICAgICB0aGlzLnVwZGF0ZUxpc3RPZlZhbHVlKFt2YWx1ZV0pO1xuICAgICAgfVxuICAgICAgdGhpcy5zZXRPcGVuU3RhdGUoZmFsc2UpO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB0YXJnZXRJbmRleCA9IHRoaXMubGlzdE9mVmFsdWUuZmluZEluZGV4KG8gPT4gdGhpcy5jb21wYXJlV2l0aChvLCB2YWx1ZSkpO1xuICAgICAgaWYgKHRhcmdldEluZGV4ICE9PSAtMSkge1xuICAgICAgICBjb25zdCBsaXN0T2ZWYWx1ZUFmdGVyUmVtb3ZlZCA9IHRoaXMubGlzdE9mVmFsdWUuZmlsdGVyKChfLCBpKSA9PiBpICE9PSB0YXJnZXRJbmRleCk7XG4gICAgICAgIHRoaXMudXBkYXRlTGlzdE9mVmFsdWUobGlzdE9mVmFsdWVBZnRlclJlbW92ZWQpO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLmxpc3RPZlZhbHVlLmxlbmd0aCA8IHRoaXMubnpNYXhNdWx0aXBsZUNvdW50KSB7XG4gICAgICAgIGNvbnN0IGxpc3RPZlZhbHVlQWZ0ZXJBZGRlZCA9IFsuLi50aGlzLmxpc3RPZlZhbHVlLCB2YWx1ZV07XG4gICAgICAgIHRoaXMudXBkYXRlTGlzdE9mVmFsdWUobGlzdE9mVmFsdWVBZnRlckFkZGVkKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuZm9jdXMoKTtcbiAgICAgIGlmICh0aGlzLm56QXV0b0NsZWFyU2VhcmNoVmFsdWUpIHtcbiAgICAgICAgdGhpcy5jbGVhcklucHV0KCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb25JdGVtRGVsZXRlKGl0ZW06IE56U2VsZWN0SXRlbUludGVyZmFjZSk6IHZvaWQge1xuICAgIGNvbnN0IGxpc3RPZlNlbGVjdGVkVmFsdWUgPSB0aGlzLmxpc3RPZlZhbHVlLmZpbHRlcih2ID0+ICF0aGlzLmNvbXBhcmVXaXRoKHYsIGl0ZW0ubnpWYWx1ZSkpO1xuICAgIHRoaXMudXBkYXRlTGlzdE9mVmFsdWUobGlzdE9mU2VsZWN0ZWRWYWx1ZSk7XG4gICAgdGhpcy5jbGVhcklucHV0KCk7XG4gIH1cblxuICBvbkhvc3RDbGljaygpOiB2b2lkIHtcbiAgICBpZiAoKHRoaXMubnpPcGVuICYmIHRoaXMubnpTaG93U2VhcmNoKSB8fCB0aGlzLm56RGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnNldE9wZW5TdGF0ZSghdGhpcy5uek9wZW4pO1xuICB9XG5cbiAgdXBkYXRlTGlzdE9mQ29udGFpbmVySXRlbSgpOiB2b2lkIHtcbiAgICBsZXQgbGlzdE9mQ29udGFpbmVySXRlbSA9IHRoaXMubGlzdE9mVGFnQW5kVGVtcGxhdGVJdGVtXG4gICAgICAuZmlsdGVyKGl0ZW0gPT4gIWl0ZW0ubnpIaWRlKVxuICAgICAgLmZpbHRlcihpdGVtID0+IHtcbiAgICAgICAgaWYgKCF0aGlzLm56U2VydmVyU2VhcmNoICYmIHRoaXMuc2VhcmNoVmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5uekZpbHRlck9wdGlvbih0aGlzLnNlYXJjaFZhbHVlLCBpdGVtKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgaWYgKHRoaXMubnpNb2RlID09PSAndGFncycgJiYgdGhpcy5zZWFyY2hWYWx1ZSkge1xuICAgICAgY29uc3QgbWF0Y2hlZEl0ZW0gPSB0aGlzLmxpc3RPZlRhZ0FuZFRlbXBsYXRlSXRlbS5maW5kKGl0ZW0gPT4gaXRlbS5uekxhYmVsID09PSB0aGlzLnNlYXJjaFZhbHVlKTtcbiAgICAgIGlmICghbWF0Y2hlZEl0ZW0pIHtcbiAgICAgICAgY29uc3QgdGFnSXRlbSA9IHRoaXMuZ2VuZXJhdGVUYWdJdGVtKHRoaXMuc2VhcmNoVmFsdWUpO1xuICAgICAgICBsaXN0T2ZDb250YWluZXJJdGVtID0gW3RhZ0l0ZW0sIC4uLmxpc3RPZkNvbnRhaW5lckl0ZW1dO1xuICAgICAgICB0aGlzLmFjdGl2YXRlZFZhbHVlID0gdGFnSXRlbS5uelZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5hY3RpdmF0ZWRWYWx1ZSA9IG1hdGNoZWRJdGVtLm56VmFsdWU7XG4gICAgICB9XG4gICAgfVxuICAgIGNvbnN0IGFjdGl2YXRlZEl0ZW0gPSBsaXN0T2ZDb250YWluZXJJdGVtLmZpbmQoaXRlbSA9PiB0aGlzLmNvbXBhcmVXaXRoKGl0ZW0ubnpWYWx1ZSwgdGhpcy5saXN0T2ZWYWx1ZVswXSkpIHx8IGxpc3RPZkNvbnRhaW5lckl0ZW1bMF07XG4gICAgdGhpcy5hY3RpdmF0ZWRWYWx1ZSA9IChhY3RpdmF0ZWRJdGVtICYmIGFjdGl2YXRlZEl0ZW0ubnpWYWx1ZSkgfHwgbnVsbDtcbiAgICBsZXQgbGlzdE9mR3JvdXBMYWJlbDogQXJyYXk8c3RyaW5nIHwgbnVtYmVyIHwgVGVtcGxhdGVSZWY8TnpTYWZlQW55PiB8IG51bGw+ID0gW107XG4gICAgaWYgKHRoaXMuaXNSZWFjdGl2ZURyaXZlbikge1xuICAgICAgbGlzdE9mR3JvdXBMYWJlbCA9IFsuLi5uZXcgU2V0KHRoaXMubnpPcHRpb25zLmZpbHRlcihvID0+IG8uZ3JvdXBMYWJlbCkubWFwKG8gPT4gby5ncm91cExhYmVsISkpXTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMubGlzdE9mTnpPcHRpb25Hcm91cENvbXBvbmVudCkge1xuICAgICAgICBsaXN0T2ZHcm91cExhYmVsID0gdGhpcy5saXN0T2ZOek9wdGlvbkdyb3VwQ29tcG9uZW50Lm1hcChvID0+IG8ubnpMYWJlbCk7XG4gICAgICB9XG4gICAgfVxuICAgIC8qKiBpbnNlcnQgZ3JvdXAgaXRlbSAqKi9cbiAgICBsaXN0T2ZHcm91cExhYmVsLmZvckVhY2gobGFiZWwgPT4ge1xuICAgICAgY29uc3QgaW5kZXggPSBsaXN0T2ZDb250YWluZXJJdGVtLmZpbmRJbmRleChpdGVtID0+IGxhYmVsID09PSBpdGVtLmdyb3VwTGFiZWwpO1xuICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgY29uc3QgZ3JvdXBJdGVtID0geyBncm91cExhYmVsOiBsYWJlbCwgdHlwZTogJ2dyb3VwJywga2V5OiBsYWJlbCB9IGFzIE56U2VsZWN0SXRlbUludGVyZmFjZTtcbiAgICAgICAgbGlzdE9mQ29udGFpbmVySXRlbS5zcGxpY2UoaW5kZXgsIDAsIGdyb3VwSXRlbSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5saXN0T2ZDb250YWluZXJJdGVtID0gWy4uLmxpc3RPZkNvbnRhaW5lckl0ZW1dO1xuICAgIHRoaXMudXBkYXRlQ2RrQ29ubmVjdGVkT3ZlcmxheVBvc2l0aW9ucygpO1xuICB9XG5cbiAgY2xlYXJJbnB1dCgpOiB2b2lkIHtcbiAgICB0aGlzLm56U2VsZWN0VG9wQ29udHJvbENvbXBvbmVudC5jbGVhcklucHV0VmFsdWUoKTtcbiAgfVxuXG4gIHVwZGF0ZUxpc3RPZlZhbHVlKGxpc3RPZlZhbHVlOiBOelNhZmVBbnlbXSk6IHZvaWQge1xuICAgIGNvbnN0IGNvdmVydExpc3RUb01vZGVsID0gKGxpc3Q6IE56U2FmZUFueVtdLCBtb2RlOiBOelNlbGVjdE1vZGVUeXBlKTogTnpTYWZlQW55W10gfCBOelNhZmVBbnkgPT4ge1xuICAgICAgaWYgKG1vZGUgPT09ICdkZWZhdWx0Jykge1xuICAgICAgICBpZiAobGlzdC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcmV0dXJuIGxpc3RbMF07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBsaXN0O1xuICAgICAgfVxuICAgIH07XG4gICAgY29uc3QgbW9kZWwgPSBjb3ZlcnRMaXN0VG9Nb2RlbChsaXN0T2ZWYWx1ZSwgdGhpcy5uek1vZGUpO1xuICAgIGlmICh0aGlzLnZhbHVlICE9PSBtb2RlbCkge1xuICAgICAgdGhpcy5saXN0T2ZWYWx1ZSA9IGxpc3RPZlZhbHVlO1xuICAgICAgdGhpcy5saXN0T2ZWYWx1ZSQubmV4dChsaXN0T2ZWYWx1ZSk7XG4gICAgICB0aGlzLnZhbHVlID0gbW9kZWw7XG4gICAgICB0aGlzLm9uQ2hhbmdlKHRoaXMudmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIG9uVG9rZW5TZXBhcmF0ZShsaXN0T2ZMYWJlbDogc3RyaW5nW10pOiB2b2lkIHtcbiAgICBjb25zdCBsaXN0T2ZNYXRjaGVkVmFsdWUgPSB0aGlzLmxpc3RPZlRhZ0FuZFRlbXBsYXRlSXRlbVxuICAgICAgLmZpbHRlcihpdGVtID0+IGxpc3RPZkxhYmVsLmZpbmRJbmRleChsYWJlbCA9PiBsYWJlbCA9PT0gaXRlbS5uekxhYmVsKSAhPT0gLTEpXG4gICAgICAubWFwKGl0ZW0gPT4gaXRlbS5uelZhbHVlKVxuICAgICAgLmZpbHRlcihpdGVtID0+IHRoaXMubGlzdE9mVmFsdWUuZmluZEluZGV4KHYgPT4gdGhpcy5jb21wYXJlV2l0aCh2LCBpdGVtKSkgPT09IC0xKTtcbiAgICBpZiAodGhpcy5uek1vZGUgPT09ICdtdWx0aXBsZScpIHtcbiAgICAgIHRoaXMudXBkYXRlTGlzdE9mVmFsdWUoWy4uLnRoaXMubGlzdE9mVmFsdWUsIC4uLmxpc3RPZk1hdGNoZWRWYWx1ZV0pO1xuICAgIH0gZWxzZSBpZiAodGhpcy5uek1vZGUgPT09ICd0YWdzJykge1xuICAgICAgY29uc3QgbGlzdE9mVW5NYXRjaGVkTGFiZWwgPSBsaXN0T2ZMYWJlbC5maWx0ZXIoXG4gICAgICAgIGxhYmVsID0+IHRoaXMubGlzdE9mVGFnQW5kVGVtcGxhdGVJdGVtLmZpbmRJbmRleChpdGVtID0+IGl0ZW0ubnpMYWJlbCA9PT0gbGFiZWwpID09PSAtMVxuICAgICAgKTtcbiAgICAgIHRoaXMudXBkYXRlTGlzdE9mVmFsdWUoWy4uLnRoaXMubGlzdE9mVmFsdWUsIC4uLmxpc3RPZk1hdGNoZWRWYWx1ZSwgLi4ubGlzdE9mVW5NYXRjaGVkTGFiZWxdKTtcbiAgICB9XG4gICAgdGhpcy5jbGVhcklucHV0KCk7XG4gIH1cblxuICBvbk92ZXJsYXlLZXlEb3duKGU6IEtleWJvYXJkRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoZS5rZXlDb2RlID09PSBFU0NBUEUpIHtcbiAgICAgIHRoaXMuc2V0T3BlblN0YXRlKGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICBvbktleURvd24oZTogS2V5Ym9hcmRFdmVudCk6IHZvaWQge1xuICAgIGlmICh0aGlzLm56RGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgbGlzdE9mRmlsdGVyZWRPcHRpb25Ob3REaXNhYmxlZCA9IHRoaXMubGlzdE9mQ29udGFpbmVySXRlbS5maWx0ZXIoaXRlbSA9PiBpdGVtLnR5cGUgPT09ICdpdGVtJykuZmlsdGVyKGl0ZW0gPT4gIWl0ZW0ubnpEaXNhYmxlZCk7XG4gICAgY29uc3QgYWN0aXZhdGVkSW5kZXggPSBsaXN0T2ZGaWx0ZXJlZE9wdGlvbk5vdERpc2FibGVkLmZpbmRJbmRleChpdGVtID0+IHRoaXMuY29tcGFyZVdpdGgoaXRlbS5uelZhbHVlLCB0aGlzLmFjdGl2YXRlZFZhbHVlKSk7XG4gICAgc3dpdGNoIChlLmtleUNvZGUpIHtcbiAgICAgIGNhc2UgVVBfQVJST1c6XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKHRoaXMubnpPcGVuKSB7XG4gICAgICAgICAgY29uc3QgcHJlSW5kZXggPSBhY3RpdmF0ZWRJbmRleCA+IDAgPyBhY3RpdmF0ZWRJbmRleCAtIDEgOiBsaXN0T2ZGaWx0ZXJlZE9wdGlvbk5vdERpc2FibGVkLmxlbmd0aCAtIDE7XG4gICAgICAgICAgdGhpcy5hY3RpdmF0ZWRWYWx1ZSA9IGxpc3RPZkZpbHRlcmVkT3B0aW9uTm90RGlzYWJsZWRbcHJlSW5kZXhdLm56VmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIERPV05fQVJST1c6XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKHRoaXMubnpPcGVuKSB7XG4gICAgICAgICAgY29uc3QgbmV4dEluZGV4ID0gYWN0aXZhdGVkSW5kZXggPCBsaXN0T2ZGaWx0ZXJlZE9wdGlvbk5vdERpc2FibGVkLmxlbmd0aCAtIDEgPyBhY3RpdmF0ZWRJbmRleCArIDEgOiAwO1xuICAgICAgICAgIHRoaXMuYWN0aXZhdGVkVmFsdWUgPSBsaXN0T2ZGaWx0ZXJlZE9wdGlvbk5vdERpc2FibGVkW25leHRJbmRleF0ubnpWYWx1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldE9wZW5TdGF0ZSh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgRU5URVI6XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKHRoaXMubnpPcGVuKSB7XG4gICAgICAgICAgaWYgKGlzTm90TmlsKHRoaXMuYWN0aXZhdGVkVmFsdWUpKSB7XG4gICAgICAgICAgICB0aGlzLm9uSXRlbUNsaWNrKHRoaXMuYWN0aXZhdGVkVmFsdWUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnNldE9wZW5TdGF0ZSh0cnVlKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgU1BBQ0U6XG4gICAgICAgIGlmICghdGhpcy5uek9wZW4pIHtcbiAgICAgICAgICB0aGlzLnNldE9wZW5TdGF0ZSh0cnVlKTtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFRBQjpcbiAgICAgICAgdGhpcy5zZXRPcGVuU3RhdGUoZmFsc2UpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgRVNDQVBFOlxuICAgICAgICAvKipcbiAgICAgICAgICogU2tpcCB0aGUgRVNDQVBFIHByb2Nlc3NpbmcsIGl0IHdpbGwgYmUgaGFuZGxlZCBpbiB7QGxpbmsgb25PdmVybGF5S2V5RG93bn0uXG4gICAgICAgICAqL1xuICAgICAgICBicmVhaztcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGlmICghdGhpcy5uek9wZW4pIHtcbiAgICAgICAgICB0aGlzLnNldE9wZW5TdGF0ZSh0cnVlKTtcbiAgICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHNldE9wZW5TdGF0ZSh2YWx1ZTogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmICh0aGlzLm56T3BlbiAhPT0gdmFsdWUpIHtcbiAgICAgIHRoaXMubnpPcGVuID0gdmFsdWU7XG4gICAgICB0aGlzLm56T3BlbkNoYW5nZS5lbWl0KHZhbHVlKTtcbiAgICAgIHRoaXMub25PcGVuQ2hhbmdlKCk7XG4gICAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICBvbk9wZW5DaGFuZ2UoKTogdm9pZCB7XG4gICAgdGhpcy51cGRhdGVDZGtDb25uZWN0ZWRPdmVybGF5U3RhdHVzKCk7XG4gICAgdGhpcy5jbGVhcklucHV0KCk7XG4gIH1cblxuICBvbklucHV0VmFsdWVDaGFuZ2UodmFsdWU6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuc2VhcmNoVmFsdWUgPSB2YWx1ZTtcbiAgICB0aGlzLnVwZGF0ZUxpc3RPZkNvbnRhaW5lckl0ZW0oKTtcbiAgICB0aGlzLm56T25TZWFyY2guZW1pdCh2YWx1ZSk7XG4gICAgdGhpcy51cGRhdGVDZGtDb25uZWN0ZWRPdmVybGF5UG9zaXRpb25zKCk7XG4gIH1cblxuICBvbkNsZWFyU2VsZWN0aW9uKCk6IHZvaWQge1xuICAgIHRoaXMudXBkYXRlTGlzdE9mVmFsdWUoW10pO1xuICB9XG5cbiAgb25DbGlja091dHNpZGUoZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKGV2ZW50LnRhcmdldCkpIHtcbiAgICAgIHRoaXMuc2V0T3BlblN0YXRlKGZhbHNlKTtcbiAgICB9XG4gIH1cblxuICBmb2N1cygpOiB2b2lkIHtcbiAgICB0aGlzLm56U2VsZWN0VG9wQ29udHJvbENvbXBvbmVudC5mb2N1cygpO1xuICB9XG5cbiAgYmx1cigpOiB2b2lkIHtcbiAgICB0aGlzLm56U2VsZWN0VG9wQ29udHJvbENvbXBvbmVudC5ibHVyKCk7XG4gIH1cblxuICBvblBvc2l0aW9uQ2hhbmdlKHBvc2l0aW9uOiBDb25uZWN0ZWRPdmVybGF5UG9zaXRpb25DaGFuZ2UpOiB2b2lkIHtcbiAgICB0aGlzLmRyb3BEb3duUG9zaXRpb24gPSBwb3NpdGlvbi5jb25uZWN0aW9uUGFpci5vcmlnaW5ZO1xuICB9XG5cbiAgdXBkYXRlQ2RrQ29ubmVjdGVkT3ZlcmxheVN0YXR1cygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5wbGF0Zm9ybS5pc0Jyb3dzZXIgJiYgdGhpcy5vcmlnaW5FbGVtZW50Lm5hdGl2ZUVsZW1lbnQpIHtcbiAgICAgIHJlcUFuaW1GcmFtZSgoKSA9PiB7XG4gICAgICAgIHRoaXMudHJpZ2dlcldpZHRoID0gdGhpcy5vcmlnaW5FbGVtZW50Lm5hdGl2ZUVsZW1lbnQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkud2lkdGg7XG4gICAgICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgdXBkYXRlQ2RrQ29ubmVjdGVkT3ZlcmxheVBvc2l0aW9ucygpOiB2b2lkIHtcbiAgICByZXFBbmltRnJhbWUoKCkgPT4ge1xuICAgICAgdGhpcy5jZGtDb25uZWN0ZWRPdmVybGF5Py5vdmVybGF5UmVmPy51cGRhdGVQb3NpdGlvbigpO1xuICAgIH0pO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIG56Q29uZmlnU2VydmljZTogTnpDb25maWdTZXJ2aWNlLFxuICAgIHByaXZhdGUgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBwbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgcHJpdmF0ZSBmb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIGRpcmVjdGlvbmFsaXR5OiBEaXJlY3Rpb25hbGl0eSxcbiAgICBASG9zdCgpIEBPcHRpb25hbCgpIHB1YmxpYyBub0FuaW1hdGlvbj86IE56Tm9BbmltYXRpb25EaXJlY3RpdmVcbiAgKSB7XG4gICAgLy8gVE9ETzogbW92ZSB0byBob3N0IGFmdGVyIFZpZXcgRW5naW5lIGRlcHJlY2F0aW9uXG4gICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYW50LXNlbGVjdCcpO1xuICB9XG5cbiAgd3JpdGVWYWx1ZShtb2RlbFZhbHVlOiBOelNhZmVBbnkgfCBOelNhZmVBbnlbXSk6IHZvaWQge1xuICAgIC8qKiBodHRwczovL2dpdGh1Yi5jb20vYW5ndWxhci9hbmd1bGFyL2lzc3Vlcy8xNDk4OCAqKi9cbiAgICBpZiAodGhpcy52YWx1ZSAhPT0gbW9kZWxWYWx1ZSkge1xuICAgICAgdGhpcy52YWx1ZSA9IG1vZGVsVmFsdWU7XG4gICAgICBjb25zdCBjb3ZlcnRNb2RlbFRvTGlzdCA9IChtb2RlbDogTnpTYWZlQW55W10gfCBOelNhZmVBbnksIG1vZGU6IE56U2VsZWN0TW9kZVR5cGUpOiBOelNhZmVBbnlbXSA9PiB7XG4gICAgICAgIGlmIChtb2RlbCA9PT0gbnVsbCB8fCBtb2RlbCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgcmV0dXJuIFtdO1xuICAgICAgICB9IGVsc2UgaWYgKG1vZGUgPT09ICdkZWZhdWx0Jykge1xuICAgICAgICAgIHJldHVybiBbbW9kZWxdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBtb2RlbDtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICAgIGNvbnN0IGxpc3RPZlZhbHVlID0gY292ZXJ0TW9kZWxUb0xpc3QobW9kZWxWYWx1ZSwgdGhpcy5uek1vZGUpO1xuICAgICAgdGhpcy5saXN0T2ZWYWx1ZSA9IGxpc3RPZlZhbHVlO1xuICAgICAgdGhpcy5saXN0T2ZWYWx1ZSQubmV4dChsaXN0T2ZWYWx1ZSk7XG4gICAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgICB9XG4gIH1cblxuICByZWdpc3Rlck9uQ2hhbmdlKGZuOiBPbkNoYW5nZVR5cGUpOiB2b2lkIHtcbiAgICB0aGlzLm9uQ2hhbmdlID0gZm47XG4gIH1cblxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogT25Ub3VjaGVkVHlwZSk6IHZvaWQge1xuICAgIHRoaXMub25Ub3VjaGVkID0gZm47XG4gIH1cblxuICBzZXREaXNhYmxlZFN0YXRlKGRpc2FibGVkOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5uekRpc2FibGVkID0gZGlzYWJsZWQ7XG4gICAgaWYgKGRpc2FibGVkKSB7XG4gICAgICB0aGlzLnNldE9wZW5TdGF0ZShmYWxzZSk7XG4gICAgfVxuICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGNvbnN0IHsgbnpPcGVuLCBuekRpc2FibGVkLCBuek9wdGlvbnMgfSA9IGNoYW5nZXM7XG4gICAgaWYgKG56T3Blbikge1xuICAgICAgdGhpcy5vbk9wZW5DaGFuZ2UoKTtcbiAgICB9XG4gICAgaWYgKG56RGlzYWJsZWQgJiYgdGhpcy5uekRpc2FibGVkKSB7XG4gICAgICB0aGlzLnNldE9wZW5TdGF0ZShmYWxzZSk7XG4gICAgfVxuICAgIGlmIChuek9wdGlvbnMpIHtcbiAgICAgIHRoaXMuaXNSZWFjdGl2ZURyaXZlbiA9IHRydWU7XG4gICAgICBjb25zdCBsaXN0T2ZPcHRpb25zID0gdGhpcy5uek9wdGlvbnMgfHwgW107XG4gICAgICBjb25zdCBsaXN0T2ZUcmFuc2Zvcm1lZEl0ZW0gPSBsaXN0T2ZPcHRpb25zLm1hcChpdGVtID0+IHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICB0ZW1wbGF0ZTogaXRlbS5sYWJlbCBpbnN0YW5jZW9mIFRlbXBsYXRlUmVmID8gaXRlbS5sYWJlbCA6IG51bGwsXG4gICAgICAgICAgbnpMYWJlbDogdHlwZW9mIGl0ZW0ubGFiZWwgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBpdGVtLmxhYmVsID09PSAnbnVtYmVyJyA/IGl0ZW0ubGFiZWwgOiBudWxsLFxuICAgICAgICAgIG56VmFsdWU6IGl0ZW0udmFsdWUsXG4gICAgICAgICAgbnpEaXNhYmxlZDogaXRlbS5kaXNhYmxlZCB8fCBmYWxzZSxcbiAgICAgICAgICBuekhpZGU6IGl0ZW0uaGlkZSB8fCBmYWxzZSxcbiAgICAgICAgICBuekN1c3RvbUNvbnRlbnQ6IGl0ZW0ubGFiZWwgaW5zdGFuY2VvZiBUZW1wbGF0ZVJlZixcbiAgICAgICAgICBncm91cExhYmVsOiBpdGVtLmdyb3VwTGFiZWwgfHwgbnVsbCxcbiAgICAgICAgICB0eXBlOiAnaXRlbScsXG4gICAgICAgICAga2V5OiBpdGVtLnZhbHVlXG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICAgIHRoaXMubGlzdE9mVGVtcGxhdGVJdGVtJC5uZXh0KGxpc3RPZlRyYW5zZm9ybWVkSXRlbSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5mb2N1c01vbml0b3JcbiAgICAgIC5tb25pdG9yKHRoaXMuZWxlbWVudFJlZiwgdHJ1ZSlcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSlcbiAgICAgIC5zdWJzY3JpYmUoZm9jdXNPcmlnaW4gPT4ge1xuICAgICAgICBpZiAoIWZvY3VzT3JpZ2luKSB7XG4gICAgICAgICAgdGhpcy5mb2N1c2VkID0gZmFsc2U7XG4gICAgICAgICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gICAgICAgICAgdGhpcy5uekJsdXIuZW1pdCgpO1xuICAgICAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5vblRvdWNoZWQoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLmZvY3VzZWQgPSB0cnVlO1xuICAgICAgICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICAgIHRoaXMubnpGb2N1cy5lbWl0KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIGNvbWJpbmVMYXRlc3QoW3RoaXMubGlzdE9mVmFsdWUkLCB0aGlzLmxpc3RPZlRlbXBsYXRlSXRlbSRdKVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKVxuICAgICAgLnN1YnNjcmliZSgoW2xpc3RPZlNlbGVjdGVkVmFsdWUsIGxpc3RPZlRlbXBsYXRlSXRlbV0pID0+IHtcbiAgICAgICAgY29uc3QgbGlzdE9mVGFnSXRlbSA9IGxpc3RPZlNlbGVjdGVkVmFsdWVcbiAgICAgICAgICAuZmlsdGVyKCgpID0+IHRoaXMubnpNb2RlID09PSAndGFncycpXG4gICAgICAgICAgLmZpbHRlcih2YWx1ZSA9PiBsaXN0T2ZUZW1wbGF0ZUl0ZW0uZmluZEluZGV4KG8gPT4gdGhpcy5jb21wYXJlV2l0aChvLm56VmFsdWUsIHZhbHVlKSkgPT09IC0xKVxuICAgICAgICAgIC5tYXAodmFsdWUgPT4gdGhpcy5saXN0T2ZUb3BJdGVtLmZpbmQobyA9PiB0aGlzLmNvbXBhcmVXaXRoKG8ubnpWYWx1ZSwgdmFsdWUpKSB8fCB0aGlzLmdlbmVyYXRlVGFnSXRlbSh2YWx1ZSkpO1xuICAgICAgICB0aGlzLmxpc3RPZlRhZ0FuZFRlbXBsYXRlSXRlbSA9IFsuLi5saXN0T2ZUZW1wbGF0ZUl0ZW0sIC4uLmxpc3RPZlRhZ0l0ZW1dO1xuICAgICAgICB0aGlzLmxpc3RPZlRvcEl0ZW0gPSB0aGlzLmxpc3RPZlZhbHVlXG4gICAgICAgICAgLm1hcCh2ID0+IFsuLi50aGlzLmxpc3RPZlRhZ0FuZFRlbXBsYXRlSXRlbSwgLi4udGhpcy5saXN0T2ZUb3BJdGVtXS5maW5kKGl0ZW0gPT4gdGhpcy5jb21wYXJlV2l0aCh2LCBpdGVtLm56VmFsdWUpKSEpXG4gICAgICAgICAgLmZpbHRlcihpdGVtID0+ICEhaXRlbSk7XG4gICAgICAgIHRoaXMudXBkYXRlTGlzdE9mQ29udGFpbmVySXRlbSgpO1xuICAgICAgfSk7XG5cbiAgICB0aGlzLmRpcmVjdGlvbmFsaXR5LmNoYW5nZT8ucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpLnN1YnNjcmliZSgoZGlyZWN0aW9uOiBEaXJlY3Rpb24pID0+IHtcbiAgICAgIHRoaXMuZGlyID0gZGlyZWN0aW9uO1xuICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5uekNvbmZpZ1NlcnZpY2VcbiAgICAgIC5nZXRDb25maWdDaGFuZ2VFdmVudEZvckNvbXBvbmVudCgnc2VsZWN0JylcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIH0pO1xuXG4gICAgdGhpcy5kaXIgPSB0aGlzLmRpcmVjdGlvbmFsaXR5LnZhbHVlO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5pc1JlYWN0aXZlRHJpdmVuKSB7XG4gICAgICBtZXJnZSh0aGlzLmxpc3RPZk56T3B0aW9uR3JvdXBDb21wb25lbnQuY2hhbmdlcywgdGhpcy5saXN0T2ZOek9wdGlvbkNvbXBvbmVudC5jaGFuZ2VzKVxuICAgICAgICAucGlwZShcbiAgICAgICAgICBzdGFydFdpdGgodHJ1ZSksXG4gICAgICAgICAgc3dpdGNoTWFwKCgpID0+XG4gICAgICAgICAgICBtZXJnZShcbiAgICAgICAgICAgICAgLi4uW1xuICAgICAgICAgICAgICAgIHRoaXMubGlzdE9mTnpPcHRpb25Db21wb25lbnQuY2hhbmdlcyxcbiAgICAgICAgICAgICAgICB0aGlzLmxpc3RPZk56T3B0aW9uR3JvdXBDb21wb25lbnQuY2hhbmdlcyxcbiAgICAgICAgICAgICAgICAuLi50aGlzLmxpc3RPZk56T3B0aW9uQ29tcG9uZW50Lm1hcChvcHRpb24gPT4gb3B0aW9uLmNoYW5nZXMpLFxuICAgICAgICAgICAgICAgIC4uLnRoaXMubGlzdE9mTnpPcHRpb25Hcm91cENvbXBvbmVudC5tYXAob3B0aW9uID0+IG9wdGlvbi5jaGFuZ2VzKVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICApLnBpcGUoc3RhcnRXaXRoKHRydWUpKVxuICAgICAgICAgICksXG4gICAgICAgICAgdGFrZVVudGlsKHRoaXMuZGVzdHJveSQpXG4gICAgICAgIClcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgY29uc3QgbGlzdE9mT3B0aW9uSW50ZXJmYWNlID0gdGhpcy5saXN0T2ZOek9wdGlvbkNvbXBvbmVudC50b0FycmF5KCkubWFwKGl0ZW0gPT4ge1xuICAgICAgICAgICAgY29uc3QgeyB0ZW1wbGF0ZSwgbnpMYWJlbCwgbnpWYWx1ZSwgbnpEaXNhYmxlZCwgbnpIaWRlLCBuekN1c3RvbUNvbnRlbnQsIGdyb3VwTGFiZWwgfSA9IGl0ZW07XG4gICAgICAgICAgICByZXR1cm4geyB0ZW1wbGF0ZSwgbnpMYWJlbCwgbnpWYWx1ZSwgbnpEaXNhYmxlZCwgbnpIaWRlLCBuekN1c3RvbUNvbnRlbnQsIGdyb3VwTGFiZWwsIHR5cGU6ICdpdGVtJywga2V5OiBuelZhbHVlIH07XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgdGhpcy5saXN0T2ZUZW1wbGF0ZUl0ZW0kLm5leHQobGlzdE9mT3B0aW9uSW50ZXJmYWNlKTtcbiAgICAgICAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5mb2N1c01vbml0b3Iuc3RvcE1vbml0b3JpbmcodGhpcy5lbGVtZW50UmVmKTtcbiAgICB0aGlzLmRlc3Ryb3kkLm5leHQoKTtcbiAgICB0aGlzLmRlc3Ryb3kkLmNvbXBsZXRlKCk7XG4gIH1cbn1cbiJdfQ==