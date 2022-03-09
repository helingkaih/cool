/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { ChangeDetectorRef, ElementRef, EventEmitter } from '@angular/core';
import { NzDropdownMenuComponent } from 'ng-zorro-antd/dropdown';
import * as ɵngcc0 from '@angular/core';
export declare class NzFilterTriggerComponent {
    private cdr;
    private elementRef;
    nzActive: boolean;
    nzDropdownMenu: NzDropdownMenuComponent;
    nzVisible: boolean;
    nzHasBackdrop: boolean;
    readonly nzVisibleChange: EventEmitter<boolean>;
    onVisibleChange(visible: boolean): void;
    onFilterClick($event: MouseEvent): void;
    hide(): void;
    show(): void;
    constructor(cdr: ChangeDetectorRef, elementRef: ElementRef);
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NzFilterTriggerComponent, never>;
    static ɵcmp: ɵngcc0.ɵɵComponentDefWithMeta<NzFilterTriggerComponent, "nz-filter-trigger", ["nzFilterTrigger"], { "nzActive": "nzActive"; "nzVisible": "nzVisible"; "nzHasBackdrop": "nzHasBackdrop"; "nzDropdownMenu": "nzDropdownMenu"; }, { "nzVisibleChange": "nzVisibleChange"; }, never, ["*"]>;
}

//# sourceMappingURL=filter-trigger.component.d.ts.map