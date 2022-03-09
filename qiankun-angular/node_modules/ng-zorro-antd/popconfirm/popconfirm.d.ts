/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectorRef, ComponentFactory, ComponentFactoryResolver, ElementRef, EventEmitter, OnDestroy, Renderer2, TemplateRef, ViewContainerRef } from '@angular/core';
import { NzButtonType } from 'ng-zorro-antd/button';
import { NzConfigKey, NzConfigService } from 'ng-zorro-antd/core/config';
import { NzNoAnimationDirective } from 'ng-zorro-antd/core/no-animation';
import { BooleanInput, NgStyleInterface, NzTSType } from 'ng-zorro-antd/core/types';
import { NzTooltipBaseDirective, NzToolTipComponent, NzTooltipTrigger, PropertyMapping } from 'ng-zorro-antd/tooltip';
import { Subject } from 'rxjs';
import * as ɵngcc0 from '@angular/core';
export declare class NzPopconfirmDirective extends NzTooltipBaseDirective {
    readonly _nzModuleName: NzConfigKey;
    static ngAcceptInputType_nzCondition: BooleanInput;
    static ngAcceptInputType_nzPopconfirmShowArrow: BooleanInput;
    title?: NzTSType;
    directiveTitle?: NzTSType | null;
    trigger?: NzTooltipTrigger;
    placement?: string | string[];
    origin?: ElementRef<HTMLElement>;
    mouseEnterDelay?: number;
    mouseLeaveDelay?: number;
    overlayClassName?: string;
    overlayStyle?: NgStyleInterface;
    visible?: boolean;
    nzOkText?: string;
    nzOkType?: string;
    nzCancelText?: string;
    nzIcon?: string | TemplateRef<void>;
    nzCondition: boolean;
    nzPopconfirmShowArrow: boolean;
    nzPopconfirmBackdrop?: boolean;
    readonly visibleChange: EventEmitter<boolean>;
    readonly nzOnCancel: EventEmitter<void>;
    readonly nzOnConfirm: EventEmitter<void>;
    protected readonly componentFactory: ComponentFactory<NzPopconfirmComponent>;
    protected getProxyPropertyMap(): PropertyMapping;
    constructor(elementRef: ElementRef, hostView: ViewContainerRef, resolver: ComponentFactoryResolver, renderer: Renderer2, noAnimation?: NzNoAnimationDirective, nzConfigService?: NzConfigService);
    /**
     * @override
     */
    protected createComponent(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NzPopconfirmDirective, [null, null, null, null, { optional: true; host: true; }, null]>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<NzPopconfirmDirective, "[nz-popconfirm]", ["nzPopconfirm"], { "trigger": "nzPopconfirmTrigger"; "placement": "nzPopconfirmPlacement"; "nzCondition": "nzCondition"; "nzPopconfirmShowArrow": "nzPopconfirmShowArrow"; "nzPopconfirmBackdrop": "nzPopconfirmBackdrop"; "title": "nzPopconfirmTitle"; "directiveTitle": "nz-popconfirm"; "origin": "nzPopconfirmOrigin"; "mouseEnterDelay": "nzPopconfirmMouseEnterDelay"; "mouseLeaveDelay": "nzPopconfirmMouseLeaveDelay"; "overlayClassName": "nzPopconfirmOverlayClassName"; "overlayStyle": "nzPopconfirmOverlayStyle"; "visible": "nzPopconfirmVisible"; "nzOkText": "nzOkText"; "nzOkType": "nzOkType"; "nzCancelText": "nzCancelText"; "nzIcon": "nzIcon"; }, { "visibleChange": "nzPopconfirmVisibleChange"; "nzOnCancel": "nzOnCancel"; "nzOnConfirm": "nzOnConfirm"; }, never>;
}
export declare class NzPopconfirmComponent extends NzToolTipComponent implements OnDestroy {
    noAnimation?: NzNoAnimationDirective | undefined;
    nzCancelText?: string;
    nzCondition: boolean;
    nzPopconfirmShowArrow: boolean;
    nzIcon?: string | TemplateRef<void>;
    nzOkText?: string;
    nzOkType: NzButtonType;
    readonly nzOnCancel: Subject<void>;
    readonly nzOnConfirm: Subject<void>;
    protected _trigger: NzTooltipTrigger;
    _prefix: string;
    constructor(cdr: ChangeDetectorRef, directionality: Directionality, noAnimation?: NzNoAnimationDirective | undefined);
    ngOnDestroy(): void;
    /**
     * @override
     */
    show(): void;
    onCancel(): void;
    onConfirm(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NzPopconfirmComponent, [null, { optional: true; }, { optional: true; host: true; }]>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<NzPopconfirmComponent, "nz-popconfirm", ["nzPopconfirmComponent"], {}, {}, never, never>;
}

//# sourceMappingURL=popconfirm.d.ts.map