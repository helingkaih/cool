/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { OnChanges, SimpleChanges } from '@angular/core';
import { NzTreeVirtualNodeData } from './node';
import { NzTreeNodeOutletDirective } from './outlet';
import { NzTreeView } from './tree';
import * as ɵngcc0 from '@angular/core';
export declare class NzTreeVirtualScrollViewComponent<T> extends NzTreeView<T> implements OnChanges {
    itemSize: number;
    readonly nodeOutlet: NzTreeNodeOutletDirective;
    readonly virtualScrollViewport: CdkVirtualScrollViewport;
    /**
     * @deprecated use `nzItemSize` instead
     * @breaking-change 12.0.0
     */
    nzNodeWidth: number;
    nzItemSize: number;
    nzMinBufferPx: number;
    nzMaxBufferPx: number;
    nodes: Array<NzTreeVirtualNodeData<T>>;
    renderNodeChanges(data: T[] | ReadonlyArray<T>): void;
    private createNode;
    ngOnChanges(changes: SimpleChanges): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NzTreeVirtualScrollViewComponent<any>, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<NzTreeVirtualScrollViewComponent<any>, "nz-tree-virtual-scroll-view", ["nzTreeVirtualScrollView"], { "nzNodeWidth": "nzNodeWidth"; "nzItemSize": "nzItemSize"; "nzMinBufferPx": "nzMinBufferPx"; "nzMaxBufferPx": "nzMaxBufferPx"; }, {}, never, never>;
}

//# sourceMappingURL=tree-virtual-scroll-view.d.ts.map