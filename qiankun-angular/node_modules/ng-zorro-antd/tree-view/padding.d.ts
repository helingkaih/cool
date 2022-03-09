/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { CdkTreeNodePadding } from '@angular/cdk/tree';
import * as ɵngcc0 from '@angular/core';
export declare class NzTreeNodePaddingDirective<T> extends CdkTreeNodePadding<T> {
    _indent: number;
    get level(): number;
    set level(value: number);
    get indent(): number | string;
    set indent(indent: number | string);
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NzTreeNodePaddingDirective<any>, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<NzTreeNodePaddingDirective<any>, "[nzTreeNodePadding]", never, { "level": "nzTreeNodePadding"; "indent": "nzTreeNodePaddingIndent"; }, {}, never>;
}

//# sourceMappingURL=padding.d.ts.map