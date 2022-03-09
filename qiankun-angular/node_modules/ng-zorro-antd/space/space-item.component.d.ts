/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { ElementRef, OnInit, Renderer2 } from '@angular/core';
import { NzSpaceDirection } from './types';
/**
 * @deprecated NzSpaceItemLegacyComponent will be removed on 12.0.0.
 * @breaking-change 12.0.0
 */
import * as ɵngcc0 from '@angular/core';
export declare class NzSpaceItemLegacyComponent implements OnInit {
    private renderer;
    private elementRef;
    constructor(renderer: Renderer2, elementRef: ElementRef);
    setDirectionAndSize(direction: NzSpaceDirection, size: number): void;
    ngOnInit(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NzSpaceItemLegacyComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<NzSpaceItemLegacyComponent, "nz-space-item, [nz-space-item]", never, {}, {}, never, ["*"]>;
}

//# sourceMappingURL=space-item.component.d.ts.map