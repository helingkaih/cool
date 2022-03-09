/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { AfterViewInit } from '@angular/core';
import { NzTreeNodeOutletDirective } from './outlet';
import { NzTreeView } from './tree';
import * as ɵngcc0 from '@angular/core';
export declare class NzTreeViewComponent<T> extends NzTreeView<T> implements AfterViewInit {
    nodeOutlet: NzTreeNodeOutletDirective;
    _afterViewInit: boolean;
    ngAfterViewInit(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NzTreeViewComponent<any>, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<NzTreeViewComponent<any>, "nz-tree-view", ["nzTreeView"], {}, {}, never, never>;
}

//# sourceMappingURL=tree-view.d.ts.map