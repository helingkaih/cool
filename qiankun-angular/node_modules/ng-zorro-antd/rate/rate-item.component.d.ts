/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { EventEmitter, TemplateRef } from '@angular/core';
import { BooleanInput } from 'ng-zorro-antd/core/types';
import * as ɵngcc0 from '@angular/core';
export declare class NzRateItemComponent {
    static ngAcceptInputType_allowHalf: BooleanInput;
    character: TemplateRef<void>;
    allowHalf: boolean;
    readonly itemHover: EventEmitter<boolean>;
    readonly itemClick: EventEmitter<boolean>;
    hoverRate(isHalf: boolean): void;
    clickRate(isHalf: boolean): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NzRateItemComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<NzRateItemComponent, "[nz-rate-item]", ["nzRateItem"], { "allowHalf": "allowHalf"; "character": "character"; }, { "itemHover": "itemHover"; "itemClick": "itemClick"; }, never, never>;
}

//# sourceMappingURL=rate-item.component.d.ts.map