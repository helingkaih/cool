/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { __decorate, __metadata, __rest } from "tslib";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, EventEmitter, Input, Output, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { warnDeprecation } from 'ng-zorro-antd/core/logger';
import { InputBoolean } from 'ng-zorro-antd/core/util';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NzModalContentDirective } from './modal-content.directive';
import { NzModalFooterDirective } from './modal-footer.directive';
import { NzModalTitleDirective } from './modal-title.directive';
import { NzModalService } from './modal.service';
import { getConfigFromComponent } from './utils';
export class NzModalComponent {
    constructor(cdr, modal, viewContainerRef) {
        this.cdr = cdr;
        this.modal = modal;
        this.viewContainerRef = viewContainerRef;
        this.nzVisible = false;
        this.nzClosable = true;
        this.nzOkLoading = false;
        this.nzOkDisabled = false;
        this.nzCancelDisabled = false;
        this.nzCancelLoading = false;
        this.nzKeyboard = true;
        this.nzNoAnimation = false;
        this.nzCentered = false;
        this.nzZIndex = 1000;
        this.nzWidth = 520;
        this.nzCloseIcon = 'close';
        this.nzOkType = 'primary';
        this.nzOkDanger = false;
        this.nzIconType = 'question-circle'; // Confirm Modal ONLY
        this.nzModalType = 'default';
        this.nzAutofocus = 'auto';
        // TODO(@hsuanxyz) Input will not be supported
        this.nzOnOk = new EventEmitter();
        // TODO(@hsuanxyz) Input will not be supported
        this.nzOnCancel = new EventEmitter();
        this.nzAfterOpen = new EventEmitter();
        this.nzAfterClose = new EventEmitter();
        this.nzVisibleChange = new EventEmitter();
        this.modalRef = null;
        this.destroy$ = new Subject();
    }
    set modalTitle(value) {
        if (value) {
            this.setTitleWithTemplate(value);
        }
    }
    set modalFooter(value) {
        if (value) {
            this.setFooterWithTemplate(value);
        }
    }
    get afterOpen() {
        // Observable alias for nzAfterOpen
        return this.nzAfterOpen.asObservable();
    }
    get afterClose() {
        // Observable alias for nzAfterClose
        return this.nzAfterClose.asObservable();
    }
    open() {
        if (!this.nzVisible) {
            this.nzVisible = true;
            this.nzVisibleChange.emit(true);
        }
        if (!this.modalRef) {
            const config = this.getConfig();
            this.modalRef = this.modal.create(config);
            // When the modal is implicitly closed (e.g. closeAll) the nzVisible needs to be set to the correct value and emit.
            this.modalRef.afterClose
                .asObservable()
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                this.close();
            });
        }
    }
    close(result) {
        if (this.nzVisible) {
            this.nzVisible = false;
            this.nzVisibleChange.emit(false);
        }
        if (this.modalRef) {
            this.modalRef.close(result);
            this.modalRef = null;
        }
    }
    destroy(result) {
        this.close(result);
    }
    triggerOk() {
        var _a;
        (_a = this.modalRef) === null || _a === void 0 ? void 0 : _a.triggerOk();
    }
    triggerCancel() {
        var _a;
        (_a = this.modalRef) === null || _a === void 0 ? void 0 : _a.triggerCancel();
    }
    getContentComponent() {
        var _a;
        return (_a = this.modalRef) === null || _a === void 0 ? void 0 : _a.getContentComponent();
    }
    getElement() {
        var _a;
        return (_a = this.modalRef) === null || _a === void 0 ? void 0 : _a.getElement();
    }
    getModalRef() {
        return this.modalRef;
    }
    setTitleWithTemplate(templateRef) {
        this.nzTitle = templateRef;
        if (this.modalRef) {
            // If modalRef already created, set the title in next tick
            Promise.resolve().then(() => {
                this.modalRef.updateConfig({
                    nzTitle: this.nzTitle
                });
            });
        }
    }
    setFooterWithTemplate(templateRef) {
        this.nzFooter = templateRef;
        if (this.modalRef) {
            // If modalRef already created, set the footer in next tick
            Promise.resolve().then(() => {
                this.modalRef.updateConfig({
                    nzFooter: this.nzFooter
                });
            });
        }
        this.cdr.markForCheck();
    }
    getConfig() {
        const componentConfig = getConfigFromComponent(this);
        componentConfig.nzViewContainerRef = this.viewContainerRef;
        if (!this.nzContent && !this.contentFromContentChild) {
            componentConfig.nzContent = this.contentTemplateRef;
            warnDeprecation('Usage `<ng-content></ng-content>` is deprecated, which will be removed in 12.0.0. Please instead use `<ng-template nzModalContent></ng-template>` to declare the content of the modal.');
        }
        else {
            componentConfig.nzContent = this.nzContent || this.contentFromContentChild;
        }
        return componentConfig;
    }
    ngOnChanges(changes) {
        const { nzVisible } = changes, otherChanges = __rest(changes, ["nzVisible"]);
        if (Object.keys(otherChanges).length && this.modalRef) {
            this.modalRef.updateConfig(getConfigFromComponent(this));
        }
        if (nzVisible) {
            if (this.nzVisible) {
                this.open();
            }
            else {
                this.close();
            }
        }
    }
    ngOnDestroy() {
        var _a;
        (_a = this.modalRef) === null || _a === void 0 ? void 0 : _a._finishDialogClose();
        this.destroy$.next();
        this.destroy$.complete();
    }
}
NzModalComponent.decorators = [
    { type: Component, args: [{
                selector: 'nz-modal',
                exportAs: 'nzModal',
                template: `
    <ng-template>
      <ng-content></ng-content>
    </ng-template>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
NzModalComponent.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: NzModalService },
    { type: ViewContainerRef }
];
NzModalComponent.propDecorators = {
    nzMask: [{ type: Input }],
    nzMaskClosable: [{ type: Input }],
    nzCloseOnNavigation: [{ type: Input }],
    nzVisible: [{ type: Input }],
    nzClosable: [{ type: Input }],
    nzOkLoading: [{ type: Input }],
    nzOkDisabled: [{ type: Input }],
    nzCancelDisabled: [{ type: Input }],
    nzCancelLoading: [{ type: Input }],
    nzKeyboard: [{ type: Input }],
    nzNoAnimation: [{ type: Input }],
    nzCentered: [{ type: Input }],
    nzContent: [{ type: Input }],
    nzComponentParams: [{ type: Input }],
    nzFooter: [{ type: Input }],
    nzZIndex: [{ type: Input }],
    nzWidth: [{ type: Input }],
    nzWrapClassName: [{ type: Input }],
    nzClassName: [{ type: Input }],
    nzStyle: [{ type: Input }],
    nzTitle: [{ type: Input }],
    nzCloseIcon: [{ type: Input }],
    nzMaskStyle: [{ type: Input }],
    nzBodyStyle: [{ type: Input }],
    nzOkText: [{ type: Input }],
    nzCancelText: [{ type: Input }],
    nzOkType: [{ type: Input }],
    nzOkDanger: [{ type: Input }],
    nzIconType: [{ type: Input }],
    nzModalType: [{ type: Input }],
    nzAutofocus: [{ type: Input }],
    nzOnOk: [{ type: Input }, { type: Output }],
    nzOnCancel: [{ type: Input }, { type: Output }],
    nzAfterOpen: [{ type: Output }],
    nzAfterClose: [{ type: Output }],
    nzVisibleChange: [{ type: Output }],
    contentTemplateRef: [{ type: ViewChild, args: [TemplateRef, { static: true },] }],
    modalTitle: [{ type: ContentChild, args: [NzModalTitleDirective, { static: true, read: TemplateRef },] }],
    contentFromContentChild: [{ type: ContentChild, args: [NzModalContentDirective, { static: true, read: TemplateRef },] }],
    modalFooter: [{ type: ContentChild, args: [NzModalFooterDirective, { static: true, read: TemplateRef },] }]
};
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzModalComponent.prototype, "nzMask", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzModalComponent.prototype, "nzMaskClosable", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzModalComponent.prototype, "nzCloseOnNavigation", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzModalComponent.prototype, "nzVisible", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzModalComponent.prototype, "nzClosable", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzModalComponent.prototype, "nzOkLoading", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzModalComponent.prototype, "nzOkDisabled", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzModalComponent.prototype, "nzCancelDisabled", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzModalComponent.prototype, "nzCancelLoading", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzModalComponent.prototype, "nzKeyboard", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzModalComponent.prototype, "nzNoAnimation", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzModalComponent.prototype, "nzCentered", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzModalComponent.prototype, "nzOkDanger", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY29tcG9uZW50cy9tb2RhbC9tb2RhbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHOztBQUVILE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osWUFBWSxFQUNaLEtBQUssRUFHTCxNQUFNLEVBRU4sV0FBVyxFQUVYLFNBQVMsRUFDVCxnQkFBZ0IsRUFDakIsTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRTVELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUN2RCxPQUFPLEVBQWMsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUUzQyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNwRSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUdsRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUVoRSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDakQsT0FBTyxFQUFFLHNCQUFzQixFQUFFLE1BQU0sU0FBUyxDQUFDO0FBWWpELE1BQU0sT0FBTyxnQkFBZ0I7SUE2RjNCLFlBQW9CLEdBQXNCLEVBQVUsS0FBcUIsRUFBVSxnQkFBa0M7UUFBakcsUUFBRyxHQUFILEdBQUcsQ0FBbUI7UUFBVSxVQUFLLEdBQUwsS0FBSyxDQUFnQjtRQUFVLHFCQUFnQixHQUFoQixnQkFBZ0IsQ0FBa0I7UUEzRTVGLGNBQVMsR0FBWSxLQUFLLENBQUM7UUFDM0IsZUFBVSxHQUFZLElBQUksQ0FBQztRQUMzQixnQkFBVyxHQUFZ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RSxZQUFZLFNBQUMsc0JBQXNCLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUU7O0FBMURoRDtJQUFmLFlBQVksRUFBRTs7Z0RBQWtCO0FBQ2pCO0lBQWYsWUFBWSxFQUFFOzt3REFBMEI7QUFDekI7SUFBZixZQUFZLEVBQUU7OzZEQUErQjtBQUM5QjtJQUFmLFlBQVksRUFBRTs7bURBQTRCO0FBQzNCO0lBQWYsWUFBWSxFQUFFOztvREFBNEI7QUFDM0I7SUFBZixZQUFZLEVBQUU7O3FEQUE4QjtBQUM3QjtJQUFmLFlBQVksRUFBRTs7c0RBQStCO0FBQzlCO0lBQWYsWUFBWSxFQUFFOzswREFBbUM7QUFDbEM7SUFBZixZQUFZLEVBQUU7O3lEQUFrQztBQUNqQztJQUFmLFlBQVksRUFBRTs7b0RBQTRCO0FBQzNCO0lBQWYsWUFBWSxFQUFFOzt1REFBdUI7QUFDdEI7SUFBZixZQUFZLEVBQUU7O29EQUFvQjtBQWdCbkI7SUFBZixZQUFZLEVBQUU7O29EQUE2QiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9naXRodWIuY29tL05HLVpPUlJPL25nLXpvcnJvLWFudGQvYmxvYi9tYXN0ZXIvTElDRU5TRVxuICovXG5cbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFRlbXBsYXRlUmVmLFxuICBUeXBlLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdDb250YWluZXJSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE56QnV0dG9uVHlwZSB9IGZyb20gJ25nLXpvcnJvLWFudGQvYnV0dG9uJztcbmltcG9ydCB7IHdhcm5EZXByZWNhdGlvbiB9IGZyb20gJ25nLXpvcnJvLWFudGQvY29yZS9sb2dnZXInO1xuaW1wb3J0IHsgQm9vbGVhbklucHV0LCBOelNhZmVBbnkgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvdHlwZXMnO1xuaW1wb3J0IHsgSW5wdXRCb29sZWFuIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL3V0aWwnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBOek1vZGFsQ29udGVudERpcmVjdGl2ZSB9IGZyb20gJy4vbW9kYWwtY29udGVudC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgTnpNb2RhbEZvb3RlckRpcmVjdGl2ZSB9IGZyb20gJy4vbW9kYWwtZm9vdGVyLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBOek1vZGFsTGVnYWN5QVBJIH0gZnJvbSAnLi9tb2RhbC1sZWdhY3ktYXBpJztcbmltcG9ydCB7IE56TW9kYWxSZWYgfSBmcm9tICcuL21vZGFsLXJlZic7XG5pbXBvcnQgeyBOek1vZGFsVGl0bGVEaXJlY3RpdmUgfSBmcm9tICcuL21vZGFsLXRpdGxlLmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBNb2RhbEJ1dHRvbk9wdGlvbnMsIE1vZGFsT3B0aW9ucywgTW9kYWxUeXBlcywgT25DbGlja0NhbGxiYWNrLCBTdHlsZU9iamVjdExpa2UgfSBmcm9tICcuL21vZGFsLXR5cGVzJztcbmltcG9ydCB7IE56TW9kYWxTZXJ2aWNlIH0gZnJvbSAnLi9tb2RhbC5zZXJ2aWNlJztcbmltcG9ydCB7IGdldENvbmZpZ0Zyb21Db21wb25lbnQgfSBmcm9tICcuL3V0aWxzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbnotbW9kYWwnLFxuICBleHBvcnRBczogJ256TW9kYWwnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy10ZW1wbGF0ZT5cbiAgICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cbiAgICA8L25nLXRlbXBsYXRlPlxuICBgLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBOek1vZGFsQ29tcG9uZW50PFQgPSBOelNhZmVBbnksIFIgPSBOelNhZmVBbnk+IGltcGxlbWVudHMgT25DaGFuZ2VzLCBOek1vZGFsTGVnYWN5QVBJPFQsIFI+LCBPbkRlc3Ryb3kge1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpNYXNrOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uek1hc2tDbG9zYWJsZTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpDbG9zZU9uTmF2aWdhdGlvbjogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpWaXNpYmxlOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uekNsb3NhYmxlOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uek9rTG9hZGluZzogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpPa0Rpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uekNhbmNlbERpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uekNhbmNlbExvYWRpbmc6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX256S2V5Ym9hcmQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX256Tm9BbmltYXRpb246IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX256T2tEYW5nZXI6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX256Q2VudGVyZWQ6IEJvb2xlYW5JbnB1dDtcblxuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpNYXNrPzogYm9vbGVhbjtcbiAgQElucHV0KCkgQElucHV0Qm9vbGVhbigpIG56TWFza0Nsb3NhYmxlPzogYm9vbGVhbjtcbiAgQElucHV0KCkgQElucHV0Qm9vbGVhbigpIG56Q2xvc2VPbk5hdmlnYXRpb24/OiBib29sZWFuO1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpWaXNpYmxlOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBuekNsb3NhYmxlOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0KCkgQElucHV0Qm9vbGVhbigpIG56T2tMb2FkaW5nOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBuek9rRGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgQElucHV0Qm9vbGVhbigpIG56Q2FuY2VsRGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgQElucHV0Qm9vbGVhbigpIG56Q2FuY2VsTG9hZGluZzogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpLZXlib2FyZDogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBuek5vQW5pbWF0aW9uID0gZmFsc2U7XG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBuekNlbnRlcmVkID0gZmFsc2U7XG4gIEBJbnB1dCgpIG56Q29udGVudD86IHN0cmluZyB8IFRlbXBsYXRlUmVmPHt9PiB8IFR5cGU8VD47XG4gIEBJbnB1dCgpIG56Q29tcG9uZW50UGFyYW1zPzogVDtcbiAgQElucHV0KCkgbnpGb290ZXI/OiBzdHJpbmcgfCBUZW1wbGF0ZVJlZjx7fT4gfCBBcnJheTxNb2RhbEJ1dHRvbk9wdGlvbnM8VD4+IHwgbnVsbDtcbiAgQElucHV0KCkgbnpaSW5kZXg6IG51bWJlciA9IDEwMDA7XG4gIEBJbnB1dCgpIG56V2lkdGg6IG51bWJlciB8IHN0cmluZyA9IDUyMDtcbiAgQElucHV0KCkgbnpXcmFwQ2xhc3NOYW1lPzogc3RyaW5nO1xuICBASW5wdXQoKSBuekNsYXNzTmFtZT86IHN0cmluZztcbiAgQElucHV0KCkgbnpTdHlsZT86IG9iamVjdDtcbiAgQElucHV0KCkgbnpUaXRsZT86IHN0cmluZyB8IFRlbXBsYXRlUmVmPHt9PjtcbiAgQElucHV0KCkgbnpDbG9zZUljb246IHN0cmluZyB8IFRlbXBsYXRlUmVmPHZvaWQ+ID0gJ2Nsb3NlJztcbiAgQElucHV0KCkgbnpNYXNrU3R5bGU/OiBTdHlsZU9iamVjdExpa2U7XG4gIEBJbnB1dCgpIG56Qm9keVN0eWxlPzogU3R5bGVPYmplY3RMaWtlO1xuICBASW5wdXQoKSBuek9rVGV4dD86IHN0cmluZyB8IG51bGw7XG4gIEBJbnB1dCgpIG56Q2FuY2VsVGV4dD86IHN0cmluZyB8IG51bGw7XG4gIEBJbnB1dCgpIG56T2tUeXBlOiBOekJ1dHRvblR5cGUgPSAncHJpbWFyeSc7XG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBuek9rRGFuZ2VyOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIG56SWNvblR5cGU6IHN0cmluZyA9ICdxdWVzdGlvbi1jaXJjbGUnOyAvLyBDb25maXJtIE1vZGFsIE9OTFlcbiAgQElucHV0KCkgbnpNb2RhbFR5cGU6IE1vZGFsVHlwZXMgPSAnZGVmYXVsdCc7XG4gIEBJbnB1dCgpIG56QXV0b2ZvY3VzOiAnb2snIHwgJ2NhbmNlbCcgfCAnYXV0bycgfCBudWxsID0gJ2F1dG8nO1xuXG4gIC8vIFRPRE8oQGhzdWFueHl6KSBJbnB1dCB3aWxsIG5vdCBiZSBzdXBwb3J0ZWRcbiAgQElucHV0KClcbiAgQE91dHB1dCgpXG4gIHJlYWRvbmx5IG56T25PazogRXZlbnRFbWl0dGVyPFQ+IHwgT25DbGlja0NhbGxiYWNrPFQ+IHwgTnpTYWZlQW55ID0gbmV3IEV2ZW50RW1pdHRlcjxUPigpO1xuXG4gIC8vIFRPRE8oQGhzdWFueHl6KSBJbnB1dCB3aWxsIG5vdCBiZSBzdXBwb3J0ZWRcbiAgQElucHV0KClcbiAgQE91dHB1dCgpXG4gIHJlYWRvbmx5IG56T25DYW5jZWw6IEV2ZW50RW1pdHRlcjxUPiB8IE9uQ2xpY2tDYWxsYmFjazxUPiB8IE56U2FmZUFueSA9IG5ldyBFdmVudEVtaXR0ZXI8VD4oKTtcblxuICBAT3V0cHV0KCkgcmVhZG9ubHkgbnpBZnRlck9wZW4gPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG4gIEBPdXRwdXQoKSByZWFkb25seSBuekFmdGVyQ2xvc2UgPSBuZXcgRXZlbnRFbWl0dGVyPFI+KCk7XG4gIEBPdXRwdXQoKSByZWFkb25seSBuelZpc2libGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG5cbiAgQFZpZXdDaGlsZChUZW1wbGF0ZVJlZiwgeyBzdGF0aWM6IHRydWUgfSkgY29udGVudFRlbXBsYXRlUmVmITogVGVtcGxhdGVSZWY8e30+O1xuXG4gIEBDb250ZW50Q2hpbGQoTnpNb2RhbFRpdGxlRGlyZWN0aXZlLCB7IHN0YXRpYzogdHJ1ZSwgcmVhZDogVGVtcGxhdGVSZWYgfSlcbiAgc2V0IG1vZGFsVGl0bGUodmFsdWU6IFRlbXBsYXRlUmVmPE56U2FmZUFueT4pIHtcbiAgICBpZiAodmFsdWUpIHtcbiAgICAgIHRoaXMuc2V0VGl0bGVXaXRoVGVtcGxhdGUodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIEBDb250ZW50Q2hpbGQoTnpNb2RhbENvbnRlbnREaXJlY3RpdmUsIHsgc3RhdGljOiB0cnVlLCByZWFkOiBUZW1wbGF0ZVJlZiB9KVxuICBjb250ZW50RnJvbUNvbnRlbnRDaGlsZCE6IFRlbXBsYXRlUmVmPE56U2FmZUFueT47XG5cbiAgQENvbnRlbnRDaGlsZChOek1vZGFsRm9vdGVyRGlyZWN0aXZlLCB7IHN0YXRpYzogdHJ1ZSwgcmVhZDogVGVtcGxhdGVSZWYgfSlcbiAgc2V0IG1vZGFsRm9vdGVyKHZhbHVlOiBUZW1wbGF0ZVJlZjxOelNhZmVBbnk+KSB7XG4gICAgaWYgKHZhbHVlKSB7XG4gICAgICB0aGlzLnNldEZvb3RlcldpdGhUZW1wbGF0ZSh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBtb2RhbFJlZjogTnpNb2RhbFJlZiB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGRlc3Ryb3kkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBnZXQgYWZ0ZXJPcGVuKCk6IE9ic2VydmFibGU8dm9pZD4ge1xuICAgIC8vIE9ic2VydmFibGUgYWxpYXMgZm9yIG56QWZ0ZXJPcGVuXG4gICAgcmV0dXJuIHRoaXMubnpBZnRlck9wZW4uYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICBnZXQgYWZ0ZXJDbG9zZSgpOiBPYnNlcnZhYmxlPFI+IHtcbiAgICAvLyBPYnNlcnZhYmxlIGFsaWFzIGZvciBuekFmdGVyQ2xvc2VcbiAgICByZXR1cm4gdGhpcy5uekFmdGVyQ2xvc2UuYXNPYnNlcnZhYmxlKCk7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsIHByaXZhdGUgbW9kYWw6IE56TW9kYWxTZXJ2aWNlLCBwcml2YXRlIHZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYpIHt9XG5cbiAgb3BlbigpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMubnpWaXNpYmxlKSB7XG4gICAgICB0aGlzLm56VmlzaWJsZSA9IHRydWU7XG4gICAgICB0aGlzLm56VmlzaWJsZUNoYW5nZS5lbWl0KHRydWUpO1xuICAgIH1cblxuICAgIGlmICghdGhpcy5tb2RhbFJlZikge1xuICAgICAgY29uc3QgY29uZmlnID0gdGhpcy5nZXRDb25maWcoKTtcbiAgICAgIHRoaXMubW9kYWxSZWYgPSB0aGlzLm1vZGFsLmNyZWF0ZShjb25maWcpO1xuXG4gICAgICAvLyBXaGVuIHRoZSBtb2RhbCBpcyBpbXBsaWNpdGx5IGNsb3NlZCAoZS5nLiBjbG9zZUFsbCkgdGhlIG56VmlzaWJsZSBuZWVkcyB0byBiZSBzZXQgdG8gdGhlIGNvcnJlY3QgdmFsdWUgYW5kIGVtaXQuXG4gICAgICB0aGlzLm1vZGFsUmVmLmFmdGVyQ2xvc2VcbiAgICAgICAgLmFzT2JzZXJ2YWJsZSgpXG4gICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSlcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBjbG9zZShyZXN1bHQ/OiBSKTogdm9pZCB7XG4gICAgaWYgKHRoaXMubnpWaXNpYmxlKSB7XG4gICAgICB0aGlzLm56VmlzaWJsZSA9IGZhbHNlO1xuICAgICAgdGhpcy5uelZpc2libGVDaGFuZ2UuZW1pdChmYWxzZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubW9kYWxSZWYpIHtcbiAgICAgIHRoaXMubW9kYWxSZWYuY2xvc2UocmVzdWx0KTtcbiAgICAgIHRoaXMubW9kYWxSZWYgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIGRlc3Ryb3kocmVzdWx0PzogUik6IHZvaWQge1xuICAgIHRoaXMuY2xvc2UocmVzdWx0KTtcbiAgfVxuXG4gIHRyaWdnZXJPaygpOiB2b2lkIHtcbiAgICB0aGlzLm1vZGFsUmVmPy50cmlnZ2VyT2soKTtcbiAgfVxuXG4gIHRyaWdnZXJDYW5jZWwoKTogdm9pZCB7XG4gICAgdGhpcy5tb2RhbFJlZj8udHJpZ2dlckNhbmNlbCgpO1xuICB9XG5cbiAgZ2V0Q29udGVudENvbXBvbmVudCgpOiBUIHwgdm9pZCB7XG4gICAgcmV0dXJuIHRoaXMubW9kYWxSZWY/LmdldENvbnRlbnRDb21wb25lbnQoKTtcbiAgfVxuXG4gIGdldEVsZW1lbnQoKTogSFRNTEVsZW1lbnQgfCB2b2lkIHtcbiAgICByZXR1cm4gdGhpcy5tb2RhbFJlZj8uZ2V0RWxlbWVudCgpO1xuICB9XG5cbiAgZ2V0TW9kYWxSZWYoKTogTnpNb2RhbFJlZiB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLm1vZGFsUmVmO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRUaXRsZVdpdGhUZW1wbGF0ZSh0ZW1wbGF0ZVJlZjogVGVtcGxhdGVSZWY8e30+KTogdm9pZCB7XG4gICAgdGhpcy5uelRpdGxlID0gdGVtcGxhdGVSZWY7XG4gICAgaWYgKHRoaXMubW9kYWxSZWYpIHtcbiAgICAgIC8vIElmIG1vZGFsUmVmIGFscmVhZHkgY3JlYXRlZCwgc2V0IHRoZSB0aXRsZSBpbiBuZXh0IHRpY2tcbiAgICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICB0aGlzLm1vZGFsUmVmIS51cGRhdGVDb25maWcoe1xuICAgICAgICAgIG56VGl0bGU6IHRoaXMubnpUaXRsZVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2V0Rm9vdGVyV2l0aFRlbXBsYXRlKHRlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjx7fT4pOiB2b2lkIHtcbiAgICB0aGlzLm56Rm9vdGVyID0gdGVtcGxhdGVSZWY7XG4gICAgaWYgKHRoaXMubW9kYWxSZWYpIHtcbiAgICAgIC8vIElmIG1vZGFsUmVmIGFscmVhZHkgY3JlYXRlZCwgc2V0IHRoZSBmb290ZXIgaW4gbmV4dCB0aWNrXG4gICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5tb2RhbFJlZiEudXBkYXRlQ29uZmlnKHtcbiAgICAgICAgICBuekZvb3RlcjogdGhpcy5uekZvb3RlclxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRDb25maWcoKTogTW9kYWxPcHRpb25zIHtcbiAgICBjb25zdCBjb21wb25lbnRDb25maWcgPSBnZXRDb25maWdGcm9tQ29tcG9uZW50KHRoaXMpO1xuICAgIGNvbXBvbmVudENvbmZpZy5uelZpZXdDb250YWluZXJSZWYgPSB0aGlzLnZpZXdDb250YWluZXJSZWY7XG4gICAgaWYgKCF0aGlzLm56Q29udGVudCAmJiAhdGhpcy5jb250ZW50RnJvbUNvbnRlbnRDaGlsZCkge1xuICAgICAgY29tcG9uZW50Q29uZmlnLm56Q29udGVudCA9IHRoaXMuY29udGVudFRlbXBsYXRlUmVmO1xuICAgICAgd2FybkRlcHJlY2F0aW9uKFxuICAgICAgICAnVXNhZ2UgYDxuZy1jb250ZW50PjwvbmctY29udGVudD5gIGlzIGRlcHJlY2F0ZWQsIHdoaWNoIHdpbGwgYmUgcmVtb3ZlZCBpbiAxMi4wLjAuIFBsZWFzZSBpbnN0ZWFkIHVzZSBgPG5nLXRlbXBsYXRlIG56TW9kYWxDb250ZW50PjwvbmctdGVtcGxhdGU+YCB0byBkZWNsYXJlIHRoZSBjb250ZW50IG9mIHRoZSBtb2RhbC4nXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb21wb25lbnRDb25maWcubnpDb250ZW50ID0gdGhpcy5uekNvbnRlbnQgfHwgdGhpcy5jb250ZW50RnJvbUNvbnRlbnRDaGlsZDtcbiAgICB9XG4gICAgcmV0dXJuIGNvbXBvbmVudENvbmZpZztcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBjb25zdCB7IG56VmlzaWJsZSwgLi4ub3RoZXJDaGFuZ2VzIH0gPSBjaGFuZ2VzO1xuXG4gICAgaWYgKE9iamVjdC5rZXlzKG90aGVyQ2hhbmdlcykubGVuZ3RoICYmIHRoaXMubW9kYWxSZWYpIHtcbiAgICAgIHRoaXMubW9kYWxSZWYudXBkYXRlQ29uZmlnKGdldENvbmZpZ0Zyb21Db21wb25lbnQodGhpcykpO1xuICAgIH1cblxuICAgIGlmIChuelZpc2libGUpIHtcbiAgICAgIGlmICh0aGlzLm56VmlzaWJsZSkge1xuICAgICAgICB0aGlzLm9wZW4oKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLm1vZGFsUmVmPy5fZmluaXNoRGlhbG9nQ2xvc2UoKTtcbiAgICB0aGlzLmRlc3Ryb3kkLm5leHQoKTtcbiAgICB0aGlzLmRlc3Ryb3kkLmNvbXBsZXRlKCk7XG4gIH1cbn1cbiJdfQ==