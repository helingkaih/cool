/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Input, NgZone, TemplateRef } from '@angular/core';
import { curveBasis, curveLinear, line } from 'd3-shape';
import { take } from 'rxjs/operators';
import { NzGraphEdgeType } from './interface';
export class NzGraphEdgeComponent {
    constructor(elementRef, ngZone, cdr) {
        this.elementRef = elementRef;
        this.ngZone = ngZone;
        this.cdr = cdr;
        this.line = line()
            .x(d => d.x)
            .y(d => d.y)
            .curve(curveLinear);
        this.el = this.elementRef.nativeElement;
    }
    get id() {
        var _a;
        return ((_a = this.edge) === null || _a === void 0 ? void 0 : _a.id) || `${this.edge.v}--${this.edge.w}`;
    }
    ngOnInit() {
        this.initElementStyle();
    }
    ngOnChanges(changes) {
        const { edge, customTemplate, edgeType } = changes;
        if (edge) {
            this.ngZone.onStable.pipe(take(1)).subscribe(() => {
                // Update path element if customTemplate set
                if (customTemplate) {
                    this.initElementStyle();
                }
                this.setLine();
                this.cdr.markForCheck();
            });
        }
        if (edgeType) {
            const type = this.edgeType === NzGraphEdgeType.LINE ? curveLinear : curveBasis;
            this.line = line()
                .x(d => d.x)
                .y(d => d.y)
                .curve(type);
        }
    }
    initElementStyle() {
        this.path = this.el.querySelector('path');
        this.setElementData();
    }
    setLine() {
        this.setPath(this.line(this.edge.points));
    }
    setPath(d) {
        this.path.setAttribute('d', d);
    }
    setElementData() {
        if (!this.path) {
            return;
        }
        this.path.setAttribute('id', this.id);
        this.path.setAttribute('data-edge', this.id);
        this.path.setAttribute('data-v', `${this.edge.v}`);
        this.path.setAttribute('data-w', `${this.edge.w}`);
    }
}
NzGraphEdgeComponent.decorators = [
    { type: Component, args: [{
                selector: '[nz-graph-edge]',
                template: `
    <ng-container *ngIf="customTemplate" [ngTemplateOutlet]="customTemplate" [ngTemplateOutletContext]="{ $implicit: edge }"></ng-container>
    <svg:g *ngIf="!customTemplate">
      <path class="nz-graph-edge-line" [attr.marker-end]="'url(#edge-end-arrow)'"></path>
      <svg:text class="nz-graph-edge-text" text-anchor="middle" dy="10" *ngIf="edge.label">
        <textPath [attr.href]="'#' + id" startOffset="50%">{{ edge.label }}</textPath>
      </svg:text>
    </svg:g>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
NzGraphEdgeComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: NgZone },
    { type: ChangeDetectorRef }
];
NzGraphEdgeComponent.propDecorators = {
    edge: [{ type: Input }],
    edgeType: [{ type: Input }],
    customTemplate: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhcGgtZWRnZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9jb21wb25lbnRzL2dyYXBoL2dyYXBoLWVkZ2UuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUVILE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsS0FBSyxFQUNMLE1BQU0sRUFJTixXQUFXLEVBQ1osTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsSUFBSSxFQUFFLE1BQU0sVUFBVSxDQUFDO0FBQ3pELE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN0QyxPQUFPLEVBQWUsZUFBZSxFQUFFLE1BQU0sYUFBYSxDQUFDO0FBZTNELE1BQU0sT0FBTyxvQkFBb0I7SUFtQi9CLFlBQW9CLFVBQW1DLEVBQVUsTUFBYyxFQUFVLEdBQXNCO1FBQTNGLGVBQVUsR0FBVixVQUFVLENBQXlCO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFVLFFBQUcsR0FBSCxHQUFHLENBQW1CO1FBTHZHLFNBQUksR0FBRyxJQUFJLEVBQTRCO2FBQzVDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDWCxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2FBQ1gsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBR3BCLElBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUM7SUFDMUMsQ0FBQztJQWJELElBQVcsRUFBRTs7UUFDWCxPQUFPLE9BQUEsSUFBSSxDQUFDLElBQUksMENBQUUsRUFBRSxLQUFJLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQztJQUMzRCxDQUFDO0lBYUQsUUFBUTtRQUNOLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO0lBQzFCLENBQUM7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDaEMsTUFBTSxFQUFFLElBQUksRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLEdBQUcsT0FBTyxDQUFDO1FBQ25ELElBQUksSUFBSSxFQUFFO1lBQ1IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7Z0JBQ2hELDRDQUE0QztnQkFDNUMsSUFBSSxjQUFjLEVBQUU7b0JBQ2xCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO2lCQUN6QjtnQkFFRCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7Z0JBQ2YsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUMxQixDQUFDLENBQUMsQ0FBQztTQUNKO1FBQ0QsSUFBSSxRQUFRLEVBQUU7WUFDWixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxLQUFLLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO1lBQy9FLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxFQUE0QjtpQkFDekMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDWCxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNYLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUNoQjtJQUNILENBQUM7SUFFRCxnQkFBZ0I7UUFDZCxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBRSxDQUFDO1FBQzNDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztJQUN4QixDQUFDO0lBRUQsT0FBTztRQUNMLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBRSxDQUFDLENBQUM7SUFDN0MsQ0FBQztJQUVELE9BQU8sQ0FBQyxDQUFTO1FBQ2YsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFRCxjQUFjO1FBQ1osSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUU7WUFDZCxPQUFPO1NBQ1I7UUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDN0MsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ25ELElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsRUFBRSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNyRCxDQUFDOzs7WUFuRkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxpQkFBaUI7Z0JBQzNCLFFBQVEsRUFBRTs7Ozs7Ozs7R0FRVDtnQkFDRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTthQUNoRDs7O1lBeEJDLFVBQVU7WUFFVixNQUFNO1lBSk4saUJBQWlCOzs7bUJBNEJoQixLQUFLO3VCQUNMLEtBQUs7NkJBRUwsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9naXRodWIuY29tL05HLVpPUlJPL25nLXpvcnJvLWFudGQvYmxvYi9tYXN0ZXIvTElDRU5TRVxuICovXG5cbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkNoYW5nZXMsXG4gIE9uSW5pdCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVGVtcGxhdGVSZWZcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBjdXJ2ZUJhc2lzLCBjdXJ2ZUxpbmVhciwgbGluZSB9IGZyb20gJ2QzLXNoYXBlJztcbmltcG9ydCB7IHRha2UgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBOekdyYXBoRWRnZSwgTnpHcmFwaEVkZ2VUeXBlIH0gZnJvbSAnLi9pbnRlcmZhY2UnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICdbbnotZ3JhcGgtZWRnZV0nLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJjdXN0b21UZW1wbGF0ZVwiIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImN1c3RvbVRlbXBsYXRlXCIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInsgJGltcGxpY2l0OiBlZGdlIH1cIj48L25nLWNvbnRhaW5lcj5cbiAgICA8c3ZnOmcgKm5nSWY9XCIhY3VzdG9tVGVtcGxhdGVcIj5cbiAgICAgIDxwYXRoIGNsYXNzPVwibnotZ3JhcGgtZWRnZS1saW5lXCIgW2F0dHIubWFya2VyLWVuZF09XCIndXJsKCNlZGdlLWVuZC1hcnJvdyknXCI+PC9wYXRoPlxuICAgICAgPHN2Zzp0ZXh0IGNsYXNzPVwibnotZ3JhcGgtZWRnZS10ZXh0XCIgdGV4dC1hbmNob3I9XCJtaWRkbGVcIiBkeT1cIjEwXCIgKm5nSWY9XCJlZGdlLmxhYmVsXCI+XG4gICAgICAgIDx0ZXh0UGF0aCBbYXR0ci5ocmVmXT1cIicjJyArIGlkXCIgc3RhcnRPZmZzZXQ9XCI1MCVcIj57eyBlZGdlLmxhYmVsIH19PC90ZXh0UGF0aD5cbiAgICAgIDwvc3ZnOnRleHQ+XG4gICAgPC9zdmc6Zz5cbiAgYCxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgTnpHcmFwaEVkZ2VDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uQ2hhbmdlcyB7XG4gIEBJbnB1dCgpIGVkZ2UhOiBOekdyYXBoRWRnZTtcbiAgQElucHV0KCkgZWRnZVR5cGU/OiBOekdyYXBoRWRnZVR5cGUgfCBzdHJpbmc7XG5cbiAgQElucHV0KCkgY3VzdG9tVGVtcGxhdGU/OiBUZW1wbGF0ZVJlZjx7XG4gICAgJGltcGxpY2l0OiBOekdyYXBoRWRnZTtcbiAgfT47XG5cbiAgcHVibGljIGdldCBpZCgpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmVkZ2U/LmlkIHx8IGAke3RoaXMuZWRnZS52fS0tJHt0aGlzLmVkZ2Uud31gO1xuICB9XG4gIHByaXZhdGUgZWwhOiBTVkdHRWxlbWVudDtcbiAgcHJpdmF0ZSBwYXRoITogU1ZHUGF0aEVsZW1lbnQ7XG5cbiAgcHJpdmF0ZSBsaW5lID0gbGluZTx7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0+KClcbiAgICAueChkID0+IGQueClcbiAgICAueShkID0+IGQueSlcbiAgICAuY3VydmUoY3VydmVMaW5lYXIpO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZjxTVkdHRWxlbWVudD4sIHByaXZhdGUgbmdab25lOiBOZ1pvbmUsIHByaXZhdGUgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZikge1xuICAgIHRoaXMuZWwgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuaW5pdEVsZW1lbnRTdHlsZSgpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGNvbnN0IHsgZWRnZSwgY3VzdG9tVGVtcGxhdGUsIGVkZ2VUeXBlIH0gPSBjaGFuZ2VzO1xuICAgIGlmIChlZGdlKSB7XG4gICAgICB0aGlzLm5nWm9uZS5vblN0YWJsZS5waXBlKHRha2UoMSkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIC8vIFVwZGF0ZSBwYXRoIGVsZW1lbnQgaWYgY3VzdG9tVGVtcGxhdGUgc2V0XG4gICAgICAgIGlmIChjdXN0b21UZW1wbGF0ZSkge1xuICAgICAgICAgIHRoaXMuaW5pdEVsZW1lbnRTdHlsZSgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zZXRMaW5lKCk7XG4gICAgICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICAgICAgfSk7XG4gICAgfVxuICAgIGlmIChlZGdlVHlwZSkge1xuICAgICAgY29uc3QgdHlwZSA9IHRoaXMuZWRnZVR5cGUgPT09IE56R3JhcGhFZGdlVHlwZS5MSU5FID8gY3VydmVMaW5lYXIgOiBjdXJ2ZUJhc2lzO1xuICAgICAgdGhpcy5saW5lID0gbGluZTx7IHg6IG51bWJlcjsgeTogbnVtYmVyIH0+KClcbiAgICAgICAgLngoZCA9PiBkLngpXG4gICAgICAgIC55KGQgPT4gZC55KVxuICAgICAgICAuY3VydmUodHlwZSk7XG4gICAgfVxuICB9XG5cbiAgaW5pdEVsZW1lbnRTdHlsZSgpOiB2b2lkIHtcbiAgICB0aGlzLnBhdGggPSB0aGlzLmVsLnF1ZXJ5U2VsZWN0b3IoJ3BhdGgnKSE7XG4gICAgdGhpcy5zZXRFbGVtZW50RGF0YSgpO1xuICB9XG5cbiAgc2V0TGluZSgpOiB2b2lkIHtcbiAgICB0aGlzLnNldFBhdGgodGhpcy5saW5lKHRoaXMuZWRnZS5wb2ludHMpISk7XG4gIH1cblxuICBzZXRQYXRoKGQ6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMucGF0aC5zZXRBdHRyaWJ1dGUoJ2QnLCBkKTtcbiAgfVxuXG4gIHNldEVsZW1lbnREYXRhKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5wYXRoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucGF0aC5zZXRBdHRyaWJ1dGUoJ2lkJywgdGhpcy5pZCk7XG4gICAgdGhpcy5wYXRoLnNldEF0dHJpYnV0ZSgnZGF0YS1lZGdlJywgdGhpcy5pZCk7XG4gICAgdGhpcy5wYXRoLnNldEF0dHJpYnV0ZSgnZGF0YS12JywgYCR7dGhpcy5lZGdlLnZ9YCk7XG4gICAgdGhpcy5wYXRoLnNldEF0dHJpYnV0ZSgnZGF0YS13JywgYCR7dGhpcy5lZGdlLnd9YCk7XG4gIH1cbn1cbiJdfQ==