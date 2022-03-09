/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { __decorate, __metadata } from "tslib";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ElementRef, EventEmitter, Host, Input, Optional, Output, QueryList, TemplateRef, ViewChildren, ViewEncapsulation } from '@angular/core';
import { buildGraph } from 'dagre-compound';
import { forkJoin, ReplaySubject, Subject } from 'rxjs';
import { finalize, take, takeUntil } from 'rxjs/operators';
import { calculateTransform } from './core/utils';
import { NzNoAnimationDirective } from 'ng-zorro-antd/core/no-animation';
import { cancelRequestAnimationFrame } from 'ng-zorro-antd/core/polyfill';
import { InputBoolean } from 'ng-zorro-antd/core/util';
import { NzGraphData } from './data-source/graph-data-source';
import { NzGraphEdgeDirective } from './graph-edge.directive';
import { NzGraphGroupNodeDirective } from './graph-group-node.directive';
import { NzGraphNodeComponent } from './graph-node.component';
import { NzGraphNodeDirective } from './graph-node.directive';
import { NzGraphZoomDirective } from './graph-zoom.directive';
import { nzTypeDefinition, NZ_GRAPH_LAYOUT_SETTING } from './interface';
/** Checks whether an object is a data source. */
export function isDataSource(value) {
    // Check if the value is a DataSource by observing if it has a connect function. Cannot
    // be checked as an `instanceof DataSource` since people could create their own sources
    // that match the interface, but don't extend DataSource.
    return value && typeof value.connect === 'function';
}
export class NzGraphComponent {
    constructor(cdr, elementRef, noAnimation, nzGraphZoom) {
        this.cdr = cdr;
        this.elementRef = elementRef;
        this.noAnimation = noAnimation;
        this.nzGraphZoom = nzGraphZoom;
        this.nzRankDirection = 'LR';
        this.nzAutoSize = false;
        this.nzGraphInitialized = new EventEmitter();
        this.nzGraphRendered = new EventEmitter();
        this.nzNodeClick = new EventEmitter();
        this.requestId = -1;
        this.transformStyle = '';
        this.graphRenderedSubject$ = new ReplaySubject(1);
        this.renderInfo = { labelHeight: 0 };
        this.mapOfNodeAttr = {};
        this.mapOfEdgeAttr = {};
        this.zoom = 1;
        this.typedNodes = nzTypeDefinition();
        this.layoutSetting = NZ_GRAPH_LAYOUT_SETTING;
        this.destroy$ = new Subject();
        this.nodeTrackByFun = (_, node) => node.name;
        this.edgeTrackByFun = (_, edge) => `${edge.v}-${edge.w}`;
        this.subGraphTransform = (node) => {
            const x = node.x - node.coreBox.width / 2.0;
            const y = node.y - node.height / 2.0 + node.paddingTop;
            return `translate(${x}, ${y})`;
        };
        this.coreTransform = (node) => {
            return `translate(0, ${node.parentNodeName ? node.labelHeight : 0})`;
        };
    }
    ngOnInit() {
        this.graphRenderedSubject$.pipe(take(1), takeUntil(this.destroy$)).subscribe(() => {
            // Only zooming is not set, move graph to center
            if (!this.nzGraphZoom) {
                this.fitCenter();
            }
            this.nzGraphInitialized.emit(this);
        });
    }
    ngOnChanges(changes) {
        const { nzAutoFit, nzRankDirection, nzGraphData, nzGraphLayoutConfig } = changes;
        if (nzGraphLayoutConfig) {
            this.layoutSetting = this.mergeConfig(nzGraphLayoutConfig.currentValue);
        }
        if (nzGraphData) {
            if (this.dataSource !== this.nzGraphData) {
                this._switchDataSource(this.nzGraphData);
            }
        }
        if ((nzAutoFit && !nzAutoFit.firstChange) || (nzRankDirection && !nzRankDirection.firstChange)) {
            // Render graph
            if (this.dataSource.dataSource) {
                this.drawGraph(this.dataSource.dataSource, {
                    rankDirection: this.nzRankDirection,
                    expanded: this.dataSource.expansionModel.selected || []
                }).then(() => {
                    this.cdr.markForCheck();
                });
            }
        }
        this.cdr.markForCheck();
    }
    ngAfterViewInit() { }
    ngAfterContentChecked() {
        if (this.dataSource && !this._dataSubscription) {
            this.observeRenderChanges();
        }
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        if (this.dataSource && typeof this.dataSource.disconnect === 'function') {
            this.dataSource.disconnect();
        }
        if (this._dataSubscription) {
            this._dataSubscription.unsubscribe();
            this._dataSubscription = null;
        }
        cancelRequestAnimationFrame(this.requestId);
    }
    /**
     * Emit event
     */
    clickNode(node) {
        this.nzNodeClick.emit(node);
    }
    /**
     * Move graph to center and scale automatically
     */
    fitCenter() {
        const { x, y, k } = calculateTransform(this.elementRef.nativeElement.querySelector('svg'), this.elementRef.nativeElement.querySelector('svg > g'));
        if (k) {
            this.zoom = k;
            this.transformStyle = `translate(${x}, ${y})scale(${k})`;
        }
        this.cdr.markForCheck();
    }
    /**
     * re-Draw graph
     * @param data
     * @param options
     * @param needResize
     */
    drawGraph(data, options, needResize = false) {
        return new Promise(resolve => {
            this.requestId = requestAnimationFrame(() => {
                const renderInfo = this.buildGraphInfo(data, options);
                // TODO
                // Need better performance
                this.renderInfo = renderInfo;
                this.cdr.markForCheck();
                this.requestId = requestAnimationFrame(() => {
                    var _a;
                    this.drawNodes(!((_a = this.noAnimation) === null || _a === void 0 ? void 0 : _a.nzNoAnimation)).then(() => {
                        // Update element
                        this.cdr.markForCheck();
                        if (needResize) {
                            this.resizeNodeSize().then(() => {
                                const dataSource = this.dataSource.dataSource;
                                this.drawGraph(dataSource, options, false).then(() => resolve());
                            });
                        }
                        else {
                            this.graphRenderedSubject$.next();
                            this.nzGraphRendered.emit(this);
                            resolve();
                        }
                    });
                });
            });
            this.cdr.markForCheck();
        });
    }
    /**
     * Redraw all nodes
     * @param animate
     */
    drawNodes(animate = true) {
        return new Promise(resolve => {
            if (animate) {
                this.makeNodesAnimation().subscribe(() => {
                    resolve();
                });
            }
            else {
                this.listOfNodeComponent.map(node => {
                    node.makeNoAnimation();
                });
                resolve();
            }
        });
    }
    resizeNodeSize() {
        return new Promise(resolve => {
            var _a;
            const dataSource = this.dataSource.dataSource;
            let scale = ((_a = this.nzGraphZoom) === null || _a === void 0 ? void 0 : _a.nzZoom) || this.zoom || 1;
            this.listOfNodeElement.forEach(nodeEle => {
                var _a;
                const contentEle = nodeEle.nativeElement;
                if (contentEle) {
                    let width;
                    let height;
                    // Check if foreignObject is set
                    const clientRect = (_a = contentEle.querySelector('foreignObject > :first-child')) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect();
                    if (clientRect) {
                        width = clientRect.width;
                        height = clientRect.height;
                    }
                    else {
                        const bBoxRect = contentEle.getBBox();
                        width = bBoxRect.width;
                        height = bBoxRect.height;
                        // getBBox will return actual value
                        scale = 1;
                    }
                    // Element id type is string
                    const node = dataSource.nodes.find(n => `${n.id}` === nodeEle.nativeElement.id);
                    if (node && width && height) {
                        node.height = height / scale;
                        node.width = width / scale;
                    }
                }
            });
            resolve();
        });
    }
    /**
     * Switch to the provided data source by resetting the data and unsubscribing from the current
     * render change subscription if one exists. If the data source is null, interpret this by
     * clearing the node outlet. Otherwise start listening for new data.
     */
    _switchDataSource(dataSource) {
        if (this.dataSource && typeof this.dataSource.disconnect === 'function') {
            this.nzGraphData.disconnect();
        }
        if (this._dataSubscription) {
            this._dataSubscription.unsubscribe();
            this._dataSubscription = null;
        }
        this.dataSource = dataSource;
        this.observeRenderChanges();
    }
    /** Set up a subscription for the data provided by the data source. */
    observeRenderChanges() {
        let dataStream;
        let graphOptions = {
            rankDirection: this.nzRankDirection
        };
        if (isDataSource(this.dataSource)) {
            dataStream = this.dataSource.connect();
        }
        if (dataStream) {
            this._dataSubscription = dataStream.pipe(takeUntil(this.destroy$)).subscribe(data => {
                graphOptions = {
                    rankDirection: this.nzRankDirection,
                    expanded: this.nzGraphData.expansionModel.selected
                };
                this.drawGraph(data, graphOptions, this.nzAutoSize).then(() => {
                    this.cdr.detectChanges();
                });
            });
        }
        else {
            throw Error(`A valid data source must be provided.`);
        }
    }
    /**
     * Get renderInfo and prepare some data
     * @param data
     * @param options
     * @private
     */
    buildGraphInfo(data, options) {
        this.parseInfo(data);
        const renderInfo = buildGraph(data, options, this.layoutSetting);
        const dig = (nodes) => {
            nodes.forEach(node => {
                const { x, y } = node;
                node.xOffset = x;
                node.yOffset = y;
                if (node.type === 1 && this.mapOfNodeAttr.hasOwnProperty(node.name)) {
                    Object.assign(node, this.mapOfNodeAttr[node.name]);
                }
                else if (node.type === 0) {
                    node.edges.forEach(edge => {
                        if (this.mapOfEdgeAttr.hasOwnProperty(`${edge.v}-${edge.w}`)) {
                            Object.assign(edge, this.mapOfEdgeAttr[`${edge.v}-${edge.w}`]);
                        }
                    });
                    dig(node.nodes);
                }
            });
        };
        dig(renderInfo.nodes);
        // Assign data to edges of root graph
        renderInfo.edges.forEach(edge => {
            if (this.mapOfEdgeAttr.hasOwnProperty(`${edge.v}-${edge.w}`)) {
                Object.assign(edge, this.mapOfEdgeAttr[`${edge.v}-${edge.w}`]);
            }
        });
        return renderInfo;
    }
    /**
     * Play with animation
     * @private
     */
    makeNodesAnimation() {
        return forkJoin(...this.listOfNodeComponent.map(node => node.makeAnimation())).pipe(finalize(() => {
            this.cdr.detectChanges();
        }));
    }
    parseInfo(data) {
        data.nodes.forEach(n => {
            this.mapOfNodeAttr[n.id] = n;
        });
        data.edges.forEach(e => {
            this.mapOfEdgeAttr[`${e.v}-${e.w}`] = e;
        });
    }
    /**
     * Merge config with user inputs
     * @param config
     * @private
     */
    mergeConfig(config) {
        const graphMeta = (config === null || config === void 0 ? void 0 : config.layout) || {};
        const subSceneMeta = (config === null || config === void 0 ? void 0 : config.subScene) || {};
        const defaultNodeMeta = (config === null || config === void 0 ? void 0 : config.defaultNode) || {};
        const defaultCompoundNodeMeta = (config === null || config === void 0 ? void 0 : config.defaultCompoundNode) || {};
        const bridge = NZ_GRAPH_LAYOUT_SETTING.nodeSize.bridge;
        const graph = { meta: Object.assign(Object.assign({}, NZ_GRAPH_LAYOUT_SETTING.graph.meta), graphMeta) };
        const subScene = {
            meta: Object.assign(Object.assign({}, NZ_GRAPH_LAYOUT_SETTING.subScene.meta), subSceneMeta)
        };
        const nodeSize = {
            meta: Object.assign(Object.assign({}, NZ_GRAPH_LAYOUT_SETTING.nodeSize.meta), defaultCompoundNodeMeta),
            node: Object.assign(Object.assign({}, NZ_GRAPH_LAYOUT_SETTING.nodeSize.node), defaultNodeMeta),
            bridge
        };
        return { graph, subScene, nodeSize };
    }
}
NzGraphComponent.decorators = [
    { type: Component, args: [{
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                selector: 'nz-graph',
                exportAs: 'nzGraph',
                template: `
    <ng-content></ng-content>
    <svg width="100%" height="100%">
      <svg:defs nz-graph-defs></svg:defs>
      <svg:g [attr.transform]="transformStyle">
        <ng-container
          [ngTemplateOutlet]="groupTemplate"
          [ngTemplateOutletContext]="{ renderNode: renderInfo, type: 'root' }"
        ></ng-container>
      </svg:g>
    </svg>

    <ng-template #groupTemplate let-renderNode="renderNode" let-type="type">
      <svg:g [attr.transform]="type === 'sub' ? subGraphTransform(renderNode) : null">
        <svg:g class="core" [attr.transform]="coreTransform(renderNode)">
          <svg:g class="nz-graph-edges">
            <ng-container *ngFor="let edge of renderNode.edges; trackBy: edgeTrackByFun">
              <g
                class="nz-graph-edge"
                nz-graph-edge
                [edge]="edge"
                [edgeType]="nzGraphLayoutConfig?.defaultEdge?.type"
                [customTemplate]="customGraphEdgeTemplate"
              ></g>
            </ng-container>
          </svg:g>

          <svg:g class="nz-graph-nodes">
            <ng-container *ngFor="let node of typedNodes(renderNode.nodes); trackBy: nodeTrackByFun">
              <g
                *ngIf="node.type === 1"
                class="nz-graph-node"
                nz-graph-node
                [node]="node"
                [customTemplate]="nodeTemplate"
                (nodeClick)="clickNode($event)"
              ></g>
              <g
                *ngIf="node.type === 0"
                class="nz-graph-node"
                nz-graph-node
                [node]="node"
                [customTemplate]="groupNodeTemplate"
                (nodeClick)="clickNode($event)"
              ></g>
              <ng-container
                *ngIf="node.expanded"
                [ngTemplateOutlet]="groupTemplate"
                [ngTemplateOutletContext]="{ renderNode: node, type: 'sub' }"
              ></ng-container>
            </ng-container>
          </svg:g>
        </svg:g>
      </svg:g>
    </ng-template>
  `,
                host: {
                    '[class.nz-graph]': 'true',
                    '[class.nz-graph-auto-size]': 'nzAutoSize'
                }
            },] }
];
NzGraphComponent.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: ElementRef },
    { type: NzNoAnimationDirective, decorators: [{ type: Host }, { type: Optional }] },
    { type: NzGraphZoomDirective, decorators: [{ type: Optional }] }
];
NzGraphComponent.propDecorators = {
    listOfNodeElement: [{ type: ViewChildren, args: [NzGraphNodeComponent, { read: ElementRef },] }],
    listOfNodeComponent: [{ type: ViewChildren, args: [NzGraphNodeComponent,] }],
    nodeTemplate: [{ type: ContentChild, args: [NzGraphNodeDirective, { static: true, read: TemplateRef },] }],
    groupNodeTemplate: [{ type: ContentChild, args: [NzGraphGroupNodeDirective, { static: true, read: TemplateRef },] }],
    customGraphEdgeTemplate: [{ type: ContentChild, args: [NzGraphEdgeDirective, { static: true, read: TemplateRef },] }],
    nzGraphData: [{ type: Input }],
    nzRankDirection: [{ type: Input }],
    nzGraphLayoutConfig: [{ type: Input }],
    nzAutoSize: [{ type: Input }],
    nzGraphInitialized: [{ type: Output }],
    nzGraphRendered: [{ type: Output }],
    nzNodeClick: [{ type: Output }]
};
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzGraphComponent.prototype, "nzAutoSize", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ3JhcGguY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY29tcG9uZW50cy9ncmFwaC9ncmFwaC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHOztBQUVILE9BQU8sRUFHTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osVUFBVSxFQUNWLFlBQVksRUFDWixJQUFJLEVBQ0osS0FBSyxFQUlMLFFBQVEsRUFDUixNQUFNLEVBQ04sU0FBUyxFQUVULFdBQVcsRUFDWCxZQUFZLEVBQ1osaUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUU1QyxPQUFPLEVBQUUsUUFBUSxFQUFjLGFBQWEsRUFBRSxPQUFPLEVBQWdCLE1BQU0sTUFBTSxDQUFDO0FBQ2xGLE9BQU8sRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzNELE9BQU8sRUFBRSxrQkFBa0IsRUFBRSxNQUFNLGNBQWMsQ0FBQztBQUVsRCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUN6RSxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUUxRSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFFdkQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQzlELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzlELE9BQU8sRUFBRSx5QkFBeUIsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQ3pFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzlELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzlELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQzlELE9BQU8sRUFXTCxnQkFBZ0IsRUFDaEIsdUJBQXVCLEVBQ3hCLE1BQU0sYUFBYSxDQUFDO0FBRXJCLGlEQUFpRDtBQUNqRCxNQUFNLFVBQVUsWUFBWSxDQUFDLEtBQWdCO0lBQzNDLHVGQUF1RjtJQUN2Rix1RkFBdUY7SUFDdkYseURBQXlEO0lBQ3pELE9BQU8sS0FBSyxJQUFJLE9BQU8sS0FBSyxDQUFDLE9BQU8sS0FBSyxVQUFVLENBQUM7QUFDdEQsQ0FBQztBQW9FRCxNQUFNLE9BQU8sZ0JBQWdCO0lBd0QzQixZQUNVLEdBQXNCLEVBQ3RCLFVBQXNCLEVBQ0gsV0FBb0MsRUFDNUMsV0FBa0M7UUFIN0MsUUFBRyxHQUFILEdBQUcsQ0FBbUI7UUFDdEIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUNILGdCQUFXLEdBQVgsV0FBVyxDQUF5QjtRQUM1QyxnQkFBVyxHQUFYLFdBQVcsQ0FBdUI7UUF4QzlDLG9CQUFlLEdBQW9CLElBQUksQ0FBQztRQUV4QixlQUFVLEdBQUcsS0FBSyxDQUFDO1FBRXpCLHVCQUFrQixHQUFHLElBQUksWUFBWSxFQUFvQixDQUFDO1FBQzFELG9CQUFlLEdBQUcsSUFBSSxZQUFZLEVBQW9CLENBQUM7UUFDdkQsZ0JBQVcsR0FBaUQsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUVsRyxjQUFTLEdBQVcsQ0FBQyxDQUFDLENBQUM7UUFDdkIsbUJBQWMsR0FBRyxFQUFFLENBQUM7UUFDcEIsMEJBQXFCLEdBQUcsSUFBSSxhQUFhLENBQU8sQ0FBQyxDQUFDLENBQUM7UUFDbkQsZUFBVSxHQUFxQixFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQXNCLENBQUM7UUFDdEUsa0JBQWEsR0FBc0MsRUFBRSxDQUFDO1FBQ3RELGtCQUFhLEdBQXNDLEVBQUUsQ0FBQztRQUN0RCxTQUFJLEdBQUcsQ0FBQyxDQUFDO1FBRU8sZUFBVSxHQUFHLGdCQUFnQixFQUF5QyxDQUFDO1FBRS9FLGtCQUFhLEdBQW9CLHVCQUF1QixDQUFDO1FBR3pELGFBQVEsR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBRXZDLG1CQUFjLEdBQUcsQ0FBQyxDQUFTLEVBQUUsSUFBb0MsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztRQUNoRixtQkFBYyxHQUFHLENBQUMsQ0FBUyxFQUFFLElBQWlCLEVBQUUsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFFekUsc0JBQWlCLEdBQUcsQ0FBQyxJQUFzQixFQUFFLEVBQUU7WUFDN0MsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUM7WUFDNUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxHQUFHLEdBQUcsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDO1lBQ3ZELE9BQU8sYUFBYSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUM7UUFDakMsQ0FBQyxDQUFDO1FBRUYsa0JBQWEsR0FBRyxDQUFDLElBQXNCLEVBQUUsRUFBRTtZQUN6QyxPQUFPLGdCQUFnQixJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztRQUN2RSxDQUFDLENBQUM7SUFPQyxDQUFDO0lBRUosUUFBUTtRQUNOLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO1lBQ2hGLGdEQUFnRDtZQUNoRCxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDckIsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO2FBQ2xCO1lBQ0QsSUFBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxXQUFXLENBQUMsT0FBc0I7UUFDaEMsTUFBTSxFQUFFLFNBQVMsRUFBRSxlQUFlLEVBQUUsV0FBVyxFQUFFLG1CQUFtQixFQUFFLEdBQUcsT0FBTyxDQUFDO1FBQ2pGLElBQUksbUJBQW1CLEVBQUU7WUFDdkIsSUFBSSxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLG1CQUFtQixDQUFDLFlBQVksQ0FBQyxDQUFDO1NBQ3pFO1FBRUQsSUFBSSxXQUFXLEVBQUU7WUFDZixJQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssSUFBSSxDQUFDLFdBQVcsRUFBRTtnQkFDeEMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQzthQUMxQztTQUNGO1FBRUQsSUFBSSxDQUFDLFNBQVMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGVBQWUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsRUFBRTtZQUM5RixlQUFlO1lBQ2YsSUFBSSxJQUFJLENBQUMsVUFBVyxDQUFDLFVBQVUsRUFBRTtnQkFDL0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsVUFBVyxDQUFDLFVBQVUsRUFBRTtvQkFDMUMsYUFBYSxFQUFFLElBQUksQ0FBQyxlQUFlO29CQUNuQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFVBQVcsQ0FBQyxjQUFjLENBQUMsUUFBUSxJQUFJLEVBQUU7aUJBQ3pELENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO29CQUNYLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLENBQUM7Z0JBQzFCLENBQUMsQ0FBQyxDQUFDO2FBQ0o7U0FDRjtRQUVELElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDMUIsQ0FBQztJQUVELGVBQWUsS0FBVSxDQUFDO0lBRTFCLHFCQUFxQjtRQUNuQixJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUU7WUFDOUMsSUFBSSxDQUFDLG9CQUFvQixFQUFFLENBQUM7U0FDN0I7SUFDSCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUV6QixJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVUsS0FBSyxVQUFVLEVBQUU7WUFDdkUsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEVBQUUsQ0FBQztTQUM5QjtRQUVELElBQUksSUFBSSxDQUFDLGlCQUFpQixFQUFFO1lBQzFCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNyQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO1NBQy9CO1FBQ0QsMkJBQTJCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRDs7T0FFRztJQUNILFNBQVMsQ0FBQyxJQUFvQztRQUM1QyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBRUQ7O09BRUc7SUFDSCxTQUFTO1FBQ1AsTUFBTSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsa0JBQWtCLENBQ3BDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFDbEQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxDQUN0RCxDQUFDO1FBQ0gsSUFBSSxDQUFDLEVBQUU7WUFDTCxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztZQUNkLElBQUksQ0FBQyxjQUFjLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDO1NBQzFEO1FBQ0QsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUMxQixDQUFDO0lBRUQ7Ozs7O09BS0c7SUFDSCxTQUFTLENBQUMsSUFBb0IsRUFBRSxPQUFzQixFQUFFLGFBQXNCLEtBQUs7UUFDakYsT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUMzQixJQUFJLENBQUMsU0FBUyxHQUFHLHFCQUFxQixDQUFDLEdBQUcsRUFBRTtnQkFDMUMsTUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsT0FBTyxDQUFDLENBQUM7Z0JBQ3RELE9BQU87Z0JBQ1AsMEJBQTBCO2dCQUMxQixJQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQztnQkFDN0IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsQ0FBQztnQkFDeEIsSUFBSSxDQUFDLFNBQVMsR0FBRyxxQkFBcUIsQ0FBQyxHQUFHLEVBQUU7O29CQUMxQyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQUMsSUFBSSxDQUFDLFdBQVcsMENBQUUsYUFBYSxDQUFBLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO3dCQUN6RCxpQkFBaUI7d0JBQ2pCLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLENBQUM7d0JBQ3hCLElBQUksVUFBVSxFQUFFOzRCQUNkLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO2dDQUM5QixNQUFNLFVBQVUsR0FBbUIsSUFBSSxDQUFDLFVBQVcsQ0FBQyxVQUFXLENBQUM7Z0NBQ2hFLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQzs0QkFDbkUsQ0FBQyxDQUFDLENBQUM7eUJBQ0o7NkJBQU07NEJBQ0wsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksRUFBRSxDQUFDOzRCQUNsQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs0QkFDaEMsT0FBTyxFQUFFLENBQUM7eUJBQ1g7b0JBQ0gsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztZQUNILElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDMUIsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsU0FBUyxDQUFDLFVBQW1CLElBQUk7UUFDL0IsT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUMzQixJQUFJLE9BQU8sRUFBRTtnQkFDWCxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO29CQUN2QyxPQUFPLEVBQUUsQ0FBQztnQkFDWixDQUFDLENBQUMsQ0FBQzthQUNKO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLEVBQUU7b0JBQ2xDLElBQUksQ0FBQyxlQUFlLEVBQUUsQ0FBQztnQkFDekIsQ0FBQyxDQUFDLENBQUM7Z0JBQ0gsT0FBTyxFQUFFLENBQUM7YUFDWDtRQUNILENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLGNBQWM7UUFDcEIsT0FBTyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTs7WUFDM0IsTUFBTSxVQUFVLEdBQW1CLElBQUksQ0FBQyxVQUFXLENBQUMsVUFBVyxDQUFDO1lBQ2hFLElBQUksS0FBSyxHQUFHLE9BQUEsSUFBSSxDQUFDLFdBQVcsMENBQUUsTUFBTSxLQUFJLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDO1lBQ3ZELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7O2dCQUN2QyxNQUFNLFVBQVUsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDO2dCQUN6QyxJQUFJLFVBQVUsRUFBRTtvQkFDZCxJQUFJLEtBQWEsQ0FBQztvQkFDbEIsSUFBSSxNQUFjLENBQUM7b0JBQ25CLGdDQUFnQztvQkFDaEMsTUFBTSxVQUFVLFNBQUcsVUFBVSxDQUFDLGFBQWEsQ0FBQyw4QkFBOEIsQ0FBQywwQ0FBRSxxQkFBcUIsRUFBRSxDQUFDO29CQUNyRyxJQUFJLFVBQVUsRUFBRTt3QkFDZCxLQUFLLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQzt3QkFDekIsTUFBTSxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUM7cUJBQzVCO3lCQUFNO3dCQUNMLE1BQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQyxPQUFPLEVBQUUsQ0FBQzt3QkFDdEMsS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7d0JBQ3ZCLE1BQU0sR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDO3dCQUN6QixtQ0FBbUM7d0JBQ25DLEtBQUssR0FBRyxDQUFDLENBQUM7cUJBQ1g7b0JBQ0QsNEJBQTRCO29CQUM1QixNQUFNLElBQUksR0FBRyxVQUFVLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsRUFBRSxLQUFLLE9BQU8sQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBQ2hGLElBQUksSUFBSSxJQUFJLEtBQUssSUFBSSxNQUFNLEVBQUU7d0JBQzNCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxHQUFHLEtBQUssQ0FBQzt3QkFDN0IsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLEdBQUcsS0FBSyxDQUFDO3FCQUM1QjtpQkFDRjtZQUNILENBQUMsQ0FBQyxDQUFDO1lBQ0gsT0FBTyxFQUFFLENBQUM7UUFDWixDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ssaUJBQWlCLENBQUMsVUFBdUI7UUFDL0MsSUFBSSxJQUFJLENBQUMsVUFBVSxJQUFJLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLEtBQUssVUFBVSxFQUFFO1lBQ3ZFLElBQUksQ0FBQyxXQUFXLENBQUMsVUFBVSxFQUFFLENBQUM7U0FDL0I7UUFFRCxJQUFJLElBQUksQ0FBQyxpQkFBaUIsRUFBRTtZQUMxQixJQUFJLENBQUMsaUJBQWlCLENBQUMsV0FBVyxFQUFFLENBQUM7WUFDckMsSUFBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksQ0FBQztTQUMvQjtRQUVELElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzdCLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDO0lBQzlCLENBQUM7SUFFRCxzRUFBc0U7SUFDOUQsb0JBQW9CO1FBQzFCLElBQUksVUFBa0QsQ0FBQztRQUN2RCxJQUFJLFlBQVksR0FBa0I7WUFDaEMsYUFBYSxFQUFFLElBQUksQ0FBQyxlQUFlO1NBQ3BDLENBQUM7UUFDRixJQUFJLFlBQVksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUU7WUFDakMsVUFBVSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUM7U0FDeEM7UUFFRCxJQUFJLFVBQVUsRUFBRTtZQUNkLElBQUksQ0FBQyxpQkFBaUIsR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ2xGLFlBQVksR0FBRztvQkFDYixhQUFhLEVBQUUsSUFBSSxDQUFDLGVBQWU7b0JBQ25DLFFBQVEsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLGNBQWMsQ0FBQyxRQUFRO2lCQUNuRCxDQUFDO2dCQUNGLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxJQUFJLENBQUMsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRTtvQkFDNUQsSUFBSSxDQUFDLEdBQUcsQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDM0IsQ0FBQyxDQUFDLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztTQUNKO2FBQU07WUFDTCxNQUFNLEtBQUssQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO1NBQ3REO0lBQ0gsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ssY0FBYyxDQUFDLElBQW9CLEVBQUUsT0FBc0I7UUFDakUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNyQixNQUFNLFVBQVUsR0FBRyxVQUFVLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFxQixDQUFDO1FBQ3JGLE1BQU0sR0FBRyxHQUFHLENBQUMsS0FBNEMsRUFBUSxFQUFFO1lBQ2pFLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ25CLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEdBQUcsSUFBSSxDQUFDO2dCQUN0QixJQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztnQkFDakIsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLENBQUM7Z0JBQ2pCLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxFQUFFO29CQUNuRSxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2lCQUNwRDtxQkFBTSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxFQUFFO29CQUN6QixJQUF5QixDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7d0JBQzlDLElBQUksSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFOzRCQUM1RCxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO3lCQUNoRTtvQkFDSCxDQUFDLENBQUMsQ0FBQztvQkFDSCxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2lCQUNqQjtZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDO1FBQ0YsR0FBRyxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0QixxQ0FBcUM7UUFDckMsVUFBVSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDOUIsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLGNBQWMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUU7Z0JBQzVELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7YUFDaEU7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sVUFBVSxDQUFDO0lBQ3BCLENBQUM7SUFFRDs7O09BR0c7SUFDSyxrQkFBa0I7UUFDeEIsT0FBTyxRQUFRLENBQUMsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQ2pGLFFBQVEsQ0FBQyxHQUFHLEVBQUU7WUFDWixJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsRUFBRSxDQUFDO1FBQzNCLENBQUMsQ0FBQyxDQUNILENBQUM7SUFDSixDQUFDO0lBRU8sU0FBUyxDQUFDLElBQW9CO1FBQ3BDLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3JCLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMvQixDQUFDLENBQUMsQ0FBQztRQUNILElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ3JCLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUMxQyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7OztPQUlHO0lBQ0ssV0FBVyxDQUFDLE1BQTJCO1FBQzdDLE1BQU0sU0FBUyxHQUFHLENBQUEsTUFBTSxhQUFOLE1BQU0sdUJBQU4sTUFBTSxDQUFFLE1BQU0sS0FBSSxFQUFFLENBQUM7UUFDdkMsTUFBTSxZQUFZLEdBQUcsQ0FBQSxNQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsUUFBUSxLQUFJLEVBQUUsQ0FBQztRQUM1QyxNQUFNLGVBQWUsR0FBRyxDQUFBLE1BQU0sYUFBTixNQUFNLHVCQUFOLE1BQU0sQ0FBRSxXQUFXLEtBQUksRUFBRSxDQUFDO1FBQ2xELE1BQU0sdUJBQXVCLEdBQUcsQ0FBQSxNQUFNLGFBQU4sTUFBTSx1QkFBTixNQUFNLENBQUUsbUJBQW1CLEtBQUksRUFBRSxDQUFDO1FBQ2xFLE1BQU0sTUFBTSxHQUFHLHVCQUF1QixDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7UUFFdkQsTUFBTSxLQUFLLEdBQTZCLEVBQUUsSUFBSSxrQ0FBTyx1QkFBdUIsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFLLFNBQVMsQ0FBRSxFQUFFLENBQUM7UUFDMUcsTUFBTSxRQUFRLEdBQWdDO1lBQzVDLElBQUksa0NBQU8sdUJBQXVCLENBQUMsUUFBUSxDQUFDLElBQUksR0FBSyxZQUFZLENBQUU7U0FDcEUsQ0FBQztRQUNGLE1BQU0sUUFBUSxHQUFnQztZQUM1QyxJQUFJLGtDQUFPLHVCQUF1QixDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUssdUJBQXVCLENBQUU7WUFDOUUsSUFBSSxrQ0FBTyx1QkFBdUIsQ0FBQyxRQUFRLENBQUMsSUFBSSxHQUFLLGVBQWUsQ0FBRTtZQUN0RSxNQUFNO1NBQ1AsQ0FBQztRQUVGLE9BQU8sRUFBRSxLQUFLLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxDQUFDO0lBQ3ZDLENBQUM7OztZQXRhRixTQUFTLFNBQUM7Z0JBQ1QsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxRQUFRLEVBQUUsVUFBVTtnQkFDcEIsUUFBUSxFQUFFLFNBQVM7Z0JBQ25CLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXVEVDtnQkFDRCxJQUFJLEVBQUU7b0JBQ0osa0JBQWtCLEVBQUUsTUFBTTtvQkFDMUIsNEJBQTRCLEVBQUUsWUFBWTtpQkFDM0M7YUFDRjs7O1lBNUhDLGlCQUFpQjtZQUdqQixVQUFVO1lBc0JILHNCQUFzQix1QkErSjFCLElBQUksWUFBSSxRQUFRO1lBckpaLG9CQUFvQix1QkFzSnhCLFFBQVE7OztnQ0F6RFYsWUFBWSxTQUFDLG9CQUFvQixFQUFFLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRTtrQ0FDdkQsWUFBWSxTQUFDLG9CQUFvQjsyQkFFakMsWUFBWSxTQUFDLG9CQUFvQixFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFO2dDQUd0RSxZQUFZLFNBQUMseUJBQXlCLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUU7c0NBRzNFLFlBQVksU0FBQyxvQkFBb0IsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRTswQkFPdEUsS0FBSzs4QkFDTCxLQUFLO2tDQUNMLEtBQUs7eUJBQ0wsS0FBSztpQ0FFTCxNQUFNOzhCQUNOLE1BQU07MEJBQ04sTUFBTTs7QUFKa0I7SUFBZixZQUFZLEVBQUU7O29EQUFvQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9naXRodWIuY29tL05HLVpPUlJPL25nLXpvcnJvLWFudGQvYmxvYi9tYXN0ZXIvTElDRU5TRVxuICovXG5cbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudENoZWNrZWQsXG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSG9zdCxcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZHJlbixcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IGJ1aWxkR3JhcGggfSBmcm9tICdkYWdyZS1jb21wb3VuZCc7XG5cbmltcG9ydCB7IGZvcmtKb2luLCBPYnNlcnZhYmxlLCBSZXBsYXlTdWJqZWN0LCBTdWJqZWN0LCBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpbmFsaXplLCB0YWtlLCB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBjYWxjdWxhdGVUcmFuc2Zvcm0gfSBmcm9tICcuL2NvcmUvdXRpbHMnO1xuXG5pbXBvcnQgeyBOek5vQW5pbWF0aW9uRGlyZWN0aXZlIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL25vLWFuaW1hdGlvbic7XG5pbXBvcnQgeyBjYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvcG9seWZpbGwnO1xuaW1wb3J0IHsgQm9vbGVhbklucHV0LCBOelNhZmVBbnkgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvdHlwZXMnO1xuaW1wb3J0IHsgSW5wdXRCb29sZWFuIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL3V0aWwnO1xuXG5pbXBvcnQgeyBOekdyYXBoRGF0YSB9IGZyb20gJy4vZGF0YS1zb3VyY2UvZ3JhcGgtZGF0YS1zb3VyY2UnO1xuaW1wb3J0IHsgTnpHcmFwaEVkZ2VEaXJlY3RpdmUgfSBmcm9tICcuL2dyYXBoLWVkZ2UuZGlyZWN0aXZlJztcbmltcG9ydCB7IE56R3JhcGhHcm91cE5vZGVEaXJlY3RpdmUgfSBmcm9tICcuL2dyYXBoLWdyb3VwLW5vZGUuZGlyZWN0aXZlJztcbmltcG9ydCB7IE56R3JhcGhOb2RlQ29tcG9uZW50IH0gZnJvbSAnLi9ncmFwaC1ub2RlLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOekdyYXBoTm9kZURpcmVjdGl2ZSB9IGZyb20gJy4vZ3JhcGgtbm9kZS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgTnpHcmFwaFpvb21EaXJlY3RpdmUgfSBmcm9tICcuL2dyYXBoLXpvb20uZGlyZWN0aXZlJztcbmltcG9ydCB7XG4gIE56R3JhcGhEYXRhRGVmLFxuICBOekdyYXBoRWRnZSxcbiAgTnpHcmFwaEVkZ2VEZWYsXG4gIE56R3JhcGhHcm91cE5vZGUsXG4gIE56R3JhcGhMYXlvdXRDb25maWcsXG4gIE56R3JhcGhOb2RlLFxuICBOekdyYXBoTm9kZURlZixcbiAgTnpHcmFwaE9wdGlvbixcbiAgTnpMYXlvdXRTZXR0aW5nLFxuICBOelJhbmtEaXJlY3Rpb24sXG4gIG56VHlwZURlZmluaXRpb24sXG4gIE5aX0dSQVBIX0xBWU9VVF9TRVRUSU5HXG59IGZyb20gJy4vaW50ZXJmYWNlJztcblxuLyoqIENoZWNrcyB3aGV0aGVyIGFuIG9iamVjdCBpcyBhIGRhdGEgc291cmNlLiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRGF0YVNvdXJjZSh2YWx1ZTogTnpTYWZlQW55KTogdmFsdWUgaXMgTnpHcmFwaERhdGEge1xuICAvLyBDaGVjayBpZiB0aGUgdmFsdWUgaXMgYSBEYXRhU291cmNlIGJ5IG9ic2VydmluZyBpZiBpdCBoYXMgYSBjb25uZWN0IGZ1bmN0aW9uLiBDYW5ub3RcbiAgLy8gYmUgY2hlY2tlZCBhcyBhbiBgaW5zdGFuY2VvZiBEYXRhU291cmNlYCBzaW5jZSBwZW9wbGUgY291bGQgY3JlYXRlIHRoZWlyIG93biBzb3VyY2VzXG4gIC8vIHRoYXQgbWF0Y2ggdGhlIGludGVyZmFjZSwgYnV0IGRvbid0IGV4dGVuZCBEYXRhU291cmNlLlxuICByZXR1cm4gdmFsdWUgJiYgdHlwZW9mIHZhbHVlLmNvbm5lY3QgPT09ICdmdW5jdGlvbic7XG59XG5cbkBDb21wb25lbnQoe1xuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgc2VsZWN0b3I6ICduei1ncmFwaCcsXG4gIGV4cG9ydEFzOiAnbnpHcmFwaCcsXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgIDxzdmcgd2lkdGg9XCIxMDAlXCIgaGVpZ2h0PVwiMTAwJVwiPlxuICAgICAgPHN2ZzpkZWZzIG56LWdyYXBoLWRlZnM+PC9zdmc6ZGVmcz5cbiAgICAgIDxzdmc6ZyBbYXR0ci50cmFuc2Zvcm1dPVwidHJhbnNmb3JtU3R5bGVcIj5cbiAgICAgICAgPG5nLWNvbnRhaW5lclxuICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImdyb3VwVGVtcGxhdGVcIlxuICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7IHJlbmRlck5vZGU6IHJlbmRlckluZm8sIHR5cGU6ICdyb290JyB9XCJcbiAgICAgICAgPjwvbmctY29udGFpbmVyPlxuICAgICAgPC9zdmc6Zz5cbiAgICA8L3N2Zz5cblxuICAgIDxuZy10ZW1wbGF0ZSAjZ3JvdXBUZW1wbGF0ZSBsZXQtcmVuZGVyTm9kZT1cInJlbmRlck5vZGVcIiBsZXQtdHlwZT1cInR5cGVcIj5cbiAgICAgIDxzdmc6ZyBbYXR0ci50cmFuc2Zvcm1dPVwidHlwZSA9PT0gJ3N1YicgPyBzdWJHcmFwaFRyYW5zZm9ybShyZW5kZXJOb2RlKSA6IG51bGxcIj5cbiAgICAgICAgPHN2ZzpnIGNsYXNzPVwiY29yZVwiIFthdHRyLnRyYW5zZm9ybV09XCJjb3JlVHJhbnNmb3JtKHJlbmRlck5vZGUpXCI+XG4gICAgICAgICAgPHN2ZzpnIGNsYXNzPVwibnotZ3JhcGgtZWRnZXNcIj5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nRm9yPVwibGV0IGVkZ2Ugb2YgcmVuZGVyTm9kZS5lZGdlczsgdHJhY2tCeTogZWRnZVRyYWNrQnlGdW5cIj5cbiAgICAgICAgICAgICAgPGdcbiAgICAgICAgICAgICAgICBjbGFzcz1cIm56LWdyYXBoLWVkZ2VcIlxuICAgICAgICAgICAgICAgIG56LWdyYXBoLWVkZ2VcbiAgICAgICAgICAgICAgICBbZWRnZV09XCJlZGdlXCJcbiAgICAgICAgICAgICAgICBbZWRnZVR5cGVdPVwibnpHcmFwaExheW91dENvbmZpZz8uZGVmYXVsdEVkZ2U/LnR5cGVcIlxuICAgICAgICAgICAgICAgIFtjdXN0b21UZW1wbGF0ZV09XCJjdXN0b21HcmFwaEVkZ2VUZW1wbGF0ZVwiXG4gICAgICAgICAgICAgID48L2c+XG4gICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICA8L3N2ZzpnPlxuXG4gICAgICAgICAgPHN2ZzpnIGNsYXNzPVwibnotZ3JhcGgtbm9kZXNcIj5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nRm9yPVwibGV0IG5vZGUgb2YgdHlwZWROb2RlcyhyZW5kZXJOb2RlLm5vZGVzKTsgdHJhY2tCeTogbm9kZVRyYWNrQnlGdW5cIj5cbiAgICAgICAgICAgICAgPGdcbiAgICAgICAgICAgICAgICAqbmdJZj1cIm5vZGUudHlwZSA9PT0gMVwiXG4gICAgICAgICAgICAgICAgY2xhc3M9XCJuei1ncmFwaC1ub2RlXCJcbiAgICAgICAgICAgICAgICBuei1ncmFwaC1ub2RlXG4gICAgICAgICAgICAgICAgW25vZGVdPVwibm9kZVwiXG4gICAgICAgICAgICAgICAgW2N1c3RvbVRlbXBsYXRlXT1cIm5vZGVUZW1wbGF0ZVwiXG4gICAgICAgICAgICAgICAgKG5vZGVDbGljayk9XCJjbGlja05vZGUoJGV2ZW50KVwiXG4gICAgICAgICAgICAgID48L2c+XG4gICAgICAgICAgICAgIDxnXG4gICAgICAgICAgICAgICAgKm5nSWY9XCJub2RlLnR5cGUgPT09IDBcIlxuICAgICAgICAgICAgICAgIGNsYXNzPVwibnotZ3JhcGgtbm9kZVwiXG4gICAgICAgICAgICAgICAgbnotZ3JhcGgtbm9kZVxuICAgICAgICAgICAgICAgIFtub2RlXT1cIm5vZGVcIlxuICAgICAgICAgICAgICAgIFtjdXN0b21UZW1wbGF0ZV09XCJncm91cE5vZGVUZW1wbGF0ZVwiXG4gICAgICAgICAgICAgICAgKG5vZGVDbGljayk9XCJjbGlja05vZGUoJGV2ZW50KVwiXG4gICAgICAgICAgICAgID48L2c+XG4gICAgICAgICAgICAgIDxuZy1jb250YWluZXJcbiAgICAgICAgICAgICAgICAqbmdJZj1cIm5vZGUuZXhwYW5kZWRcIlxuICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImdyb3VwVGVtcGxhdGVcIlxuICAgICAgICAgICAgICAgIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7IHJlbmRlck5vZGU6IG5vZGUsIHR5cGU6ICdzdWInIH1cIlxuICAgICAgICAgICAgICA+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICA8L3N2ZzpnPlxuICAgICAgICA8L3N2ZzpnPlxuICAgICAgPC9zdmc6Zz5cbiAgICA8L25nLXRlbXBsYXRlPlxuICBgLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5uei1ncmFwaF0nOiAndHJ1ZScsXG4gICAgJ1tjbGFzcy5uei1ncmFwaC1hdXRvLXNpemVdJzogJ256QXV0b1NpemUnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTnpHcmFwaENvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBBZnRlclZpZXdJbml0LCBBZnRlckNvbnRlbnRDaGVja2VkLCBPbkRlc3Ryb3kge1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpBdXRvU2l6ZTogQm9vbGVhbklucHV0O1xuXG4gIEBWaWV3Q2hpbGRyZW4oTnpHcmFwaE5vZGVDb21wb25lbnQsIHsgcmVhZDogRWxlbWVudFJlZiB9KSBsaXN0T2ZOb2RlRWxlbWVudCE6IFF1ZXJ5TGlzdDxFbGVtZW50UmVmPjtcbiAgQFZpZXdDaGlsZHJlbihOekdyYXBoTm9kZUNvbXBvbmVudCkgbGlzdE9mTm9kZUNvbXBvbmVudCE6IFF1ZXJ5TGlzdDxOekdyYXBoTm9kZUNvbXBvbmVudD47XG5cbiAgQENvbnRlbnRDaGlsZChOekdyYXBoTm9kZURpcmVjdGl2ZSwgeyBzdGF0aWM6IHRydWUsIHJlYWQ6IFRlbXBsYXRlUmVmIH0pIG5vZGVUZW1wbGF0ZT86IFRlbXBsYXRlUmVmPHtcbiAgICAkaW1wbGljaXQ6IE56R3JhcGhOb2RlO1xuICB9PjtcbiAgQENvbnRlbnRDaGlsZChOekdyYXBoR3JvdXBOb2RlRGlyZWN0aXZlLCB7IHN0YXRpYzogdHJ1ZSwgcmVhZDogVGVtcGxhdGVSZWYgfSkgZ3JvdXBOb2RlVGVtcGxhdGU/OiBUZW1wbGF0ZVJlZjx7XG4gICAgJGltcGxpY2l0OiBOekdyYXBoR3JvdXBOb2RlO1xuICB9PjtcbiAgQENvbnRlbnRDaGlsZChOekdyYXBoRWRnZURpcmVjdGl2ZSwgeyBzdGF0aWM6IHRydWUsIHJlYWQ6IFRlbXBsYXRlUmVmIH0pIGN1c3RvbUdyYXBoRWRnZVRlbXBsYXRlPzogVGVtcGxhdGVSZWY8e1xuICAgICRpbXBsaWNpdDogTnpHcmFwaEVkZ2U7XG4gIH0+O1xuICAvKipcbiAgICogUHJvdmlkZXMgYSBzdHJlYW0gY29udGFpbmluZyB0aGUgbGF0ZXN0IGRhdGEgYXJyYXkgdG8gcmVuZGVyLlxuICAgKiBEYXRhIHNvdXJjZSBjYW4gYmUgYW4gb2JzZXJ2YWJsZSBvZiBOekdyYXBoRGF0YSwgb3IgYSBOekdyYXBoRGF0YSB0byByZW5kZXIuXG4gICAqL1xuICBASW5wdXQoKSBuekdyYXBoRGF0YSE6IE56R3JhcGhEYXRhO1xuICBASW5wdXQoKSBuelJhbmtEaXJlY3Rpb246IE56UmFua0RpcmVjdGlvbiA9ICdMUic7XG4gIEBJbnB1dCgpIG56R3JhcGhMYXlvdXRDb25maWc/OiBOekdyYXBoTGF5b3V0Q29uZmlnO1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpBdXRvU2l6ZSA9IGZhbHNlO1xuXG4gIEBPdXRwdXQoKSByZWFkb25seSBuekdyYXBoSW5pdGlhbGl6ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPE56R3JhcGhDb21wb25lbnQ+KCk7XG4gIEBPdXRwdXQoKSByZWFkb25seSBuekdyYXBoUmVuZGVyZWQgPSBuZXcgRXZlbnRFbWl0dGVyPE56R3JhcGhDb21wb25lbnQ+KCk7XG4gIEBPdXRwdXQoKSByZWFkb25seSBuek5vZGVDbGljazogRXZlbnRFbWl0dGVyPE56R3JhcGhOb2RlIHwgTnpHcmFwaEdyb3VwTm9kZT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgcmVxdWVzdElkOiBudW1iZXIgPSAtMTtcbiAgdHJhbnNmb3JtU3R5bGUgPSAnJztcbiAgZ3JhcGhSZW5kZXJlZFN1YmplY3QkID0gbmV3IFJlcGxheVN1YmplY3Q8dm9pZD4oMSk7XG4gIHJlbmRlckluZm86IE56R3JhcGhHcm91cE5vZGUgPSB7IGxhYmVsSGVpZ2h0OiAwIH0gYXMgTnpHcmFwaEdyb3VwTm9kZTtcbiAgbWFwT2ZOb2RlQXR0cjogeyBba2V5OiBzdHJpbmddOiBOekdyYXBoTm9kZURlZiB9ID0ge307XG4gIG1hcE9mRWRnZUF0dHI6IHsgW2tleTogc3RyaW5nXTogTnpHcmFwaEVkZ2VEZWYgfSA9IHt9O1xuICB6b29tID0gMTtcblxuICBwdWJsaWMgcmVhZG9ubHkgdHlwZWROb2RlcyA9IG56VHlwZURlZmluaXRpb248QXJyYXk8TnpHcmFwaE5vZGUgfCBOekdyYXBoR3JvdXBOb2RlPj4oKTtcbiAgcHJpdmF0ZSBkYXRhU291cmNlPzogTnpHcmFwaERhdGE7XG4gIHByaXZhdGUgbGF5b3V0U2V0dGluZzogTnpMYXlvdXRTZXR0aW5nID0gTlpfR1JBUEhfTEFZT1VUX1NFVFRJTkc7XG4gIC8qKiBEYXRhIHN1YnNjcmlwdGlvbiAqL1xuICBwcml2YXRlIF9kYXRhU3Vic2NyaXB0aW9uPzogU3Vic2NyaXB0aW9uIHwgbnVsbDtcbiAgcHJpdmF0ZSBkZXN0cm95JCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgbm9kZVRyYWNrQnlGdW4gPSAoXzogbnVtYmVyLCBub2RlOiBOekdyYXBoTm9kZSB8IE56R3JhcGhHcm91cE5vZGUpID0+IG5vZGUubmFtZTtcbiAgZWRnZVRyYWNrQnlGdW4gPSAoXzogbnVtYmVyLCBlZGdlOiBOekdyYXBoRWRnZSkgPT4gYCR7ZWRnZS52fS0ke2VkZ2Uud31gO1xuXG4gIHN1YkdyYXBoVHJhbnNmb3JtID0gKG5vZGU6IE56R3JhcGhHcm91cE5vZGUpID0+IHtcbiAgICBjb25zdCB4ID0gbm9kZS54IC0gbm9kZS5jb3JlQm94LndpZHRoIC8gMi4wO1xuICAgIGNvbnN0IHkgPSBub2RlLnkgLSBub2RlLmhlaWdodCAvIDIuMCArIG5vZGUucGFkZGluZ1RvcDtcbiAgICByZXR1cm4gYHRyYW5zbGF0ZSgke3h9LCAke3l9KWA7XG4gIH07XG5cbiAgY29yZVRyYW5zZm9ybSA9IChub2RlOiBOekdyYXBoR3JvdXBOb2RlKSA9PiB7XG4gICAgcmV0dXJuIGB0cmFuc2xhdGUoMCwgJHtub2RlLnBhcmVudE5vZGVOYW1lID8gbm9kZS5sYWJlbEhlaWdodCA6IDB9KWA7XG4gIH07XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBjZHI6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBASG9zdCgpIEBPcHRpb25hbCgpIHB1YmxpYyBub0FuaW1hdGlvbj86IE56Tm9BbmltYXRpb25EaXJlY3RpdmUsXG4gICAgQE9wdGlvbmFsKCkgcHVibGljIG56R3JhcGhab29tPzogTnpHcmFwaFpvb21EaXJlY3RpdmVcbiAgKSB7fVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuZ3JhcGhSZW5kZXJlZFN1YmplY3QkLnBpcGUodGFrZSgxKSwgdGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgLy8gT25seSB6b29taW5nIGlzIG5vdCBzZXQsIG1vdmUgZ3JhcGggdG8gY2VudGVyXG4gICAgICBpZiAoIXRoaXMubnpHcmFwaFpvb20pIHtcbiAgICAgICAgdGhpcy5maXRDZW50ZXIoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMubnpHcmFwaEluaXRpYWxpemVkLmVtaXQodGhpcyk7XG4gICAgfSk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgY29uc3QgeyBuekF1dG9GaXQsIG56UmFua0RpcmVjdGlvbiwgbnpHcmFwaERhdGEsIG56R3JhcGhMYXlvdXRDb25maWcgfSA9IGNoYW5nZXM7XG4gICAgaWYgKG56R3JhcGhMYXlvdXRDb25maWcpIHtcbiAgICAgIHRoaXMubGF5b3V0U2V0dGluZyA9IHRoaXMubWVyZ2VDb25maWcobnpHcmFwaExheW91dENvbmZpZy5jdXJyZW50VmFsdWUpO1xuICAgIH1cblxuICAgIGlmIChuekdyYXBoRGF0YSkge1xuICAgICAgaWYgKHRoaXMuZGF0YVNvdXJjZSAhPT0gdGhpcy5uekdyYXBoRGF0YSkge1xuICAgICAgICB0aGlzLl9zd2l0Y2hEYXRhU291cmNlKHRoaXMubnpHcmFwaERhdGEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICgobnpBdXRvRml0ICYmICFuekF1dG9GaXQuZmlyc3RDaGFuZ2UpIHx8IChuelJhbmtEaXJlY3Rpb24gJiYgIW56UmFua0RpcmVjdGlvbi5maXJzdENoYW5nZSkpIHtcbiAgICAgIC8vIFJlbmRlciBncmFwaFxuICAgICAgaWYgKHRoaXMuZGF0YVNvdXJjZSEuZGF0YVNvdXJjZSkge1xuICAgICAgICB0aGlzLmRyYXdHcmFwaCh0aGlzLmRhdGFTb3VyY2UhLmRhdGFTb3VyY2UsIHtcbiAgICAgICAgICByYW5rRGlyZWN0aW9uOiB0aGlzLm56UmFua0RpcmVjdGlvbixcbiAgICAgICAgICBleHBhbmRlZDogdGhpcy5kYXRhU291cmNlIS5leHBhbnNpb25Nb2RlbC5zZWxlY3RlZCB8fCBbXVxuICAgICAgICB9KS50aGVuKCgpID0+IHtcbiAgICAgICAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7fVxuXG4gIG5nQWZ0ZXJDb250ZW50Q2hlY2tlZCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5kYXRhU291cmNlICYmICF0aGlzLl9kYXRhU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLm9ic2VydmVSZW5kZXJDaGFuZ2VzKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5kZXN0cm95JC5uZXh0KCk7XG4gICAgdGhpcy5kZXN0cm95JC5jb21wbGV0ZSgpO1xuXG4gICAgaWYgKHRoaXMuZGF0YVNvdXJjZSAmJiB0eXBlb2YgdGhpcy5kYXRhU291cmNlLmRpc2Nvbm5lY3QgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMuZGF0YVNvdXJjZS5kaXNjb25uZWN0KCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuX2RhdGFTdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuX2RhdGFTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgIHRoaXMuX2RhdGFTdWJzY3JpcHRpb24gPSBudWxsO1xuICAgIH1cbiAgICBjYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5yZXF1ZXN0SWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVtaXQgZXZlbnRcbiAgICovXG4gIGNsaWNrTm9kZShub2RlOiBOekdyYXBoTm9kZSB8IE56R3JhcGhHcm91cE5vZGUpOiB2b2lkIHtcbiAgICB0aGlzLm56Tm9kZUNsaWNrLmVtaXQobm9kZSk7XG4gIH1cblxuICAvKipcbiAgICogTW92ZSBncmFwaCB0byBjZW50ZXIgYW5kIHNjYWxlIGF1dG9tYXRpY2FsbHlcbiAgICovXG4gIGZpdENlbnRlcigpOiB2b2lkIHtcbiAgICBjb25zdCB7IHgsIHksIGsgfSA9IGNhbGN1bGF0ZVRyYW5zZm9ybShcbiAgICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoJ3N2ZycpLFxuICAgICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQucXVlcnlTZWxlY3Rvcignc3ZnID4gZycpXG4gICAgKSE7XG4gICAgaWYgKGspIHtcbiAgICAgIHRoaXMuem9vbSA9IGs7XG4gICAgICB0aGlzLnRyYW5zZm9ybVN0eWxlID0gYHRyYW5zbGF0ZSgke3h9LCAke3l9KXNjYWxlKCR7a30pYDtcbiAgICB9XG4gICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvKipcbiAgICogcmUtRHJhdyBncmFwaFxuICAgKiBAcGFyYW0gZGF0YVxuICAgKiBAcGFyYW0gb3B0aW9uc1xuICAgKiBAcGFyYW0gbmVlZFJlc2l6ZVxuICAgKi9cbiAgZHJhd0dyYXBoKGRhdGE6IE56R3JhcGhEYXRhRGVmLCBvcHRpb25zOiBOekdyYXBoT3B0aW9uLCBuZWVkUmVzaXplOiBib29sZWFuID0gZmFsc2UpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICB0aGlzLnJlcXVlc3RJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgIGNvbnN0IHJlbmRlckluZm8gPSB0aGlzLmJ1aWxkR3JhcGhJbmZvKGRhdGEsIG9wdGlvbnMpO1xuICAgICAgICAvLyBUT0RPXG4gICAgICAgIC8vIE5lZWQgYmV0dGVyIHBlcmZvcm1hbmNlXG4gICAgICAgIHRoaXMucmVuZGVySW5mbyA9IHJlbmRlckluZm87XG4gICAgICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICB0aGlzLnJlcXVlc3RJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5kcmF3Tm9kZXMoIXRoaXMubm9BbmltYXRpb24/Lm56Tm9BbmltYXRpb24pLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgLy8gVXBkYXRlIGVsZW1lbnRcbiAgICAgICAgICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICAgICAgICAgICAgaWYgKG5lZWRSZXNpemUpIHtcbiAgICAgICAgICAgICAgdGhpcy5yZXNpemVOb2RlU2l6ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRhdGFTb3VyY2U6IE56R3JhcGhEYXRhRGVmID0gdGhpcy5kYXRhU291cmNlIS5kYXRhU291cmNlITtcbiAgICAgICAgICAgICAgICB0aGlzLmRyYXdHcmFwaChkYXRhU291cmNlLCBvcHRpb25zLCBmYWxzZSkudGhlbigoKSA9PiByZXNvbHZlKCkpO1xuICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHRoaXMuZ3JhcGhSZW5kZXJlZFN1YmplY3QkLm5leHQoKTtcbiAgICAgICAgICAgICAgdGhpcy5uekdyYXBoUmVuZGVyZWQuZW1pdCh0aGlzKTtcbiAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmVkcmF3IGFsbCBub2Rlc1xuICAgKiBAcGFyYW0gYW5pbWF0ZVxuICAgKi9cbiAgZHJhd05vZGVzKGFuaW1hdGU6IGJvb2xlYW4gPSB0cnVlKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgaWYgKGFuaW1hdGUpIHtcbiAgICAgICAgdGhpcy5tYWtlTm9kZXNBbmltYXRpb24oKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmxpc3RPZk5vZGVDb21wb25lbnQubWFwKG5vZGUgPT4ge1xuICAgICAgICAgIG5vZGUubWFrZU5vQW5pbWF0aW9uKCk7XG4gICAgICAgIH0pO1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHJlc2l6ZU5vZGVTaXplKCk6IFByb21pc2U8dm9pZD4ge1xuICAgIHJldHVybiBuZXcgUHJvbWlzZShyZXNvbHZlID0+IHtcbiAgICAgIGNvbnN0IGRhdGFTb3VyY2U6IE56R3JhcGhEYXRhRGVmID0gdGhpcy5kYXRhU291cmNlIS5kYXRhU291cmNlITtcbiAgICAgIGxldCBzY2FsZSA9IHRoaXMubnpHcmFwaFpvb20/Lm56Wm9vbSB8fCB0aGlzLnpvb20gfHwgMTtcbiAgICAgIHRoaXMubGlzdE9mTm9kZUVsZW1lbnQuZm9yRWFjaChub2RlRWxlID0+IHtcbiAgICAgICAgY29uc3QgY29udGVudEVsZSA9IG5vZGVFbGUubmF0aXZlRWxlbWVudDtcbiAgICAgICAgaWYgKGNvbnRlbnRFbGUpIHtcbiAgICAgICAgICBsZXQgd2lkdGg6IG51bWJlcjtcbiAgICAgICAgICBsZXQgaGVpZ2h0OiBudW1iZXI7XG4gICAgICAgICAgLy8gQ2hlY2sgaWYgZm9yZWlnbk9iamVjdCBpcyBzZXRcbiAgICAgICAgICBjb25zdCBjbGllbnRSZWN0ID0gY29udGVudEVsZS5xdWVyeVNlbGVjdG9yKCdmb3JlaWduT2JqZWN0ID4gOmZpcnN0LWNoaWxkJyk/LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgIGlmIChjbGllbnRSZWN0KSB7XG4gICAgICAgICAgICB3aWR0aCA9IGNsaWVudFJlY3Qud2lkdGg7XG4gICAgICAgICAgICBoZWlnaHQgPSBjbGllbnRSZWN0LmhlaWdodDtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgYkJveFJlY3QgPSBjb250ZW50RWxlLmdldEJCb3goKTtcbiAgICAgICAgICAgIHdpZHRoID0gYkJveFJlY3Qud2lkdGg7XG4gICAgICAgICAgICBoZWlnaHQgPSBiQm94UmVjdC5oZWlnaHQ7XG4gICAgICAgICAgICAvLyBnZXRCQm94IHdpbGwgcmV0dXJuIGFjdHVhbCB2YWx1ZVxuICAgICAgICAgICAgc2NhbGUgPSAxO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBFbGVtZW50IGlkIHR5cGUgaXMgc3RyaW5nXG4gICAgICAgICAgY29uc3Qgbm9kZSA9IGRhdGFTb3VyY2Uubm9kZXMuZmluZChuID0+IGAke24uaWR9YCA9PT0gbm9kZUVsZS5uYXRpdmVFbGVtZW50LmlkKTtcbiAgICAgICAgICBpZiAobm9kZSAmJiB3aWR0aCAmJiBoZWlnaHQpIHtcbiAgICAgICAgICAgIG5vZGUuaGVpZ2h0ID0gaGVpZ2h0IC8gc2NhbGU7XG4gICAgICAgICAgICBub2RlLndpZHRoID0gd2lkdGggLyBzY2FsZTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmVzb2x2ZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFN3aXRjaCB0byB0aGUgcHJvdmlkZWQgZGF0YSBzb3VyY2UgYnkgcmVzZXR0aW5nIHRoZSBkYXRhIGFuZCB1bnN1YnNjcmliaW5nIGZyb20gdGhlIGN1cnJlbnRcbiAgICogcmVuZGVyIGNoYW5nZSBzdWJzY3JpcHRpb24gaWYgb25lIGV4aXN0cy4gSWYgdGhlIGRhdGEgc291cmNlIGlzIG51bGwsIGludGVycHJldCB0aGlzIGJ5XG4gICAqIGNsZWFyaW5nIHRoZSBub2RlIG91dGxldC4gT3RoZXJ3aXNlIHN0YXJ0IGxpc3RlbmluZyBmb3IgbmV3IGRhdGEuXG4gICAqL1xuICBwcml2YXRlIF9zd2l0Y2hEYXRhU291cmNlKGRhdGFTb3VyY2U6IE56R3JhcGhEYXRhKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGF0YVNvdXJjZSAmJiB0eXBlb2YgdGhpcy5kYXRhU291cmNlLmRpc2Nvbm5lY3QgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMubnpHcmFwaERhdGEuZGlzY29ubmVjdCgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLl9kYXRhU3Vic2NyaXB0aW9uKSB7XG4gICAgICB0aGlzLl9kYXRhU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB0aGlzLl9kYXRhU3Vic2NyaXB0aW9uID0gbnVsbDtcbiAgICB9XG5cbiAgICB0aGlzLmRhdGFTb3VyY2UgPSBkYXRhU291cmNlO1xuICAgIHRoaXMub2JzZXJ2ZVJlbmRlckNoYW5nZXMoKTtcbiAgfVxuXG4gIC8qKiBTZXQgdXAgYSBzdWJzY3JpcHRpb24gZm9yIHRoZSBkYXRhIHByb3ZpZGVkIGJ5IHRoZSBkYXRhIHNvdXJjZS4gKi9cbiAgcHJpdmF0ZSBvYnNlcnZlUmVuZGVyQ2hhbmdlcygpOiB2b2lkIHtcbiAgICBsZXQgZGF0YVN0cmVhbTogT2JzZXJ2YWJsZTxOekdyYXBoRGF0YURlZj4gfCB1bmRlZmluZWQ7XG4gICAgbGV0IGdyYXBoT3B0aW9uczogTnpHcmFwaE9wdGlvbiA9IHtcbiAgICAgIHJhbmtEaXJlY3Rpb246IHRoaXMubnpSYW5rRGlyZWN0aW9uXG4gICAgfTtcbiAgICBpZiAoaXNEYXRhU291cmNlKHRoaXMuZGF0YVNvdXJjZSkpIHtcbiAgICAgIGRhdGFTdHJlYW0gPSB0aGlzLmRhdGFTb3VyY2UuY29ubmVjdCgpO1xuICAgIH1cblxuICAgIGlmIChkYXRhU3RyZWFtKSB7XG4gICAgICB0aGlzLl9kYXRhU3Vic2NyaXB0aW9uID0gZGF0YVN0cmVhbS5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSkuc3Vic2NyaWJlKGRhdGEgPT4ge1xuICAgICAgICBncmFwaE9wdGlvbnMgPSB7XG4gICAgICAgICAgcmFua0RpcmVjdGlvbjogdGhpcy5uelJhbmtEaXJlY3Rpb24sXG4gICAgICAgICAgZXhwYW5kZWQ6IHRoaXMubnpHcmFwaERhdGEuZXhwYW5zaW9uTW9kZWwuc2VsZWN0ZWRcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5kcmF3R3JhcGgoZGF0YSwgZ3JhcGhPcHRpb25zLCB0aGlzLm56QXV0b1NpemUpLnRoZW4oKCkgPT4ge1xuICAgICAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgRXJyb3IoYEEgdmFsaWQgZGF0YSBzb3VyY2UgbXVzdCBiZSBwcm92aWRlZC5gKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0IHJlbmRlckluZm8gYW5kIHByZXBhcmUgc29tZSBkYXRhXG4gICAqIEBwYXJhbSBkYXRhXG4gICAqIEBwYXJhbSBvcHRpb25zXG4gICAqIEBwcml2YXRlXG4gICAqL1xuICBwcml2YXRlIGJ1aWxkR3JhcGhJbmZvKGRhdGE6IE56R3JhcGhEYXRhRGVmLCBvcHRpb25zOiBOekdyYXBoT3B0aW9uKTogTnpHcmFwaEdyb3VwTm9kZSB7XG4gICAgdGhpcy5wYXJzZUluZm8oZGF0YSk7XG4gICAgY29uc3QgcmVuZGVySW5mbyA9IGJ1aWxkR3JhcGgoZGF0YSwgb3B0aW9ucywgdGhpcy5sYXlvdXRTZXR0aW5nKSBhcyBOekdyYXBoR3JvdXBOb2RlO1xuICAgIGNvbnN0IGRpZyA9IChub2RlczogQXJyYXk8TnpHcmFwaE5vZGUgfCBOekdyYXBoR3JvdXBOb2RlPik6IHZvaWQgPT4ge1xuICAgICAgbm9kZXMuZm9yRWFjaChub2RlID0+IHtcbiAgICAgICAgY29uc3QgeyB4LCB5IH0gPSBub2RlO1xuICAgICAgICBub2RlLnhPZmZzZXQgPSB4O1xuICAgICAgICBub2RlLnlPZmZzZXQgPSB5O1xuICAgICAgICBpZiAobm9kZS50eXBlID09PSAxICYmIHRoaXMubWFwT2ZOb2RlQXR0ci5oYXNPd25Qcm9wZXJ0eShub2RlLm5hbWUpKSB7XG4gICAgICAgICAgT2JqZWN0LmFzc2lnbihub2RlLCB0aGlzLm1hcE9mTm9kZUF0dHJbbm9kZS5uYW1lXSk7XG4gICAgICAgIH0gZWxzZSBpZiAobm9kZS50eXBlID09PSAwKSB7XG4gICAgICAgICAgKG5vZGUgYXMgTnpHcmFwaEdyb3VwTm9kZSkuZWRnZXMuZm9yRWFjaChlZGdlID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLm1hcE9mRWRnZUF0dHIuaGFzT3duUHJvcGVydHkoYCR7ZWRnZS52fS0ke2VkZ2Uud31gKSkge1xuICAgICAgICAgICAgICBPYmplY3QuYXNzaWduKGVkZ2UsIHRoaXMubWFwT2ZFZGdlQXR0cltgJHtlZGdlLnZ9LSR7ZWRnZS53fWBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICBkaWcobm9kZS5ub2Rlcyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH07XG4gICAgZGlnKHJlbmRlckluZm8ubm9kZXMpO1xuICAgIC8vIEFzc2lnbiBkYXRhIHRvIGVkZ2VzIG9mIHJvb3QgZ3JhcGhcbiAgICByZW5kZXJJbmZvLmVkZ2VzLmZvckVhY2goZWRnZSA9PiB7XG4gICAgICBpZiAodGhpcy5tYXBPZkVkZ2VBdHRyLmhhc093blByb3BlcnR5KGAke2VkZ2Uudn0tJHtlZGdlLnd9YCkpIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihlZGdlLCB0aGlzLm1hcE9mRWRnZUF0dHJbYCR7ZWRnZS52fS0ke2VkZ2Uud31gXSk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgcmV0dXJuIHJlbmRlckluZm87XG4gIH1cblxuICAvKipcbiAgICogUGxheSB3aXRoIGFuaW1hdGlvblxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcHJpdmF0ZSBtYWtlTm9kZXNBbmltYXRpb24oKTogT2JzZXJ2YWJsZTx2b2lkPiB7XG4gICAgcmV0dXJuIGZvcmtKb2luKC4uLnRoaXMubGlzdE9mTm9kZUNvbXBvbmVudC5tYXAobm9kZSA9PiBub2RlLm1ha2VBbmltYXRpb24oKSkpLnBpcGUoXG4gICAgICBmaW5hbGl6ZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICAgIH0pXG4gICAgKTtcbiAgfVxuXG4gIHByaXZhdGUgcGFyc2VJbmZvKGRhdGE6IE56R3JhcGhEYXRhRGVmKTogdm9pZCB7XG4gICAgZGF0YS5ub2Rlcy5mb3JFYWNoKG4gPT4ge1xuICAgICAgdGhpcy5tYXBPZk5vZGVBdHRyW24uaWRdID0gbjtcbiAgICB9KTtcbiAgICBkYXRhLmVkZ2VzLmZvckVhY2goZSA9PiB7XG4gICAgICB0aGlzLm1hcE9mRWRnZUF0dHJbYCR7ZS52fS0ke2Uud31gXSA9IGU7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogTWVyZ2UgY29uZmlnIHdpdGggdXNlciBpbnB1dHNcbiAgICogQHBhcmFtIGNvbmZpZ1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgcHJpdmF0ZSBtZXJnZUNvbmZpZyhjb25maWc6IE56R3JhcGhMYXlvdXRDb25maWcpOiBOekxheW91dFNldHRpbmcge1xuICAgIGNvbnN0IGdyYXBoTWV0YSA9IGNvbmZpZz8ubGF5b3V0IHx8IHt9O1xuICAgIGNvbnN0IHN1YlNjZW5lTWV0YSA9IGNvbmZpZz8uc3ViU2NlbmUgfHwge307XG4gICAgY29uc3QgZGVmYXVsdE5vZGVNZXRhID0gY29uZmlnPy5kZWZhdWx0Tm9kZSB8fCB7fTtcbiAgICBjb25zdCBkZWZhdWx0Q29tcG91bmROb2RlTWV0YSA9IGNvbmZpZz8uZGVmYXVsdENvbXBvdW5kTm9kZSB8fCB7fTtcbiAgICBjb25zdCBicmlkZ2UgPSBOWl9HUkFQSF9MQVlPVVRfU0VUVElORy5ub2RlU2l6ZS5icmlkZ2U7XG5cbiAgICBjb25zdCBncmFwaDogTnpMYXlvdXRTZXR0aW5nWydncmFwaCddID0geyBtZXRhOiB7IC4uLk5aX0dSQVBIX0xBWU9VVF9TRVRUSU5HLmdyYXBoLm1ldGEsIC4uLmdyYXBoTWV0YSB9IH07XG4gICAgY29uc3Qgc3ViU2NlbmU6IE56TGF5b3V0U2V0dGluZ1snc3ViU2NlbmUnXSA9IHtcbiAgICAgIG1ldGE6IHsgLi4uTlpfR1JBUEhfTEFZT1VUX1NFVFRJTkcuc3ViU2NlbmUubWV0YSwgLi4uc3ViU2NlbmVNZXRhIH1cbiAgICB9O1xuICAgIGNvbnN0IG5vZGVTaXplOiBOekxheW91dFNldHRpbmdbJ25vZGVTaXplJ10gPSB7XG4gICAgICBtZXRhOiB7IC4uLk5aX0dSQVBIX0xBWU9VVF9TRVRUSU5HLm5vZGVTaXplLm1ldGEsIC4uLmRlZmF1bHRDb21wb3VuZE5vZGVNZXRhIH0sXG4gICAgICBub2RlOiB7IC4uLk5aX0dSQVBIX0xBWU9VVF9TRVRUSU5HLm5vZGVTaXplLm5vZGUsIC4uLmRlZmF1bHROb2RlTWV0YSB9LFxuICAgICAgYnJpZGdlXG4gICAgfTtcblxuICAgIHJldHVybiB7IGdyYXBoLCBzdWJTY2VuZSwgbm9kZVNpemUgfTtcbiAgfVxufVxuIl19