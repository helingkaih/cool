/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { CdkPortalOutlet, TemplatePortal } from '@angular/cdk/portal';
import { AfterViewInit, ComponentFactoryResolver, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import * as ɵngcc0 from '@angular/core';
export declare class NzCommentAvatarDirective {
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NzCommentAvatarDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<NzCommentAvatarDirective, "nz-avatar[nz-comment-avatar]", ["nzCommentAvatar"], {}, {}, never>;
}
export declare class NzCommentContentDirective {
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NzCommentContentDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<NzCommentContentDirective, "nz-comment-content, [nz-comment-content]", ["nzCommentContent"], {}, {}, never>;
}
export declare class NzCommentActionHostDirective extends CdkPortalOutlet implements OnInit, OnDestroy, AfterViewInit {
    nzCommentActionHost?: TemplatePortal | null;
    constructor(componentFactoryResolver: ComponentFactoryResolver, viewContainerRef: ViewContainerRef);
    ngOnInit(): void;
    ngOnDestroy(): void;
    ngAfterViewInit(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NzCommentActionHostDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<NzCommentActionHostDirective, "[nzCommentActionHost]", ["nzCommentActionHost"], { "nzCommentActionHost": "nzCommentActionHost"; }, {}, never>;
}
export declare class NzCommentActionComponent implements OnInit {
    private viewContainerRef;
    implicitContent: TemplateRef<void>;
    private contentPortal;
    get content(): TemplatePortal | null;
    constructor(viewContainerRef: ViewContainerRef);
    ngOnInit(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NzCommentActionComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<NzCommentActionComponent, "nz-comment-action", ["nzCommentAction"], {}, {}, never, ["*"]>;
}

//# sourceMappingURL=comment-cells.d.ts.map