/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { Direction, Directionality } from '@angular/cdk/bidi';
import { ChangeDetectorRef, ElementRef, OnChanges, OnDestroy, OnInit, TemplateRef } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
export declare type NzResultIconType = 'success' | 'error' | 'info' | 'warning';
export declare type NzExceptionStatusType = '404' | '500' | '403';
export declare type NzResultStatusType = NzExceptionStatusType | NzResultIconType;
export declare class NzResultComponent implements OnChanges, OnDestroy, OnInit {
    private elementRef;
    private cdr;
    private directionality;
    nzIcon?: string | TemplateRef<void>;
    nzTitle?: string | TemplateRef<void>;
    nzStatus: NzResultStatusType;
    nzSubTitle?: string | TemplateRef<void>;
    nzExtra?: string | TemplateRef<void>;
    icon?: string | TemplateRef<void>;
    isException: boolean;
    dir: Direction;
    private destroy$;
    constructor(elementRef: ElementRef, cdr: ChangeDetectorRef, directionality: Directionality);
    ngOnInit(): void;
    ngOnChanges(): void;
    ngOnDestroy(): void;
    private setStatusIcon;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NzResultComponent, [null, null, { optional: true; }]>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<NzResultComponent, "nz-result", ["nzResult"], { "nzStatus": "nzStatus"; "nzIcon": "nzIcon"; "nzTitle": "nzTitle"; "nzSubTitle": "nzSubTitle"; "nzExtra": "nzExtra"; }, {}, never, ["[nz-result-icon]", "div[nz-result-title]", "div[nz-result-subtitle]", "nz-result-content, [nz-result-content]", "div[nz-result-extra]"]>;
}

//# sourceMappingURL=result.component.d.ts.map