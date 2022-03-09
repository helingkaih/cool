/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NzTreeNodeComponent } from './node';
import { NzTreeView } from './tree';
import * as ɵngcc0 from '@angular/core';
export declare class NzTreeNodeIndentsComponent {
    indents: boolean[];
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NzTreeNodeIndentsComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<NzTreeNodeIndentsComponent, "nz-tree-node-indents", never, { "indents": "indents"; }, {}, never, never>;
}
export declare class NzTreeNodeIndentLineDirective<T> implements OnDestroy {
    private treeNode;
    private tree;
    private cdr;
    isLast: boolean | 'unset';
    isLeaf: boolean;
    private preNodeRef;
    private nextNodeRef;
    private currentIndents;
    private changeSubscription;
    constructor(treeNode: NzTreeNodeComponent<T>, tree: NzTreeView<T>, cdr: ChangeDetectorRef);
    private getIndents;
    private buildIndents;
    /**
     * We need to add an class name for the last child node,
     * this result can also be affected when the adjacent nodes are changed.
     */
    private checkAdjacent;
    private checkLast;
    ngOnDestroy(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NzTreeNodeIndentLineDirective<any>, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<NzTreeNodeIndentLineDirective<any>, "nz-tree-node[nzTreeNodeIndentLine]", never, {}, {}, never>;
}

//# sourceMappingURL=indent.d.ts.map