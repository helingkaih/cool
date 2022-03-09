import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-form-service',
    templateUrl: './form-service.component.html',
    styleUrls: ['./form-service.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormServiceComponent implements OnInit {
    linkList: Array<{ title: string, href: string }> = [
        { title: '系统中是怎么使用表单组件的', href: 'form-service-use' },
        { title: '代码说明', href: 'form-service-use' },
        { title: '旧代码问题所在', href: 'form-service-badCode' },
        { title: '注意事项', href: 'form-service-attention' },
        { title: '未来计划', href: 'form-service-feature' }
    ];
    useForm: string = `
import { DealDataService } from 'src/app/core/services/deal-data.service';
@Component({
    ......
    providers: [DealDataService], // 新的 form 处理方法没有全局注入,需要在此单独提供
    changeDetection: ChangeDetectionStrategy.OnPush
})
......
constructor(
    private dds: DealDataService,
){}
......
// 将获取到的数据传入新 form 处理方法
this.formdatas = this.dds.getFormData(data['formData'], this.languageMap);
    `; // 如何使用
    formServiceCode: string = `
......
/**
 * 处理表单数据
 * @param data
 * @param languageMap
 */
getFormData(data, languageMap?) {
    this.languageMap = languageMap;
    let formdata = {};
    for (let key in data) {
        let item = data[key];
        // 增加额外的属性
        let prop = {
            value: item.default,
            defaultBak: item.default
        };
        // 根据工单原值的值，更新display数据
        if (item['updateOperations'] == '1' && item['display'] != '0') {
            item['display'] = '3';
        };
        Object.assign(item, prop);

        // 处理各种类型的数据,存在部分类型的数据不需要处理
        if (this[item.type]) {
            this[item.type](item)
        } else if (item.type == 'FieldGroup' || item.type == 'GroupView') {
            item['fieldOrder'] = item['fieldOrder'] || [];
        }
        formdata[item.name] = item;
    };
    return formdata;
}
......
    `;
    dropDown: string = `
/**
 * 处理 Dropdown 类型的数据
 * @param item
 */
Dropdown(item) {
    if (item.multiple === 1) {
        // 处理下拉多选的value值，后台返回的值如果是字符串并用逗号隔开的，则拆分成数组，以便显示
        if (item['value'] && typeof item['value'] === 'string') {
            item['value'] = item['value'].split(',');
        } else if (!Array.isArray(item['value'])) { // 如果不是数组需转成数组
            item['value'] = [];
        }
    };
    let newOpt = [];
    /**
     * 处理 被隐藏过滤掉的字段(默认值不在下拉选项中)
     */
    if (this.isNotEmptyObject(item.options)) {
        // 目前所有选项都走翻译,之后可以优化,让后端加个参数判断是否需要翻译
        // if (this.languageMap && !item.disLangTrans) {
        //     for (let key in item.options) {
        //         item.options[key] = this.languageTranslate(item.options[key]);
        //     };
        // };
        if (item.hasOwnProperty('tagOptions')) {
            // 当存在 tagOptions 更新 options
            this.filterTagOptions(item.options, item.tagOptions);
        };
        newOpt = this.handleOptions(item);
    };
    item['newOptions'] = newOpt;
    item['formeleOptions'] = item['options'];
    this.dealDefaultValue(item);
}
    `;
    handleOptions: string = `
/**
 * label -value 属性的组装
 * 把{'a1' : 'A1'} 组装成 {'label' : 'a1', 'value' : 'A1'};
 * @param dataOpt
 * @param langTran
 * @returns
 */
handleOptions(item) {
    let options = item.options;
    if (!options) {
        return options;
    }
    const optionsNew = [];
    let opt = {};
    for (let key in options) {
        opt = {
            value: key,
            label: options[key]
        };
        optionsNew.push(opt);
    }
    return optionsNew;
}
    `;
    badCode1: string = `
options['multiple'] = operation[i].multiple;  // 默认为0， 单选模式, 1是多选（数字）
options['autoComplete'] = operation[i].autoComplete;  //  默认为1，可搜索， 0： 不可搜索（数字）
options['optionsShowType'] = operation[i].optionsShowType; // 下拉字段表单中显示的类型（show/hidden）
options['optionsShowValue'] = operation[i].optionsShowValue; // 下拉字段表单中显示的选项值
options['optionsTranslable'] = operation[i].optionsTranslable;

options['serveSearch'] = operation[i].serveSearch;  // 默认为0， 可搜索服务端
options['serveAction'] = operation[i].serveAction;  //  搜索action
options['serveSubaction'] = operation[i].serveSubaction; // 搜索subaction
options['serveValueKeys'] = operation[i].serveValueKeys; // 传值key
options['serveMaxResults'] = operation[i].serveMaxResults; //
    `;
    badCode2: string = `
super(options);
this.options           = options['options'] ||  '';
this.newOptions        = options['newOptions'] || [];
this.multiple          = options['multiple'] || 0;
this.autoComplete      = options['autoComplete'] || 1;
this.optionsShowType   = options['optionsShowType'];
this.optionsShowValue  = options['optionsShowValue'];
this.optionsTranslable = options['optionsTranslable'];
this.formeleOptions    = options['formeleOptions'] || {};
    `;
    constructor() { }

    ngOnInit(): void {
    }

}
