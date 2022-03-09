/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { animate, style, transition, trigger } from '@angular/animations';
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Input, NgZone, ViewEncapsulation } from '@angular/core';
const isImageFileType = (type) => !!type && type.indexOf('image/') === 0;
const ɵ0 = isImageFileType;
const MEASURE_SIZE = 200;
export class NzUploadListComponent {
    // #endregion
    constructor(cdr, doc, ngZone, platform, elementRef) {
        this.cdr = cdr;
        this.doc = doc;
        this.ngZone = ngZone;
        this.platform = platform;
        this.elementRef = elementRef;
        this.list = [];
        this.locale = {};
        this.iconRender = null;
        this.dir = 'ltr';
        // TODO: move to host after View Engine deprecation
        this.elementRef.nativeElement.classList.add('ant-upload-list');
    }
    get showPic() {
        return this.listType === 'picture' || this.listType === 'picture-card';
    }
    set items(list) {
        this.list = list;
    }
    genErr(file) {
        if (file.response && typeof file.response === 'string') {
            return file.response;
        }
        return (file.error && file.error.statusText) || this.locale.uploadError;
    }
    extname(url) {
        const temp = url.split('/');
        const filename = temp[temp.length - 1];
        const filenameWithoutSuffix = filename.split(/#|\?/)[0];
        return (/\.[^./\\]*$/.exec(filenameWithoutSuffix) || [''])[0];
    }
    isImageUrl(file) {
        if (isImageFileType(file.type)) {
            return true;
        }
        const url = (file.thumbUrl || file.url || '');
        if (!url) {
            return false;
        }
        const extension = this.extname(url);
        if (/^data:image\//.test(url) || /(webp|svg|png|gif|jpg|jpeg|jfif|bmp|dpg)$/i.test(extension)) {
            return true;
        }
        else if (/^data:/.test(url)) {
            // other file types of base64
            return false;
        }
        else if (extension) {
            // other file types which have extension
            return false;
        }
        return true;
    }
    getIconType(file) {
        if (!this.showPic) {
            return '';
        }
        if (file.isUploading || (!file.thumbUrl && !file.url)) {
            return 'uploading';
        }
        else {
            return 'thumbnail';
        }
    }
    previewImage(file) {
        return new Promise(resolve => {
            if (!isImageFileType(file.type) || !this.platform.isBrowser) {
                resolve('');
                return;
            }
            this.ngZone.runOutsideAngular(() => {
                const canvas = this.doc.createElement('canvas');
                canvas.width = MEASURE_SIZE;
                canvas.height = MEASURE_SIZE;
                canvas.style.cssText = `position: fixed; left: 0; top: 0; width: ${MEASURE_SIZE}px; height: ${MEASURE_SIZE}px; z-index: 9999; display: none;`;
                this.doc.body.appendChild(canvas);
                const ctx = canvas.getContext('2d');
                const img = new Image();
                img.onload = () => {
                    const { width, height } = img;
                    let drawWidth = MEASURE_SIZE;
                    let drawHeight = MEASURE_SIZE;
                    let offsetX = 0;
                    let offsetY = 0;
                    if (width < height) {
                        drawHeight = height * (MEASURE_SIZE / width);
                        offsetY = -(drawHeight - drawWidth) / 2;
                    }
                    else {
                        drawWidth = width * (MEASURE_SIZE / height);
                        offsetX = -(drawWidth - drawHeight) / 2;
                    }
                    try {
                        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
                    }
                    catch (_a) { }
                    const dataURL = canvas.toDataURL();
                    this.doc.body.removeChild(canvas);
                    resolve(dataURL);
                };
                img.src = window.URL.createObjectURL(file);
            });
        });
    }
    genThumb() {
        if (!this.platform.isBrowser) {
            return;
        }
        const win = window;
        if (!this.showPic || typeof document === 'undefined' || typeof win === 'undefined' || !win.FileReader || !win.File) {
            return;
        }
        this.list
            .filter(file => file.originFileObj instanceof File && file.thumbUrl === undefined)
            .forEach(file => {
            file.thumbUrl = '';
            (this.previewFile ? this.previewFile(file).toPromise() : this.previewImage(file.originFileObj)).then(dataUrl => {
                file.thumbUrl = dataUrl;
                this.detectChanges();
            });
        });
    }
    showDownload(file) {
        return !!(this.icons.showDownloadIcon && file.status === 'done');
    }
    fixData() {
        this.list.forEach(file => {
            file.isUploading = file.status === 'uploading';
            file.message = this.genErr(file);
            file.linkProps = typeof file.linkProps === 'string' ? JSON.parse(file.linkProps) : file.linkProps;
            file.isImageUrl = this.previewIsImage ? this.previewIsImage(file) : this.isImageUrl(file);
            file.iconType = this.getIconType(file);
            file.showDownload = this.showDownload(file);
        });
    }
    handlePreview(file, e) {
        if (!this.onPreview) {
            return;
        }
        e.preventDefault();
        return this.onPreview(file);
    }
    handleRemove(file, e) {
        e.preventDefault();
        if (this.onRemove) {
            this.onRemove(file);
        }
        return;
    }
    handleDownload(file) {
        if (typeof this.onDownload === 'function') {
            this.onDownload(file);
        }
        else if (file.url) {
            window.open(file.url);
        }
    }
    detectChanges() {
        this.fixData();
        this.cdr.detectChanges();
    }
    ngOnChanges() {
        this.fixData();
        this.genThumb();
    }
}
NzUploadListComponent.decorators = [
    { type: Component, args: [{
                selector: 'nz-upload-list',
                exportAs: 'nzUploadList',
                template: "<div *ngFor=\"let file of list\" class=\"ant-upload-list-{{ listType }}-container\">\n  <div\n    class=\"ant-upload-list-item ant-upload-list-item-{{\n      file.status\n    }} ant-upload-list-item-list-type-{{ listType }}\"\n    [attr.data-key]=\"file.key\"\n    @itemState\n    nz-tooltip\n    [nzTooltipTitle]=\"file.status === 'error' ? file.message : null\"\n  >\n    <ng-template #icon>\n      <ng-container [ngSwitch]=\"file.iconType\">\n        <div\n          *ngSwitchCase=\"'uploading'\"\n          class=\"ant-upload-list-item-thumbnail\"\n          [class.ant-upload-list-item-file]=\"!file.isUploading\"\n        >\n          <ng-template\n            [ngTemplateOutlet]=\"iconNode\"\n            [ngTemplateOutletContext]=\"{ $implicit: file }\"\n          ></ng-template>\n        </div>\n        <a\n          *ngSwitchCase=\"'thumbnail'\"\n          class=\"ant-upload-list-item-thumbnail\"\n          [class.ant-upload-list-item-file]=\"!file.isImageUrl\"\n          target=\"_blank\"\n          rel=\"noopener noreferrer\"\n          [href]=\"file.url || file.thumbUrl\"\n          (click)=\"handlePreview(file, $event)\"\n        >\n          <img\n            *ngIf=\"file.isImageUrl; else noImageThumbTpl\"\n            class=\"ant-upload-list-item-image\"\n            [src]=\"file.thumbUrl || file.url\"\n            [attr.alt]=\"file.name\"\n          />\n        </a>\n        <div *ngSwitchDefault class=\"ant-upload-text-icon\">\n          <ng-template\n            [ngTemplateOutlet]=\"iconNode\"\n            [ngTemplateOutletContext]=\"{ $implicit: file }\"\n          ></ng-template>\n        </div>\n      </ng-container>\n      <ng-template #noImageThumbTpl>\n        <ng-template\n          [ngTemplateOutlet]=\"iconNode\"\n          [ngTemplateOutletContext]=\"{ $implicit: file }\"\n        ></ng-template>\n      </ng-template>\n    </ng-template>\n    <ng-template #iconNode let-file>\n      <ng-container *ngIf=\"!iconRender; else customIconRender\">\n        <ng-container [ngSwitch]=\"listType\">\n          <ng-container *ngSwitchCase=\"'picture'\">\n            <ng-container *ngIf=\"file.isUploading; else iconNodeFileIcon\">\n              <i nz-icon nzType=\"loading\"></i>\n            </ng-container>\n          </ng-container>\n          <ng-container *ngSwitchCase=\"'picture-card'\">\n            <ng-container *ngIf=\"file.isUploading; else iconNodeFileIcon\">\n              {{ locale.uploading }}\n            </ng-container>\n          </ng-container>\n          <i *ngSwitchDefault nz-icon [nzType]=\"file.isUploading ? 'loading' : 'paper-clip'\"></i>\n        </ng-container>\n      </ng-container>\n      <ng-template\n        #customIconRender\n        [ngTemplateOutlet]=\"iconRender\"\n        [ngTemplateOutletContext]=\"{ $implicit: file }\"\n      ></ng-template>\n      <ng-template #iconNodeFileIcon>\n        <i nz-icon [nzType]=\"file.isImageUrl ? 'picture' : 'file'\" nzTheme=\"twotone\"></i>\n      </ng-template>\n    </ng-template>\n    <ng-template #removeIcon>\n      <button\n        *ngIf=\"icons.showRemoveIcon\"\n        type=\"button\"\n        nz-button\n        nzType=\"text\"\n        nzSize=\"small\"\n        (click)=\"handleRemove(file, $event)\"\n        [attr.title]=\"locale.removeFile\"\n        class=\"ant-upload-list-item-card-actions-btn\"\n      >\n        <i nz-icon nzType=\"delete\"></i>\n      </button>\n    </ng-template>\n    <ng-template #downloadIcon>\n      <button\n        *ngIf=\"file.showDownload\"\n        type=\"button\"\n        nz-button\n        nzType=\"text\"\n        nzSize=\"small\"\n        (click)=\"handleDownload(file)\"\n        [attr.title]=\"locale.downloadFile\"\n        class=\"ant-upload-list-item-card-actions-btn\"\n      >\n        <i nz-icon nzType=\"download\"></i>\n      </button>\n    </ng-template>\n    <ng-template #downloadOrDelete>\n      <span\n        *ngIf=\"listType !== 'picture-card'\"\n        class=\"ant-upload-list-item-card-actions {{ listType === 'picture' ? 'picture' : '' }}\"\n      >\n        <ng-template [ngTemplateOutlet]=\"downloadIcon\"></ng-template>\n        <ng-template [ngTemplateOutlet]=\"removeIcon\"></ng-template>\n      </span>\n    </ng-template>\n    <ng-template #preview>\n      <a\n        *ngIf=\"file.url\"\n        target=\"_blank\"\n        rel=\"noopener noreferrer\"\n        class=\"ant-upload-list-item-name\"\n        [attr.title]=\"file.name\"\n        [href]=\"file.url\"\n        [attr.download]=\"file.linkProps && file.linkProps.download\"\n        (click)=\"handlePreview(file, $event)\"\n      >\n        {{ file.name }}\n      </a>\n      <span\n        *ngIf=\"!file.url\"\n        class=\"ant-upload-list-item-name\"\n        [attr.title]=\"file.name\"\n        (click)=\"handlePreview(file, $event)\"\n      >\n        {{ file.name }}\n      </span>\n      <ng-template [ngTemplateOutlet]=\"downloadOrDelete\"></ng-template>\n    </ng-template>\n    <div class=\"ant-upload-list-item-info\">\n      <span class=\"ant-upload-span\">\n        <ng-template [ngTemplateOutlet]=\"icon\"></ng-template>\n        <ng-template [ngTemplateOutlet]=\"preview\"></ng-template>\n      </span>\n    </div>\n    <span\n      *ngIf=\"listType === 'picture-card' && !file.isUploading\"\n      class=\"ant-upload-list-item-actions\"\n    >\n      <a\n        *ngIf=\"icons.showPreviewIcon\"\n        [href]=\"file.url || file.thumbUrl\"\n        target=\"_blank\"\n        rel=\"noopener noreferrer\"\n        [attr.title]=\"locale.previewFile\"\n        [ngStyle]=\"!(file.url || file.thumbUrl) ? { opacity: 0.5, 'pointer-events': 'none' } : null\"\n        (click)=\"handlePreview(file, $event)\"\n      >\n        <i nz-icon nzType=\"eye\"></i>\n      </a>\n      <ng-container *ngIf=\"file.status === 'done'\">\n        <ng-template [ngTemplateOutlet]=\"downloadIcon\"></ng-template>\n      </ng-container>\n      <ng-template [ngTemplateOutlet]=\"removeIcon\"></ng-template>\n    </span>\n    <div *ngIf=\"file.isUploading\" class=\"ant-upload-list-item-progress\">\n      <nz-progress\n        [nzPercent]=\"file.percent!\"\n        nzType=\"line\"\n        [nzShowInfo]=\"false\"\n        [nzStrokeWidth]=\"2\"\n      ></nz-progress>\n    </div>\n  </div>\n</div>\n",
                animations: [
                    trigger('itemState', [
                        transition(':enter', [style({ height: '0', width: '0', opacity: 0 }), animate(150, style({ height: '*', width: '*', opacity: 1 }))]),
                        transition(':leave', [animate(150, style({ height: '0', width: '0', opacity: 0 }))])
                    ])
                ],
                host: {
                    '[class.ant-upload-list-rtl]': `dir === 'rtl'`,
                    '[class.ant-upload-list-text]': `listType === 'text'`,
                    '[class.ant-upload-list-picture]': `listType === 'picture'`,
                    '[class.ant-upload-list-picture-card]': `listType === 'picture-card'`
                },
                preserveWhitespaces: false,
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
NzUploadListComponent.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
    { type: NgZone },
    { type: Platform },
    { type: ElementRef }
];
NzUploadListComponent.propDecorators = {
    locale: [{ type: Input }],
    listType: [{ type: Input }],
    items: [{ type: Input }],
    icons: [{ type: Input }],
    onPreview: [{ type: Input }],
    onRemove: [{ type: Input }],
    onDownload: [{ type: Input }],
    previewFile: [{ type: Input }],
    previewIsImage: [{ type: Input }],
    iconRender: [{ type: Input }],
    dir: [{ type: Input }]
};
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBsb2FkLWxpc3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vY29tcG9uZW50cy91cGxvYWQvdXBsb2FkLWxpc3QuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUVILE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUUxRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDakQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBRU4saUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBTXZCLE1BQU0sZUFBZSxHQUFHLENBQUMsSUFBWSxFQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUUxRixNQUFNLFlBQVksR0FBRyxHQUFHLENBQUM7QUErQnpCLE1BQU0sT0FBTyxxQkFBcUI7SUEyS2hDLGFBQWE7SUFFYixZQUNVLEdBQXNCLEVBQ0osR0FBYyxFQUNoQyxNQUFjLEVBQ2QsUUFBa0IsRUFDbEIsVUFBc0I7UUFKdEIsUUFBRyxHQUFILEdBQUcsQ0FBbUI7UUFDSixRQUFHLEdBQUgsR0FBRyxDQUFXO1FBQ2hDLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ2xCLGVBQVUsR0FBVixVQUFVLENBQVk7UUFqTGhDLFNBQUksR0FBcUIsRUFBRSxDQUFDO1FBTW5CLFdBQU0sR0FBYyxFQUFFLENBQUM7UUFZdkIsZUFBVSxHQUFnQyxJQUFJLENBQUM7UUFDL0MsUUFBRyxHQUFjLEtBQUssQ0FBQztRQWdLOUIsbURBQW1EO1FBQ25ELElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLENBQUMsQ0FBQztJQUNqRSxDQUFDO0lBbkxELElBQVksT0FBTztRQUNqQixPQUFPLElBQUksQ0FBQyxRQUFRLEtBQUssU0FBUyxJQUFJLElBQUksQ0FBQyxRQUFRLEtBQUssY0FBYyxDQUFDO0lBQ3pFLENBQUM7SUFJRCxJQUNJLEtBQUssQ0FBQyxJQUFvQjtRQUM1QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNuQixDQUFDO0lBVU8sTUFBTSxDQUFDLElBQWtCO1FBQy9CLElBQUksSUFBSSxDQUFDLFFBQVEsSUFBSSxPQUFPLElBQUksQ0FBQyxRQUFRLEtBQUssUUFBUSxFQUFFO1lBQ3RELE9BQU8sSUFBSSxDQUFDLFFBQVEsQ0FBQztTQUN0QjtRQUNELE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7SUFDMUUsQ0FBQztJQUVPLE9BQU8sQ0FBQyxHQUFXO1FBQ3pCLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDNUIsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDdkMsTUFBTSxxQkFBcUIsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hELE9BQU8sQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2hFLENBQUM7SUFFRCxVQUFVLENBQUMsSUFBa0I7UUFDM0IsSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUssQ0FBQyxFQUFFO1lBQy9CLE9BQU8sSUFBSSxDQUFDO1NBQ2I7UUFDRCxNQUFNLEdBQUcsR0FBVyxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQVcsQ0FBQztRQUNoRSxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ1IsT0FBTyxLQUFLLENBQUM7U0FDZDtRQUNELE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEMsSUFBSSxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLDRDQUE0QyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsRUFBRTtZQUM3RixPQUFPLElBQUksQ0FBQztTQUNiO2FBQU0sSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQzdCLDZCQUE2QjtZQUM3QixPQUFPLEtBQUssQ0FBQztTQUNkO2FBQU0sSUFBSSxTQUFTLEVBQUU7WUFDcEIsd0NBQXdDO1lBQ3hDLE9BQU8sS0FBSyxDQUFDO1NBQ2Q7UUFDRCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7SUFFTyxXQUFXLENBQUMsSUFBb0I7UUFDdEMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDakIsT0FBTyxFQUFFLENBQUM7U0FDWDtRQUNELElBQUksSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLFFBQVEsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRTtZQUNyRCxPQUFPLFdBQVcsQ0FBQztTQUNwQjthQUFNO1lBQ0wsT0FBTyxXQUFXLENBQUM7U0FDcEI7SUFDSCxDQUFDO0lBRU8sWUFBWSxDQUFDLElBQWlCO1FBQ3BDLE9BQU8sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7WUFDM0IsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRTtnQkFDM0QsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNaLE9BQU87YUFDUjtZQUNELElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsR0FBRyxFQUFFO2dCQUNqQyxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztnQkFDaEQsTUFBTSxDQUFDLEtBQUssR0FBRyxZQUFZLENBQUM7Z0JBQzVCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsWUFBWSxDQUFDO2dCQUM3QixNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyw0Q0FBNEMsWUFBWSxlQUFlLFlBQVksbUNBQW1DLENBQUM7Z0JBQzlJLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDbEMsTUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDcEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztnQkFDeEIsR0FBRyxDQUFDLE1BQU0sR0FBRyxHQUFHLEVBQUU7b0JBQ2hCLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEdBQUcsR0FBRyxDQUFDO29CQUU5QixJQUFJLFNBQVMsR0FBRyxZQUFZLENBQUM7b0JBQzdCLElBQUksVUFBVSxHQUFHLFlBQVksQ0FBQztvQkFDOUIsSUFBSSxPQUFPLEdBQUcsQ0FBQyxDQUFDO29CQUNoQixJQUFJLE9BQU8sR0FBRyxDQUFDLENBQUM7b0JBRWhCLElBQUksS0FBSyxHQUFHLE1BQU0sRUFBRTt3QkFDbEIsVUFBVSxHQUFHLE1BQU0sR0FBRyxDQUFDLFlBQVksR0FBRyxLQUFLLENBQUMsQ0FBQzt3QkFDN0MsT0FBTyxHQUFHLENBQUMsQ0FBQyxVQUFVLEdBQUcsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3FCQUN6Qzt5QkFBTTt3QkFDTCxTQUFTLEdBQUcsS0FBSyxHQUFHLENBQUMsWUFBWSxHQUFHLE1BQU0sQ0FBQyxDQUFDO3dCQUM1QyxPQUFPLEdBQUcsQ0FBQyxDQUFDLFNBQVMsR0FBRyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7cUJBQ3pDO29CQUVELElBQUk7d0JBQ0YsR0FBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7cUJBQzlEO29CQUFDLFdBQU0sR0FBRTtvQkFDVixNQUFNLE9BQU8sR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7b0JBQ25DLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFFbEMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNuQixDQUFDLENBQUM7Z0JBQ0YsR0FBRyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3QyxDQUFDLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVPLFFBQVE7UUFDZCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUU7WUFDNUIsT0FBTztTQUNSO1FBRUQsTUFBTSxHQUFHLEdBQUcsTUFBbUIsQ0FBQztRQUNoQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sSUFBSSxPQUFPLFFBQVEsS0FBSyxXQUFXLElBQUksT0FBTyxHQUFHLEtBQUssV0FBVyxJQUFJLENBQUMsR0FBRyxDQUFDLFVBQVUsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUU7WUFDbEgsT0FBTztTQUNSO1FBQ0QsSUFBSSxDQUFDLElBQUk7YUFDTixNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsYUFBYSxZQUFZLElBQUksSUFBSSxJQUFJLENBQUMsUUFBUSxLQUFLLFNBQVMsQ0FBQzthQUNqRixPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDZCxJQUFJLENBQUMsUUFBUSxHQUFHLEVBQUUsQ0FBQztZQUNuQixDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGFBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dCQUM5RyxJQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQztnQkFDeEIsSUFBSSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQ3ZCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU8sWUFBWSxDQUFDLElBQWtCO1FBQ3JDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxnQkFBZ0IsSUFBSSxJQUFJLENBQUMsTUFBTSxLQUFLLE1BQU0sQ0FBQyxDQUFDO0lBQ25FLENBQUM7SUFFTyxPQUFPO1FBQ2IsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDdkIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxLQUFLLFdBQVcsQ0FBQztZQUMvQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDakMsSUFBSSxDQUFDLFNBQVMsR0FBRyxPQUFPLElBQUksQ0FBQyxTQUFTLEtBQUssUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUNsRyxJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUYsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQ3ZDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM5QyxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxhQUFhLENBQUMsSUFBa0IsRUFBRSxDQUFRO1FBQ3hDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFO1lBQ25CLE9BQU87U0FDUjtRQUVELENBQUMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUNuQixPQUFPLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztJQUVELFlBQVksQ0FBQyxJQUFrQixFQUFFLENBQVE7UUFDdkMsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ25CLElBQUksSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNqQixJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3JCO1FBQ0QsT0FBTztJQUNULENBQUM7SUFFRCxjQUFjLENBQUMsSUFBa0I7UUFDL0IsSUFBSSxPQUFPLElBQUksQ0FBQyxVQUFVLEtBQUssVUFBVSxFQUFFO1lBQ3pDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDdkI7YUFBTSxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUU7WUFDbkIsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7U0FDdkI7SUFDSCxDQUFDO0lBZUQsYUFBYTtRQUNYLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNmLElBQUksQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDZixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDbEIsQ0FBQzs7O1lBcE5GLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsZ0JBQWdCO2dCQUMxQixRQUFRLEVBQUUsY0FBYztnQkFDeEIsNm5NQUEyQztnQkFDM0MsVUFBVSxFQUFFO29CQUNWLE9BQU8sQ0FBQyxXQUFXLEVBQUU7d0JBQ25CLFVBQVUsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsT0FBTyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUNwSSxVQUFVLENBQUMsUUFBUSxFQUFFLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO3FCQUNyRixDQUFDO2lCQUNIO2dCQUNELElBQUksRUFBRTtvQkFDSiw2QkFBNkIsRUFBRSxlQUFlO29CQUM5Qyw4QkFBOEIsRUFBRSxxQkFBcUI7b0JBQ3JELGlDQUFpQyxFQUFFLHdCQUF3QjtvQkFDM0Qsc0NBQXNDLEVBQUUsNkJBQTZCO2lCQUN0RTtnQkFDRCxtQkFBbUIsRUFBRSxLQUFLO2dCQUMxQixhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07YUFDaEQ7OztZQTlDQyxpQkFBaUI7NENBOE5kLE1BQU0sU0FBQyxRQUFRO1lBek5sQixNQUFNO1lBVEMsUUFBUTtZQU1mLFVBQVU7OztxQkFvRFQsS0FBSzt1QkFDTCxLQUFLO29CQUNMLEtBQUs7b0JBSUwsS0FBSzt3QkFDTCxLQUFLO3VCQUNMLEtBQUs7eUJBQ0wsS0FBSzswQkFDTCxLQUFLOzZCQUNMLEtBQUs7eUJBQ0wsS0FBSztrQkFDTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2dpdGh1Yi5jb20vTkctWk9SUk8vbmctem9ycm8tYW50ZC9ibG9iL21hc3Rlci9MSUNFTlNFXG4gKi9cblxuaW1wb3J0IHsgYW5pbWF0ZSwgc3R5bGUsIHRyYW5zaXRpb24sIHRyaWdnZXIgfSBmcm9tICdAYW5ndWxhci9hbmltYXRpb25zJztcbmltcG9ydCB7IERpcmVjdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7IFBsYXRmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uQ2hhbmdlcyxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOelNhZmVBbnkgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvdHlwZXMnO1xuaW1wb3J0IHsgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xuXG5pbXBvcnQgeyBOekljb25SZW5kZXJUZW1wbGF0ZSwgTnpTaG93VXBsb2FkTGlzdCwgTnpVcGxvYWRGaWxlLCBOelVwbG9hZExpc3RUeXBlIH0gZnJvbSAnLi9pbnRlcmZhY2UnO1xuXG5jb25zdCBpc0ltYWdlRmlsZVR5cGUgPSAodHlwZTogc3RyaW5nKTogYm9vbGVhbiA9PiAhIXR5cGUgJiYgdHlwZS5pbmRleE9mKCdpbWFnZS8nKSA9PT0gMDtcblxuY29uc3QgTUVBU1VSRV9TSVpFID0gMjAwO1xuXG50eXBlIFVwbG9hZExpc3RJY29uVHlwZSA9ICcnIHwgJ3VwbG9hZGluZycgfCAndGh1bWJuYWlsJztcblxuaW50ZXJmYWNlIFVwbG9hZExpc3RGaWxlIGV4dGVuZHMgTnpVcGxvYWRGaWxlIHtcbiAgaXNJbWFnZVVybD86IGJvb2xlYW47XG4gIGlzVXBsb2FkaW5nPzogYm9vbGVhbjtcbiAgaWNvblR5cGU/OiBVcGxvYWRMaXN0SWNvblR5cGU7XG4gIHNob3dEb3dubG9hZD86IGJvb2xlYW47XG59XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ256LXVwbG9hZC1saXN0JyxcbiAgZXhwb3J0QXM6ICduelVwbG9hZExpc3QnLFxuICB0ZW1wbGF0ZVVybDogJy4vdXBsb2FkLWxpc3QuY29tcG9uZW50Lmh0bWwnLFxuICBhbmltYXRpb25zOiBbXG4gICAgdHJpZ2dlcignaXRlbVN0YXRlJywgW1xuICAgICAgdHJhbnNpdGlvbignOmVudGVyJywgW3N0eWxlKHsgaGVpZ2h0OiAnMCcsIHdpZHRoOiAnMCcsIG9wYWNpdHk6IDAgfSksIGFuaW1hdGUoMTUwLCBzdHlsZSh7IGhlaWdodDogJyonLCB3aWR0aDogJyonLCBvcGFjaXR5OiAxIH0pKV0pLFxuICAgICAgdHJhbnNpdGlvbignOmxlYXZlJywgW2FuaW1hdGUoMTUwLCBzdHlsZSh7IGhlaWdodDogJzAnLCB3aWR0aDogJzAnLCBvcGFjaXR5OiAwIH0pKV0pXG4gICAgXSlcbiAgXSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3MuYW50LXVwbG9hZC1saXN0LXJ0bF0nOiBgZGlyID09PSAncnRsJ2AsXG4gICAgJ1tjbGFzcy5hbnQtdXBsb2FkLWxpc3QtdGV4dF0nOiBgbGlzdFR5cGUgPT09ICd0ZXh0J2AsXG4gICAgJ1tjbGFzcy5hbnQtdXBsb2FkLWxpc3QtcGljdHVyZV0nOiBgbGlzdFR5cGUgPT09ICdwaWN0dXJlJ2AsXG4gICAgJ1tjbGFzcy5hbnQtdXBsb2FkLWxpc3QtcGljdHVyZS1jYXJkXSc6IGBsaXN0VHlwZSA9PT0gJ3BpY3R1cmUtY2FyZCdgXG4gIH0sXG4gIHByZXNlcnZlV2hpdGVzcGFjZXM6IGZhbHNlLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBOelVwbG9hZExpc3RDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMge1xuICBsaXN0OiBVcGxvYWRMaXN0RmlsZVtdID0gW107XG5cbiAgcHJpdmF0ZSBnZXQgc2hvd1BpYygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5saXN0VHlwZSA9PT0gJ3BpY3R1cmUnIHx8IHRoaXMubGlzdFR5cGUgPT09ICdwaWN0dXJlLWNhcmQnO1xuICB9XG5cbiAgQElucHV0KCkgbG9jYWxlOiBOelNhZmVBbnkgPSB7fTtcbiAgQElucHV0KCkgbGlzdFR5cGUhOiBOelVwbG9hZExpc3RUeXBlO1xuICBASW5wdXQoKVxuICBzZXQgaXRlbXMobGlzdDogTnpVcGxvYWRGaWxlW10pIHtcbiAgICB0aGlzLmxpc3QgPSBsaXN0O1xuICB9XG4gIEBJbnB1dCgpIGljb25zITogTnpTaG93VXBsb2FkTGlzdDtcbiAgQElucHV0KCkgb25QcmV2aWV3PzogKGZpbGU6IE56VXBsb2FkRmlsZSkgPT4gdm9pZDtcbiAgQElucHV0KCkgb25SZW1vdmUhOiAoZmlsZTogTnpVcGxvYWRGaWxlKSA9PiB2b2lkO1xuICBASW5wdXQoKSBvbkRvd25sb2FkPzogKGZpbGU6IE56VXBsb2FkRmlsZSkgPT4gdm9pZDtcbiAgQElucHV0KCkgcHJldmlld0ZpbGU/OiAoZmlsZTogTnpVcGxvYWRGaWxlKSA9PiBPYnNlcnZhYmxlPHN0cmluZz47XG4gIEBJbnB1dCgpIHByZXZpZXdJc0ltYWdlPzogKGZpbGU6IE56VXBsb2FkRmlsZSkgPT4gYm9vbGVhbjtcbiAgQElucHV0KCkgaWNvblJlbmRlcjogTnpJY29uUmVuZGVyVGVtcGxhdGUgfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgZGlyOiBEaXJlY3Rpb24gPSAnbHRyJztcblxuICBwcml2YXRlIGdlbkVycihmaWxlOiBOelVwbG9hZEZpbGUpOiBzdHJpbmcge1xuICAgIGlmIChmaWxlLnJlc3BvbnNlICYmIHR5cGVvZiBmaWxlLnJlc3BvbnNlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIGZpbGUucmVzcG9uc2U7XG4gICAgfVxuICAgIHJldHVybiAoZmlsZS5lcnJvciAmJiBmaWxlLmVycm9yLnN0YXR1c1RleHQpIHx8IHRoaXMubG9jYWxlLnVwbG9hZEVycm9yO1xuICB9XG5cbiAgcHJpdmF0ZSBleHRuYW1lKHVybDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCB0ZW1wID0gdXJsLnNwbGl0KCcvJyk7XG4gICAgY29uc3QgZmlsZW5hbWUgPSB0ZW1wW3RlbXAubGVuZ3RoIC0gMV07XG4gICAgY29uc3QgZmlsZW5hbWVXaXRob3V0U3VmZml4ID0gZmlsZW5hbWUuc3BsaXQoLyN8XFw/LylbMF07XG4gICAgcmV0dXJuICgvXFwuW14uL1xcXFxdKiQvLmV4ZWMoZmlsZW5hbWVXaXRob3V0U3VmZml4KSB8fCBbJyddKVswXTtcbiAgfVxuXG4gIGlzSW1hZ2VVcmwoZmlsZTogTnpVcGxvYWRGaWxlKTogYm9vbGVhbiB7XG4gICAgaWYgKGlzSW1hZ2VGaWxlVHlwZShmaWxlLnR5cGUhKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGNvbnN0IHVybDogc3RyaW5nID0gKGZpbGUudGh1bWJVcmwgfHwgZmlsZS51cmwgfHwgJycpIGFzIHN0cmluZztcbiAgICBpZiAoIXVybCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBleHRlbnNpb24gPSB0aGlzLmV4dG5hbWUodXJsKTtcbiAgICBpZiAoL15kYXRhOmltYWdlXFwvLy50ZXN0KHVybCkgfHwgLyh3ZWJwfHN2Z3xwbmd8Z2lmfGpwZ3xqcGVnfGpmaWZ8Ym1wfGRwZykkL2kudGVzdChleHRlbnNpb24pKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKC9eZGF0YTovLnRlc3QodXJsKSkge1xuICAgICAgLy8gb3RoZXIgZmlsZSB0eXBlcyBvZiBiYXNlNjRcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKGV4dGVuc2lvbikge1xuICAgICAgLy8gb3RoZXIgZmlsZSB0eXBlcyB3aGljaCBoYXZlIGV4dGVuc2lvblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0SWNvblR5cGUoZmlsZTogVXBsb2FkTGlzdEZpbGUpOiBVcGxvYWRMaXN0SWNvblR5cGUge1xuICAgIGlmICghdGhpcy5zaG93UGljKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGlmIChmaWxlLmlzVXBsb2FkaW5nIHx8ICghZmlsZS50aHVtYlVybCAmJiAhZmlsZS51cmwpKSB7XG4gICAgICByZXR1cm4gJ3VwbG9hZGluZyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAndGh1bWJuYWlsJztcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHByZXZpZXdJbWFnZShmaWxlOiBGaWxlIHwgQmxvYik6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgaWYgKCFpc0ltYWdlRmlsZVR5cGUoZmlsZS50eXBlKSB8fCAhdGhpcy5wbGF0Zm9ybS5pc0Jyb3dzZXIpIHtcbiAgICAgICAgcmVzb2x2ZSgnJyk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgY29uc3QgY2FudmFzID0gdGhpcy5kb2MuY3JlYXRlRWxlbWVudCgnY2FudmFzJyk7XG4gICAgICAgIGNhbnZhcy53aWR0aCA9IE1FQVNVUkVfU0laRTtcbiAgICAgICAgY2FudmFzLmhlaWdodCA9IE1FQVNVUkVfU0laRTtcbiAgICAgICAgY2FudmFzLnN0eWxlLmNzc1RleHQgPSBgcG9zaXRpb246IGZpeGVkOyBsZWZ0OiAwOyB0b3A6IDA7IHdpZHRoOiAke01FQVNVUkVfU0laRX1weDsgaGVpZ2h0OiAke01FQVNVUkVfU0laRX1weDsgei1pbmRleDogOTk5OTsgZGlzcGxheTogbm9uZTtgO1xuICAgICAgICB0aGlzLmRvYy5ib2R5LmFwcGVuZENoaWxkKGNhbnZhcyk7XG4gICAgICAgIGNvbnN0IGN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICBjb25zdCBpbWcgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgaW1nLm9ubG9hZCA9ICgpID0+IHtcbiAgICAgICAgICBjb25zdCB7IHdpZHRoLCBoZWlnaHQgfSA9IGltZztcblxuICAgICAgICAgIGxldCBkcmF3V2lkdGggPSBNRUFTVVJFX1NJWkU7XG4gICAgICAgICAgbGV0IGRyYXdIZWlnaHQgPSBNRUFTVVJFX1NJWkU7XG4gICAgICAgICAgbGV0IG9mZnNldFggPSAwO1xuICAgICAgICAgIGxldCBvZmZzZXRZID0gMDtcblxuICAgICAgICAgIGlmICh3aWR0aCA8IGhlaWdodCkge1xuICAgICAgICAgICAgZHJhd0hlaWdodCA9IGhlaWdodCAqIChNRUFTVVJFX1NJWkUgLyB3aWR0aCk7XG4gICAgICAgICAgICBvZmZzZXRZID0gLShkcmF3SGVpZ2h0IC0gZHJhd1dpZHRoKSAvIDI7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRyYXdXaWR0aCA9IHdpZHRoICogKE1FQVNVUkVfU0laRSAvIGhlaWdodCk7XG4gICAgICAgICAgICBvZmZzZXRYID0gLShkcmF3V2lkdGggLSBkcmF3SGVpZ2h0KSAvIDI7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGN0eCEuZHJhd0ltYWdlKGltZywgb2Zmc2V0WCwgb2Zmc2V0WSwgZHJhd1dpZHRoLCBkcmF3SGVpZ2h0KTtcbiAgICAgICAgICB9IGNhdGNoIHt9XG4gICAgICAgICAgY29uc3QgZGF0YVVSTCA9IGNhbnZhcy50b0RhdGFVUkwoKTtcbiAgICAgICAgICB0aGlzLmRvYy5ib2R5LnJlbW92ZUNoaWxkKGNhbnZhcyk7XG5cbiAgICAgICAgICByZXNvbHZlKGRhdGFVUkwpO1xuICAgICAgICB9O1xuICAgICAgICBpbWcuc3JjID0gd2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwoZmlsZSk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgZ2VuVGh1bWIoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLnBsYXRmb3JtLmlzQnJvd3Nlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHdpbiA9IHdpbmRvdyBhcyBOelNhZmVBbnk7XG4gICAgaWYgKCF0aGlzLnNob3dQaWMgfHwgdHlwZW9mIGRvY3VtZW50ID09PSAndW5kZWZpbmVkJyB8fCB0eXBlb2Ygd2luID09PSAndW5kZWZpbmVkJyB8fCAhd2luLkZpbGVSZWFkZXIgfHwgIXdpbi5GaWxlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMubGlzdFxuICAgICAgLmZpbHRlcihmaWxlID0+IGZpbGUub3JpZ2luRmlsZU9iaiBpbnN0YW5jZW9mIEZpbGUgJiYgZmlsZS50aHVtYlVybCA9PT0gdW5kZWZpbmVkKVxuICAgICAgLmZvckVhY2goZmlsZSA9PiB7XG4gICAgICAgIGZpbGUudGh1bWJVcmwgPSAnJztcbiAgICAgICAgKHRoaXMucHJldmlld0ZpbGUgPyB0aGlzLnByZXZpZXdGaWxlKGZpbGUpLnRvUHJvbWlzZSgpIDogdGhpcy5wcmV2aWV3SW1hZ2UoZmlsZS5vcmlnaW5GaWxlT2JqISkpLnRoZW4oZGF0YVVybCA9PiB7XG4gICAgICAgICAgZmlsZS50aHVtYlVybCA9IGRhdGFVcmw7XG4gICAgICAgICAgdGhpcy5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHNob3dEb3dubG9hZChmaWxlOiBOelVwbG9hZEZpbGUpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISEodGhpcy5pY29ucy5zaG93RG93bmxvYWRJY29uICYmIGZpbGUuc3RhdHVzID09PSAnZG9uZScpO1xuICB9XG5cbiAgcHJpdmF0ZSBmaXhEYXRhKCk6IHZvaWQge1xuICAgIHRoaXMubGlzdC5mb3JFYWNoKGZpbGUgPT4ge1xuICAgICAgZmlsZS5pc1VwbG9hZGluZyA9IGZpbGUuc3RhdHVzID09PSAndXBsb2FkaW5nJztcbiAgICAgIGZpbGUubWVzc2FnZSA9IHRoaXMuZ2VuRXJyKGZpbGUpO1xuICAgICAgZmlsZS5saW5rUHJvcHMgPSB0eXBlb2YgZmlsZS5saW5rUHJvcHMgPT09ICdzdHJpbmcnID8gSlNPTi5wYXJzZShmaWxlLmxpbmtQcm9wcykgOiBmaWxlLmxpbmtQcm9wcztcbiAgICAgIGZpbGUuaXNJbWFnZVVybCA9IHRoaXMucHJldmlld0lzSW1hZ2UgPyB0aGlzLnByZXZpZXdJc0ltYWdlKGZpbGUpIDogdGhpcy5pc0ltYWdlVXJsKGZpbGUpO1xuICAgICAgZmlsZS5pY29uVHlwZSA9IHRoaXMuZ2V0SWNvblR5cGUoZmlsZSk7XG4gICAgICBmaWxlLnNob3dEb3dubG9hZCA9IHRoaXMuc2hvd0Rvd25sb2FkKGZpbGUpO1xuICAgIH0pO1xuICB9XG5cbiAgaGFuZGxlUHJldmlldyhmaWxlOiBOelVwbG9hZEZpbGUsIGU6IEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLm9uUHJldmlldykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICByZXR1cm4gdGhpcy5vblByZXZpZXcoZmlsZSk7XG4gIH1cblxuICBoYW5kbGVSZW1vdmUoZmlsZTogTnpVcGxvYWRGaWxlLCBlOiBFdmVudCk6IHZvaWQge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAodGhpcy5vblJlbW92ZSkge1xuICAgICAgdGhpcy5vblJlbW92ZShmaWxlKTtcbiAgICB9XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgaGFuZGxlRG93bmxvYWQoZmlsZTogTnpVcGxvYWRGaWxlKTogdm9pZCB7XG4gICAgaWYgKHR5cGVvZiB0aGlzLm9uRG93bmxvYWQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRoaXMub25Eb3dubG9hZChmaWxlKTtcbiAgICB9IGVsc2UgaWYgKGZpbGUudXJsKSB7XG4gICAgICB3aW5kb3cub3BlbihmaWxlLnVybCk7XG4gICAgfVxuICB9XG5cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBASW5qZWN0KERPQ1VNRU5UKSBwcml2YXRlIGRvYzogTnpTYWZlQW55LFxuICAgIHByaXZhdGUgbmdab25lOiBOZ1pvbmUsXG4gICAgcHJpdmF0ZSBwbGF0Zm9ybTogUGxhdGZvcm0sXG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmXG4gICkge1xuICAgIC8vIFRPRE86IG1vdmUgdG8gaG9zdCBhZnRlciBWaWV3IEVuZ2luZSBkZXByZWNhdGlvblxuICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FudC11cGxvYWQtbGlzdCcpO1xuICB9XG5cbiAgZGV0ZWN0Q2hhbmdlcygpOiB2b2lkIHtcbiAgICB0aGlzLmZpeERhdGEoKTtcbiAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcygpOiB2b2lkIHtcbiAgICB0aGlzLmZpeERhdGEoKTtcbiAgICB0aGlzLmdlblRodW1iKCk7XG4gIH1cbn1cbiJdfQ==