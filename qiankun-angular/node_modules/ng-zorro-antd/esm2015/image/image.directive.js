import { __decorate, __metadata } from "tslib";
/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { Directionality } from '@angular/cdk/bidi';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Directive, ElementRef, Inject, Input, Optional } from '@angular/core';
import { NzConfigService, WithConfig } from 'ng-zorro-antd/core/config';
import { InputBoolean } from 'ng-zorro-antd/core/util';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NzImageGroupComponent } from './image-group.component';
import { NzImageService } from './image.service';
const NZ_CONFIG_MODULE_NAME = 'image';
export class NzImageDirective {
    constructor(document, nzConfigService, elementRef, nzImageService, cdr, parentGroup, directionality) {
        this.document = document;
        this.nzConfigService = nzConfigService;
        this.elementRef = elementRef;
        this.nzImageService = nzImageService;
        this.cdr = cdr;
        this.parentGroup = parentGroup;
        this.directionality = directionality;
        this._nzModuleName = NZ_CONFIG_MODULE_NAME;
        this.nzSrc = '';
        this.nzDisablePreview = false;
        this.nzFallback = null;
        this.nzPlaceholder = null;
        this.status = 'normal';
        this.destroy$ = new Subject();
    }
    get previewable() {
        return !this.nzDisablePreview && this.status !== 'error';
    }
    ngOnInit() {
        var _a;
        this.backLoad();
        if (this.parentGroup) {
            this.parentGroup.addImage(this);
        }
        if (this.directionality) {
            (_a = this.directionality.change) === null || _a === void 0 ? void 0 : _a.pipe(takeUntil(this.destroy$)).subscribe((direction) => {
                this.dir = direction;
                this.cdr.detectChanges();
            });
            this.dir = this.directionality.value;
        }
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    onPreview() {
        if (!this.previewable) {
            return;
        }
        if (this.parentGroup) {
            // preview inside image group
            const previewAbleImages = this.parentGroup.images.filter(e => e.previewable);
            const previewImages = previewAbleImages.map(e => ({ src: e.nzSrc }));
            const previewIndex = previewAbleImages.findIndex(el => this === el);
            const previewRef = this.nzImageService.preview(previewImages, { nzDirection: this.dir });
            previewRef.switchTo(previewIndex);
        }
        else {
            // preview not inside image group
            const previewImages = [{ src: this.nzSrc }];
            this.nzImageService.preview(previewImages, { nzDirection: this.dir });
        }
    }
    getElement() {
        return this.elementRef;
    }
    ngOnChanges(changes) {
        const { nzSrc } = changes;
        if (nzSrc) {
            this.getElement().nativeElement.src = nzSrc.currentValue;
            this.backLoad();
        }
    }
    /**
     * use internal Image object handle fallback & placeholder
     * @private
     */
    backLoad() {
        this.backLoadImage = this.document.createElement('img');
        this.backLoadImage.src = this.nzSrc;
        this.status = 'loading';
        if (this.backLoadImage.complete) {
            this.status = 'normal';
            this.getElement().nativeElement.src = this.nzSrc;
        }
        else {
            if (this.nzPlaceholder) {
                this.getElement().nativeElement.src = this.nzPlaceholder;
            }
            else {
                this.getElement().nativeElement.src = this.nzSrc;
            }
            this.backLoadImage.onload = () => {
                this.status = 'normal';
                this.getElement().nativeElement.src = this.nzSrc;
            };
            this.backLoadImage.onerror = () => {
                this.status = 'error';
                if (this.nzFallback) {
                    this.getElement().nativeElement.src = this.nzFallback;
                }
            };
        }
    }
}
NzImageDirective.decorators = [
    { type: Directive, args: [{
                selector: 'img[nz-image]',
                exportAs: 'nzImage',
                host: {
                    '(click)': 'onPreview()'
                }
            },] }
];
NzImageDirective.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
    { type: NzConfigService },
    { type: ElementRef },
    { type: NzImageService },
    { type: ChangeDetectorRef },
    { type: NzImageGroupComponent, decorators: [{ type: Optional }] },
    { type: Directionality, decorators: [{ type: Optional }] }
];
NzImageDirective.propDecorators = {
    nzSrc: [{ type: Input }],
    nzDisablePreview: [{ type: Input }],
    nzFallback: [{ type: Input }],
    nzPlaceholder: [{ type: Input }]
};
__decorate([
    InputBoolean(),
    WithConfig(),
    __metadata("design:type", Boolean)
], NzImageDirective.prototype, "nzDisablePreview", void 0);
__decorate([
    WithConfig(),
    __metadata("design:type", Object)
], NzImageDirective.prototype, "nzFallback", void 0);
__decorate([
    WithConfig(),
    __metadata("design:type", Object)
], NzImageDirective.prototype, "nzPlaceholder", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2UuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY29tcG9uZW50cy9pbWFnZS9pbWFnZS5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7R0FHRztBQUNILE9BQU8sRUFBYSxjQUFjLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUM5RCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUNMLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsVUFBVSxFQUNWLE1BQU0sRUFDTixLQUFLLEVBSUwsUUFBUSxFQUVULE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBZSxlQUFlLEVBQUUsVUFBVSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFFckYsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3ZELE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0IsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRTNDLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ2hFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUVqRCxNQUFNLHFCQUFxQixHQUFnQixPQUFPLENBQUM7QUFXbkQsTUFBTSxPQUFPLGdCQUFnQjtJQW1CM0IsWUFDNEIsUUFBbUIsRUFDdEMsZUFBZ0MsRUFDL0IsVUFBc0IsRUFDdEIsY0FBOEIsRUFDNUIsR0FBc0IsRUFDWixXQUFrQyxFQUNsQyxjQUE4QjtRQU54QixhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ3RDLG9CQUFlLEdBQWYsZUFBZSxDQUFpQjtRQUMvQixlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ3RCLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUM1QixRQUFHLEdBQUgsR0FBRyxDQUFtQjtRQUNaLGdCQUFXLEdBQVgsV0FBVyxDQUF1QjtRQUNsQyxtQkFBYyxHQUFkLGNBQWMsQ0FBZ0I7UUF6QjNDLGtCQUFhLEdBQWdCLHFCQUFxQixDQUFDO1FBSW5ELFVBQUssR0FBRyxFQUFFLENBQUM7UUFDbUIscUJBQWdCLEdBQVksS0FBSyxDQUFDO1FBQ2xELGVBQVUsR0FBa0IsSUFBSSxDQUFDO1FBQ2pDLGtCQUFhLEdBQWtCLElBQUksQ0FBQztRQUluRCxXQUFNLEdBQW9CLFFBQVEsQ0FBQztRQUNuQyxhQUFRLEdBQWtCLElBQUksT0FBTyxFQUFFLENBQUM7SUFjN0MsQ0FBQztJQVpKLElBQUksV0FBVztRQUNiLE9BQU8sQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLElBQUksSUFBSSxDQUFDLE1BQU0sS0FBSyxPQUFPLENBQUM7SUFDM0QsQ0FBQztJQVlELFFBQVE7O1FBQ04sSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ2hCLElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNwQixJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNqQztRQUNELElBQUksSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUN2QixNQUFBLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSwwQ0FBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxTQUFTLENBQUMsQ0FBQyxTQUFvQixFQUFFLEVBQUU7Z0JBQzVGLElBQUksQ0FBQyxHQUFHLEdBQUcsU0FBUyxDQUFDO2dCQUNyQixJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQzNCLENBQUMsRUFBRTtZQUNILElBQUksQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUM7U0FDdEM7SUFDSCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMzQixDQUFDO0lBRUQsU0FBUztRQUNQLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO1lBQ3JCLE9BQU87U0FDUjtRQUVELElBQUksSUFBSSxDQUFDLFdBQVcsRUFBRTtZQUNwQiw2QkFBNkI7WUFDN0IsTUFBTSxpQkFBaUIsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDN0UsTUFBTSxhQUFhLEdBQUcsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ3JFLE1BQU0sWUFBWSxHQUFHLGlCQUFpQixDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsQ0FBQztZQUNwRSxNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsRUFBRSxXQUFXLEVBQUUsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7WUFDekYsVUFBVSxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsQ0FBQztTQUNuQzthQUFNO1lBQ0wsaUNBQWlDO1lBQ2pDLE1BQU0sYUFBYSxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUM7WUFDNUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO1NBQ3ZFO0lBQ0gsQ0FBQztJQUVELFVBQVU7UUFDUixPQUFPLElBQUksQ0FBQyxVQUFVLENBQUM7SUFDekIsQ0FBQztJQUVELFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsT0FBTyxDQUFDO1FBQzFCLElBQUksS0FBSyxFQUFFO1lBQ1QsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDLFlBQVksQ0FBQztZQUN6RCxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7U0FDakI7SUFDSCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0ssUUFBUTtRQUNkLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDeEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztRQUNwQyxJQUFJLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztRQUV4QixJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsUUFBUSxFQUFFO1lBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUcsUUFBUSxDQUFDO1lBQ3ZCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxhQUFhLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7U0FDbEQ7YUFBTTtZQUNMLElBQUksSUFBSSxDQUFDLGFBQWEsRUFBRTtnQkFDdEIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQzthQUMxRDtpQkFBTTtnQkFDTCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsYUFBYSxDQUFDLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO2FBQ2xEO1lBRUQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsR0FBRyxFQUFFO2dCQUMvQixJQUFJLENBQUMsTUFBTSxHQUFHLFFBQVEsQ0FBQztnQkFDdkIsSUFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUNuRCxDQUFDLENBQUM7WUFFRixJQUFJLENBQUMsYUFBYSxDQUFDLE9BQU8sR0FBRyxHQUFHLEVBQUU7Z0JBQ2hDLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDO2dCQUN0QixJQUFJLElBQUksQ0FBQyxVQUFVLEVBQUU7b0JBQ25CLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQyxhQUFhLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7aUJBQ3ZEO1lBQ0gsQ0FBQyxDQUFDO1NBQ0g7SUFDSCxDQUFDOzs7WUFySEYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxlQUFlO2dCQUN6QixRQUFRLEVBQUUsU0FBUztnQkFDbkIsSUFBSSxFQUFFO29CQUNKLFNBQVMsRUFBRSxhQUFhO2lCQUN6QjthQUNGOzs7NENBcUJJLE1BQU0sU0FBQyxRQUFRO1lBeENFLGVBQWU7WUFUbkMsVUFBVTtZQWdCSCxjQUFjO1lBbEJyQixpQkFBaUI7WUFpQlYscUJBQXFCLHVCQXVDekIsUUFBUTtZQTNETyxjQUFjLHVCQTREN0IsUUFBUTs7O29CQXJCVixLQUFLOytCQUNMLEtBQUs7eUJBQ0wsS0FBSzs0QkFDTCxLQUFLOztBQUZpQztJQUE3QixZQUFZLEVBQUU7SUFBRSxVQUFVLEVBQUU7OzBEQUFtQztBQUNsRDtJQUFiLFVBQVUsRUFBRTs7b0RBQWtDO0FBQ2pDO0lBQWIsVUFBVSxFQUFFOzt1REFBcUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9ORy1aT1JSTy9uZy16b3Jyby1hbnRkL2Jsb2IvbWFzdGVyL0xJQ0VOU0VcbiAqL1xuaW1wb3J0IHsgRGlyZWN0aW9uLCBEaXJlY3Rpb25hbGl0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBTaW1wbGVDaGFuZ2VzXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTnpDb25maWdLZXksIE56Q29uZmlnU2VydmljZSwgV2l0aENvbmZpZyB9IGZyb20gJ25nLXpvcnJvLWFudGQvY29yZS9jb25maWcnO1xuaW1wb3J0IHsgQm9vbGVhbklucHV0LCBOelNhZmVBbnkgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvdHlwZXMnO1xuaW1wb3J0IHsgSW5wdXRCb29sZWFuIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL3V0aWwnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBOekltYWdlR3JvdXBDb21wb25lbnQgfSBmcm9tICcuL2ltYWdlLWdyb3VwLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOekltYWdlU2VydmljZSB9IGZyb20gJy4vaW1hZ2Uuc2VydmljZSc7XG5cbmNvbnN0IE5aX0NPTkZJR19NT0RVTEVfTkFNRTogTnpDb25maWdLZXkgPSAnaW1hZ2UnO1xuXG5leHBvcnQgdHlwZSBJbWFnZVN0YXR1c1R5cGUgPSAnZXJyb3InIHwgJ2xvYWRpbmcnIHwgJ25vcm1hbCc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ2ltZ1tuei1pbWFnZV0nLFxuICBleHBvcnRBczogJ256SW1hZ2UnLFxuICBob3N0OiB7XG4gICAgJyhjbGljayknOiAnb25QcmV2aWV3KCknXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTnpJbWFnZURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xuICByZWFkb25seSBfbnpNb2R1bGVOYW1lOiBOekNvbmZpZ0tleSA9IE5aX0NPTkZJR19NT0RVTEVfTkFNRTtcblxuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpEaXNhYmxlUHJldmlldzogQm9vbGVhbklucHV0O1xuXG4gIEBJbnB1dCgpIG56U3JjID0gJyc7XG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBAV2l0aENvbmZpZygpIG56RGlzYWJsZVByZXZpZXc6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgQFdpdGhDb25maWcoKSBuekZhbGxiYWNrOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgQFdpdGhDb25maWcoKSBuelBsYWNlaG9sZGVyOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcblxuICBkaXI/OiBEaXJlY3Rpb247XG4gIGJhY2tMb2FkSW1hZ2UhOiBIVE1MSW1hZ2VFbGVtZW50O1xuICBwcml2YXRlIHN0YXR1czogSW1hZ2VTdGF0dXNUeXBlID0gJ25vcm1hbCc7XG4gIHByaXZhdGUgZGVzdHJveSQ6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdCgpO1xuXG4gIGdldCBwcmV2aWV3YWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gIXRoaXMubnpEaXNhYmxlUHJldmlldyAmJiB0aGlzLnN0YXR1cyAhPT0gJ2Vycm9yJztcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IE56U2FmZUFueSxcbiAgICBwdWJsaWMgbnpDb25maWdTZXJ2aWNlOiBOekNvbmZpZ1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHByaXZhdGUgbnpJbWFnZVNlcnZpY2U6IE56SW1hZ2VTZXJ2aWNlLFxuICAgIHByb3RlY3RlZCBjZHI6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgcGFyZW50R3JvdXA6IE56SW1hZ2VHcm91cENvbXBvbmVudCxcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIGRpcmVjdGlvbmFsaXR5OiBEaXJlY3Rpb25hbGl0eVxuICApIHt9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5iYWNrTG9hZCgpO1xuICAgIGlmICh0aGlzLnBhcmVudEdyb3VwKSB7XG4gICAgICB0aGlzLnBhcmVudEdyb3VwLmFkZEltYWdlKHRoaXMpO1xuICAgIH1cbiAgICBpZiAodGhpcy5kaXJlY3Rpb25hbGl0eSkge1xuICAgICAgdGhpcy5kaXJlY3Rpb25hbGl0eS5jaGFuZ2U/LnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKS5zdWJzY3JpYmUoKGRpcmVjdGlvbjogRGlyZWN0aW9uKSA9PiB7XG4gICAgICAgIHRoaXMuZGlyID0gZGlyZWN0aW9uO1xuICAgICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuZGlyID0gdGhpcy5kaXJlY3Rpb25hbGl0eS52YWx1ZTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmRlc3Ryb3kkLm5leHQoKTtcbiAgICB0aGlzLmRlc3Ryb3kkLmNvbXBsZXRlKCk7XG4gIH1cblxuICBvblByZXZpZXcoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnByZXZpZXdhYmxlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKHRoaXMucGFyZW50R3JvdXApIHtcbiAgICAgIC8vIHByZXZpZXcgaW5zaWRlIGltYWdlIGdyb3VwXG4gICAgICBjb25zdCBwcmV2aWV3QWJsZUltYWdlcyA9IHRoaXMucGFyZW50R3JvdXAuaW1hZ2VzLmZpbHRlcihlID0+IGUucHJldmlld2FibGUpO1xuICAgICAgY29uc3QgcHJldmlld0ltYWdlcyA9IHByZXZpZXdBYmxlSW1hZ2VzLm1hcChlID0+ICh7IHNyYzogZS5uelNyYyB9KSk7XG4gICAgICBjb25zdCBwcmV2aWV3SW5kZXggPSBwcmV2aWV3QWJsZUltYWdlcy5maW5kSW5kZXgoZWwgPT4gdGhpcyA9PT0gZWwpO1xuICAgICAgY29uc3QgcHJldmlld1JlZiA9IHRoaXMubnpJbWFnZVNlcnZpY2UucHJldmlldyhwcmV2aWV3SW1hZ2VzLCB7IG56RGlyZWN0aW9uOiB0aGlzLmRpciB9KTtcbiAgICAgIHByZXZpZXdSZWYuc3dpdGNoVG8ocHJldmlld0luZGV4KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gcHJldmlldyBub3QgaW5zaWRlIGltYWdlIGdyb3VwXG4gICAgICBjb25zdCBwcmV2aWV3SW1hZ2VzID0gW3sgc3JjOiB0aGlzLm56U3JjIH1dO1xuICAgICAgdGhpcy5uekltYWdlU2VydmljZS5wcmV2aWV3KHByZXZpZXdJbWFnZXMsIHsgbnpEaXJlY3Rpb246IHRoaXMuZGlyIH0pO1xuICAgIH1cbiAgfVxuXG4gIGdldEVsZW1lbnQoKTogRWxlbWVudFJlZjxIVE1MSW1hZ2VFbGVtZW50PiB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudFJlZjtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBjb25zdCB7IG56U3JjIH0gPSBjaGFuZ2VzO1xuICAgIGlmIChuelNyYykge1xuICAgICAgdGhpcy5nZXRFbGVtZW50KCkubmF0aXZlRWxlbWVudC5zcmMgPSBuelNyYy5jdXJyZW50VmFsdWU7XG4gICAgICB0aGlzLmJhY2tMb2FkKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIHVzZSBpbnRlcm5hbCBJbWFnZSBvYmplY3QgaGFuZGxlIGZhbGxiYWNrICYgcGxhY2Vob2xkZXJcbiAgICogQHByaXZhdGVcbiAgICovXG4gIHByaXZhdGUgYmFja0xvYWQoKTogdm9pZCB7XG4gICAgdGhpcy5iYWNrTG9hZEltYWdlID0gdGhpcy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICB0aGlzLmJhY2tMb2FkSW1hZ2Uuc3JjID0gdGhpcy5uelNyYztcbiAgICB0aGlzLnN0YXR1cyA9ICdsb2FkaW5nJztcblxuICAgIGlmICh0aGlzLmJhY2tMb2FkSW1hZ2UuY29tcGxldGUpIHtcbiAgICAgIHRoaXMuc3RhdHVzID0gJ25vcm1hbCc7XG4gICAgICB0aGlzLmdldEVsZW1lbnQoKS5uYXRpdmVFbGVtZW50LnNyYyA9IHRoaXMubnpTcmM7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLm56UGxhY2Vob2xkZXIpIHtcbiAgICAgICAgdGhpcy5nZXRFbGVtZW50KCkubmF0aXZlRWxlbWVudC5zcmMgPSB0aGlzLm56UGxhY2Vob2xkZXI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmdldEVsZW1lbnQoKS5uYXRpdmVFbGVtZW50LnNyYyA9IHRoaXMubnpTcmM7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYmFja0xvYWRJbWFnZS5vbmxvYWQgPSAoKSA9PiB7XG4gICAgICAgIHRoaXMuc3RhdHVzID0gJ25vcm1hbCc7XG4gICAgICAgIHRoaXMuZ2V0RWxlbWVudCgpLm5hdGl2ZUVsZW1lbnQuc3JjID0gdGhpcy5uelNyYztcbiAgICAgIH07XG5cbiAgICAgIHRoaXMuYmFja0xvYWRJbWFnZS5vbmVycm9yID0gKCkgPT4ge1xuICAgICAgICB0aGlzLnN0YXR1cyA9ICdlcnJvcic7XG4gICAgICAgIGlmICh0aGlzLm56RmFsbGJhY2spIHtcbiAgICAgICAgICB0aGlzLmdldEVsZW1lbnQoKS5uYXRpdmVFbGVtZW50LnNyYyA9IHRoaXMubnpGYWxsYmFjaztcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==