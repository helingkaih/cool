/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { NzSkeletonAvatarShape, NzSkeletonAvatarSize, NzSkeletonButtonShape, NzSkeletonButtonSize, NzSkeletonInputSize } from './skeleton.type';
import * as ɵngcc0 from '@angular/core';
export declare class NzSkeletonElementDirective {
    private elementRef;
    nzActive: boolean;
    nzType: 'button' | 'input' | 'avatar' | 'image';
    constructor(elementRef: ElementRef);
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NzSkeletonElementDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<NzSkeletonElementDirective, "nz-skeleton-element", never, { "nzActive": "nzActive"; "nzType": "nzType"; }, {}, never>;
}
export declare class NzSkeletonElementButtonComponent {
    nzShape: NzSkeletonButtonShape;
    nzSize: NzSkeletonButtonSize;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NzSkeletonElementButtonComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<NzSkeletonElementButtonComponent, "nz-skeleton-element[nzType=\"button\"]", never, { "nzShape": "nzShape"; "nzSize": "nzSize"; }, {}, never, never>;
}
export declare class NzSkeletonElementAvatarComponent implements OnChanges {
    nzShape: NzSkeletonAvatarShape;
    nzSize: NzSkeletonAvatarSize;
    styleMap: {};
    ngOnChanges(changes: SimpleChanges): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NzSkeletonElementAvatarComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<NzSkeletonElementAvatarComponent, "nz-skeleton-element[nzType=\"avatar\"]", never, { "nzShape": "nzShape"; "nzSize": "nzSize"; }, {}, never, never>;
}
export declare class NzSkeletonElementInputComponent {
    nzSize: NzSkeletonInputSize;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NzSkeletonElementInputComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<NzSkeletonElementInputComponent, "nz-skeleton-element[nzType=\"input\"]", never, { "nzSize": "nzSize"; }, {}, never, never>;
}
export declare class NzSkeletonElementImageComponent {
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NzSkeletonElementImageComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<NzSkeletonElementImageComponent, "nz-skeleton-element[nzType=\"image\"]", never, {}, {}, never, never>;
}

//# sourceMappingURL=skeleton-element.component.d.ts.map