/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { CdkTreeNodeToggle } from '@angular/cdk/tree';
import { BooleanInput } from 'ng-zorro-antd/core/types';
import * as ɵngcc0 from '@angular/core';
export declare class NzTreeNodeNoopToggleDirective {
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NzTreeNodeNoopToggleDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<NzTreeNodeNoopToggleDirective, "nz-tree-node-toggle[nzTreeNodeNoopToggle], [nzTreeNodeNoopToggle]", never, {}, {}, never>;
}
export declare class NzTreeNodeToggleDirective<T> extends CdkTreeNodeToggle<T> {
    static ngAcceptInputType_recursive: BooleanInput;
    get recursive(): boolean;
    set recursive(value: boolean);
    get isExpanded(): boolean;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NzTreeNodeToggleDirective<any>, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<NzTreeNodeToggleDirective<any>, "nz-tree-node-toggle:not([nzTreeNodeNoopToggle]), [nzTreeNodeToggle]", never, { "recursive": "nzTreeNodeToggleRecursive"; }, {}, never>;
}
export declare class NzTreeNodeToggleRotateIconDirective {
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NzTreeNodeToggleRotateIconDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<NzTreeNodeToggleRotateIconDirective, "[nz-icon][nzTreeNodeToggleRotateIcon]", never, {}, {}, never>;
}
export declare class NzTreeNodeToggleActiveIconDirective {
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NzTreeNodeToggleActiveIconDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<NzTreeNodeToggleActiveIconDirective, "[nz-icon][nzTreeNodeToggleActiveIcon]", never, {}, {}, never>;
}

//# sourceMappingURL=toggle.d.ts.map