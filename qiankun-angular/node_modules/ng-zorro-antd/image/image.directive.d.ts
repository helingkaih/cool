/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { Direction, Directionality } from '@angular/cdk/bidi';
import { ChangeDetectorRef, ElementRef, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { NzConfigKey, NzConfigService } from 'ng-zorro-antd/core/config';
import { BooleanInput, NzSafeAny } from 'ng-zorro-antd/core/types';
import { NzImageGroupComponent } from './image-group.component';
import { NzImageService } from './image.service';
import * as ɵngcc0 from '@angular/core';
export declare type ImageStatusType = 'error' | 'loading' | 'normal';
export declare class NzImageDirective implements OnInit, OnChanges, OnDestroy {
    private document;
    nzConfigService: NzConfigService;
    private elementRef;
    private nzImageService;
    protected cdr: ChangeDetectorRef;
    private parentGroup;
    private directionality;
    readonly _nzModuleName: NzConfigKey;
    static ngAcceptInputType_nzDisablePreview: BooleanInput;
    nzSrc: string;
    nzDisablePreview: boolean;
    nzFallback: string | null;
    nzPlaceholder: string | null;
    dir?: Direction;
    backLoadImage: HTMLImageElement;
    private status;
    private destroy$;
    get previewable(): boolean;
    constructor(document: NzSafeAny, nzConfigService: NzConfigService, elementRef: ElementRef, nzImageService: NzImageService, cdr: ChangeDetectorRef, parentGroup: NzImageGroupComponent, directionality: Directionality);
    ngOnInit(): void;
    ngOnDestroy(): void;
    onPreview(): void;
    getElement(): ElementRef<HTMLImageElement>;
    ngOnChanges(changes: SimpleChanges): void;
    /**
     * use internal Image object handle fallback & placeholder
     * @private
     */
    private backLoad;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NzImageDirective, [null, null, null, null, null, { optional: true; }, { optional: true; }]>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<NzImageDirective, "img[nz-image]", ["nzImage"], { "nzSrc": "nzSrc"; "nzDisablePreview": "nzDisablePreview"; "nzFallback": "nzFallback"; "nzPlaceholder": "nzPlaceholder"; }, {}, never>;
}

//# sourceMappingURL=image.directive.d.ts.map