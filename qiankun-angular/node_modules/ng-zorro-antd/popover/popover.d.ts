/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectorRef, ComponentFactory, ComponentFactoryResolver, ElementRef, EventEmitter, Renderer2, ViewContainerRef } from '@angular/core';
import { NzConfigKey, NzConfigService } from 'ng-zorro-antd/core/config';
import { NzNoAnimationDirective } from 'ng-zorro-antd/core/no-animation';
import { NgStyleInterface, NzTSType } from 'ng-zorro-antd/core/types';
import { NzTooltipBaseDirective, NzToolTipComponent, NzTooltipTrigger, PropertyMapping } from 'ng-zorro-antd/tooltip';
import * as ɵngcc0 from '@angular/core';
export declare class NzPopoverDirective extends NzTooltipBaseDirective {
    noAnimation?: NzNoAnimationDirective | undefined;
    readonly _nzModuleName: NzConfigKey;
    title?: NzTSType;
    content?: NzTSType;
    directiveTitle?: NzTSType | null;
    trigger?: NzTooltipTrigger;
    placement?: string | string[];
    origin?: ElementRef<HTMLElement>;
    visible?: boolean;
    mouseEnterDelay?: number;
    mouseLeaveDelay?: number;
    overlayClassName?: string;
    overlayStyle?: NgStyleInterface;
    nzPopoverBackdrop?: boolean;
    readonly visibleChange: EventEmitter<boolean>;
    componentFactory: ComponentFactory<NzPopoverComponent>;
    protected getProxyPropertyMap(): PropertyMapping;
    constructor(elementRef: ElementRef, hostView: ViewContainerRef, resolver: ComponentFactoryResolver, renderer: Renderer2, noAnimation?: NzNoAnimationDirective | undefined, nzConfigService?: NzConfigService);
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NzPopoverDirective, [null, null, null, null, { optional: true; host: true; }, null]>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<NzPopoverDirective, "[nz-popover]", ["nzPopover"], { "trigger": "nzPopoverTrigger"; "placement": "nzPopoverPlacement"; "nzPopoverBackdrop": "nzPopoverBackdrop"; "title": "nzPopoverTitle"; "content": "nzPopoverContent"; "directiveTitle": "nz-popover"; "origin": "nzPopoverOrigin"; "visible": "nzPopoverVisible"; "mouseEnterDelay": "nzPopoverMouseEnterDelay"; "mouseLeaveDelay": "nzPopoverMouseLeaveDelay"; "overlayClassName": "nzPopoverOverlayClassName"; "overlayStyle": "nzPopoverOverlayStyle"; }, { "visibleChange": "nzPopoverVisibleChange"; }, never>;
}
export declare class NzPopoverComponent extends NzToolTipComponent {
    noAnimation?: NzNoAnimationDirective | undefined;
    _prefix: string;
    constructor(cdr: ChangeDetectorRef, directionality: Directionality, noAnimation?: NzNoAnimationDirective | undefined);
    get hasBackdrop(): boolean;
    protected isEmpty(): boolean;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NzPopoverComponent, [null, { optional: true; }, { optional: true; host: true; }]>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<NzPopoverComponent, "nz-popover", ["nzPopoverComponent"], {}, {}, never, never>;
}

//# sourceMappingURL=popover.d.ts.map