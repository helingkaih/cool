import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
@Component({
    selector: 'app-form-doc',
    templateUrl: './form-doc.component.html',
    styleUrls: ['./form-doc.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormDocComponent implements OnInit {
    toForm: string = `
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
    `;
    formDataTable: Array<object> = [
        { parameter: 'display', explain: '必填，字段的显示方式', type: 'string', default: ' 0 | 1 | 2 | 3 | 4 ' },
        { parameter: 'type', explain: '必填，字段的类型，处理表单数据的时候会根据这个参数进行处理', type: 'string', default: ' Dropdown | Checkbox | ......' },
        { parameter: 'name', explain: '必填，字段的唯一标识，也就是 key', type: 'string', default: '' },
        { parameter: 'label', explain: '必填，字段的名称', type: 'string', default: '' },
        { parameter: 'default', explain: '必填，字段的值', type: 'string', default: '' },
        { parameter: 'placeholder', explain: '非必填，位于字段内容框中的的提示信息', type: 'string', default: '' },
        { parameter: 'options', explain: '非必填，下拉选类型字段才会有的内容选项', type: 'object', default: '' },
        { parameter: 'multiple', explain: '非必填，下拉选类型字段才会有的配置项，是否多选', type: 'number', default: '' },
    ];
    linkList: Array<{ title: string, href: string }> = [
        { title: '什么是表单组件', href: 'form-doc-what' },
        { title: '系统中是怎么使用表单组件的', href: 'form-doc-use' },
        { title: '为什么会有个新的 FormService', href: 'form-doc-whyNew' },
        { title: '什么是 FormGroup', href: 'form-doc-whatFormGroup' },
        { title: '什么是 FormOrder', href: 'form-doc-whatFormOrder' },
        { title: 'FormData 的参数说明', href: 'form-doc-FormDataParams' },
    ];
    constructor() { }

    ngOnInit(): void {
    }

}
