/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { OnChanges, TemplateRef } from '@angular/core';
import { NzStatisticValueType } from './typings';
import * as ɵngcc0 from '@angular/core';
export declare class NzStatisticNumberComponent implements OnChanges {
    private locale_id;
    nzValue?: NzStatisticValueType;
    nzValueTemplate?: TemplateRef<{
        $implicit: NzStatisticValueType;
    }>;
    displayInt: string;
    displayDecimal: string;
    constructor(locale_id: string);
    ngOnChanges(): void;
    private formatNumber;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NzStatisticNumberComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<NzStatisticNumberComponent, "nz-statistic-number", ["nzStatisticNumber"], { "nzValue": "nzValue"; "nzValueTemplate": "nzValueTemplate"; }, {}, never, never>;
}

//# sourceMappingURL=statistic-number.component.d.ts.map