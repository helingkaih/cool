import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { exportExcel } from './export';
import LuckyExcel from 'luckyexcel';
declare var luckysheet: any;

@Component({
    selector: 'app-excel',
    templateUrl: './excel.component.html',
    styleUrls: ['./excel.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExcelComponent implements OnInit {
    jsList: Array<string> = [
        "https://cdn.jsdelivr.net/npm/luckysheet/dist/plugins/js/plugin.js",
        "https://cdn.jsdelivr.net/npm/luckysheet/dist/luckysheet.umd.js"
    ];
    linkList: Array<string> = [
        "https://cdn.jsdelivr.net/npm/luckysheet/dist/plugins/css/pluginsCss.css'",
        "https://cdn.jsdelivr.net/npm/luckysheet/dist/plugins/plugins.css",
        "https://cdn.jsdelivr.net/npm/luckysheet/dist/css/luckysheet.css",
        "https://cdn.jsdelivr.net/npm/luckysheet/dist/assets/iconfont/iconfont.css"
    ];
    targetData;
    constructor() { }

    ngOnInit(): void {
    }

    ngAfterViewInit() {
        var options = {
            container: 'luckysheet', //luckysheet为容器id
            title: 'service cool', // 设定表格名称
            lang: 'zh', // 设定表格语言
            column: 30, // 列
            row: 80 // 行
        }
        luckysheet.create(options)
    }

    /**
     * 导出当前表格
     */
    expotr() {
        // let data = luckysheet.getSheet();
        // console.log('data', data)
        exportExcel(luckysheet.getAllSheets(), "下载")
    }

    xuanqv() {
        let a = luckysheet.getRangeValuesWithFlatte();
        console.log('a', a)
    }

    suoding() {
        this.targetData = luckysheet.getRangeValue();
        // luckysheet.setRangeValue(data, { range: "A1:B2" })
    }

    pizhu() {
        let pizhu = luckysheet.getRangeValue();
        for (let aindex in this.targetData) {
            for (let bindex in this.targetData[aindex]) {
                if (pizhu[aindex][bindex]) {
                    this.targetData[aindex][bindex]['ps'] = {
                        value: pizhu[aindex][bindex].v
                    };
                };
            };
        }

        // set 多少区域，数组就得多长  A1:A3 是3块，这块数组就得只有3个元素
        let data = [this.targetData[0], this.targetData[1], this.targetData[2]]

        luckysheet.setRangeValue(data, { range: "A1:A3" })
    }

    /**
     * 导入数据
     * @param evt 
     * @returns 
     */
    import(evt: any) {
        const files = evt.target.files;
        if (files == null || files.length == 0) {
            alert("No files wait for import");
            return;
        }
        let name = files[0].name;
        let suffixArr = name.split("."), suffix = suffixArr[suffixArr.length - 1];
        if (suffix != "xlsx") {
            alert("Currently only supports the import of xlsx files");
            return;
        }
        LuckyExcel.transformExcelToLucky(files[0], function (exportJson: { sheets: string | any[] | null; info: { name: { creator: any; }; }; }, luckysheetfile: any) {
            if (exportJson.sheets == null || exportJson.sheets.length == 0) {
                alert("Failed to read the content of the excel file, currently does not support xls files!");
                return;
            }
            console.log('exportJson', exportJson)
            luckysheet.destroy();
            luckysheet.create({
                container: 'luckysheet', //luckysheet is the container id
                showinfobar: false,
                data: exportJson.sheets,
                title: exportJson.info.name,
                userInfo: exportJson.info.name.creator
            });
        });
    }


}
