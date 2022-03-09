/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { PipeTransform } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
export declare type AggregateMethod = 'sum' | 'max' | 'min' | 'avg';
export declare class NzAggregatePipe implements PipeTransform {
    transform(value: number[], method: AggregateMethod): undefined | number;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NzAggregatePipe, never>;
    static ɵpipe: ɵngcc0.ɵɵPipeDefWithMeta<NzAggregatePipe, "nzAggregate">;
}

//# sourceMappingURL=nz-aggregate.pipe.d.ts.map