import { ChangeDetectionStrategy, Component, ElementRef, OnInit } from '@angular/core';
import { fromEvent } from 'rxjs';

@Component({
    selector: 'app-virtual',
    templateUrl: './virtual.component.html',
    styleUrls: ['./virtual.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VirtualComponent implements OnInit {
    noVirtual: boolean = false; // 展示不使用虚拟滚动
    useVirtual: boolean = false; // 展示使用虚拟滚动
    data: Array<string> = []; // 用来演示用的列表数据
    container; // 当前虚拟列表容器的 dom 对象
    itemHeight; // 每一项高度
    containerUL; // 容器内的 ul dom 对象
    maxHeight; // 容器最大高度
    showItemCount; // 一次性渲染多少条数据
    items; // 当前可见的列表数据
    startIndex; // 可见列表数据的下标
    linkList: Array<{ title: string, href: string, child?: Array<{}> }> = [
        { title: '什么是虚拟滚动', href: 'virtual-what' },
        { title: '效果演示', href: 'virtual-demo' },
        { title: '原理分析', href: 'virtual-how' },
        { title: '代码讲解', href: 'virtual-code' },
    ]
    initSettingCode: string = `
/**
 * 初始化配置
 */
initSetting() {
    setTimeout(() => {
        this.itemHeight = 220;//每一项的高度
        this.container = document.getElementById('list');//容器
        this.containerUL = this.container.getElementsByTagName('ul')[0];//容器内的ul
        this.maxHeight = 800;
        this.showItemCount = Math.ceil(this.maxHeight / this.itemHeight) + 1;//视图区域显示item的个数
        this.items = [];//可见列表项
        this.startIndex = 0;//第一个item索引
        //初始化数据
        this.initData();
        // 监听滚动事件
        fromEvent(this.container, 'scroll')
            .subscribe(() => {
                this.scrollEvent()
            });
    }, 0);
}
    `;
    initDataCode: string = `
/**
 * 处理初始渲染的数据
 * @param data
 */
initData() {
    var realHeight = this.data.length * this.itemHeight;

    if (realHeight > this.maxHeight) {
        this.container.style.height = this.maxHeight + 'px';
        this.showItemCount = Math.ceil(this.maxHeight / this.itemHeight) + 1; // 视图区域显示item的个数
    } else {
        this.container.style.height = realHeight + 'px';
        this.showItemCount = this.data.length + 1; // 视图区域显示item的个数
    };
    this.containerUL.style.height = realHeight + 'px'; // 容器的实际高度

    // 首次渲染的数据
    var count = this.data.length < this.showItemCount ? this.data.length : this.showItemCount;
    for (var i = 0; i < count; i++) {
        var item = this.render({
            index: i
        });
        this.containerUL.appendChild(item.dom);
        // 将已被渲染的数据储存起来
        this.items.push(item);
    };
}
    `;
    scrollEventCode: string = `
/**
 * 监听滚动事件
 * @returns
 */
scrollEvent() {
    // 已经滚动的距离
    var containerScrollTop = this.container.scrollTop;
    // 没滚动也就不需要往下走了
    if (containerScrollTop <= 0) return;

    // 目前可见的第一个数据的下标
    var startIndexNew = Math.floor(containerScrollTop / this.itemHeight);

    // 已经滚动到底了,不需要往下走了
    if (startIndexNew === this.startIndex) return;

    var scrollOver = startIndexNew + this.showItemCount - 1 >= this.data.length;
    var renderOver = startIndexNew - this.startIndex === 1;

    // 如果到底没有渲染完就再渲染一次
    if (scrollOver && renderOver === false) {
        startIndexNew--;
    }
    this.diffRender(this.startIndex, startIndexNew);
    this.startIndex = startIndexNew;
}
    `;
    diffRenderCode: string = `
/**
 * 修改内容并渲染数据
 * @param item
 * @returns
 */
render(item) {
    var index = item.index;
    var itemDom = item.dom ? item.dom : document.createElement("LI"); // 获取到要被替换内容的 dom 节点
    var itemData = this.data[index];
    itemDom.innerHTML = "
    <div class = "item">
        ${'itemData'}
    </div>
    ";
    itemDom.style.position = "absolute";
    itemDom.style.top = (index * this.itemHeight) + "px"; // 计算得出这一行的具体位置
    itemDom.style.height = this.itemHeight + "px";
    itemDom.style.width = "100%";
    itemDom.style.overflow = "hidden";
    item.dom = itemDom; // 完成替换
    item.dom.setAttribute("index", index);
    item.top = index * this.itemHeight;
    return item;
}

/**
 * 比较新数据和旧数据
 * @param startIndex
 * @param startIndexNew
 */
diff(startIndex, startIndexNew) {
    var showItemCount = this.showItemCount;
    var items = this.items;
    var moveCount = Math.abs(startIndex - startIndexNew);
    if (moveCount >= showItemCount) {
        //全部渲染
        items.forEach((item, idx) => {
            item.index = startIndexNew + idx;
            this.render(item);
        })
    } else {
        //部分渲染
        // 这里的操作仅仅是修改数据的 index
        if (startIndex - startIndexNew > 0) {
            // 往上滑动
            for (var i = 1; i <= moveCount; i++) {
                var item = items[showItemCount - i];
                // 获取到要出现的那个数据的 index，用被隐藏的数据 index 减去 showItemCount
                // 要出现的是 上方的数据，被隐藏的是下方的数据，中间差了 showItemCount
                item.index = item.index - showItemCount;
                this.render(item);
            }
            this.items = items.splice(showItemCount - moveCount, moveCount).concat(items);
        } else {
            for (var i = 0; i < moveCount; i++) {
                var item = items[i];
                item.index = item.index + showItemCount;
                this.render(item);
            }
            this.items = items.concat(items.splice(0, moveCount));
        }
    }
}
    `;
    constructor() { }

    ngOnInit(): void {
        // 初始化一些模拟数据
        for (let i = 0; i < 10000; i++) {
            this.data.push(
                "在前端的业务开发过程中，难免会碰见需要渲染大量数据的场景，一次性渲染这么多数据肯定会耗费大量的时间甚至卡死，这个时候有个最常用的解决方案，那就是分页。如果不想分页，需求就是要一页显示完数据呢，那么就需要用到虚拟滚动技术了，虚拟滚动的核心思想也是前端渲染优化的主要手段，只渲染需要的数据，其他数据按需加载。在前端的业务开发过程中，难免会碰见需要渲染大量数据的场景，一次性渲染这么多数据肯定会耗费大量的时间甚至卡死，这个时候有个最常用的解决方案，那就是分页。如果不想分页，需求就是要一页显示完数据呢，那么就需要用到虚拟滚动技术了，虚拟滚动的核心思想也是前端渲染优化的主要手段，只渲染需要的数据，其他数据按需加载。"
            );
        };
    }

    /**
     * 初始化配置
     */
    initSetting() {
        setTimeout(() => {
            this.itemHeight = 220;//每一项的高度
            this.container = document.getElementById('list');//容器
            this.containerUL = this.container.getElementsByTagName('ul')[0];//容器内的ul
            this.maxHeight = 800;
            this.showItemCount = Math.ceil(this.maxHeight / this.itemHeight) + 1;//视图区域显示item的个数
            this.items = [];//可见列表项
            this.startIndex = 0;//第一个item索引
            //初始化数据
            this.initData();
            // 监听滚动事件
            fromEvent(this.container, 'scroll')
                .subscribe(() => {
                    this.scrollEvent()
                });
        }, 0);
    }

    /**
     * 处理初始渲染的数据
     * @param data 
     */
    initData() {
        var realHeight = this.data.length * this.itemHeight;

        if (realHeight > this.maxHeight) {
            this.container.style.height = this.maxHeight + 'px';
            this.showItemCount = Math.ceil(this.maxHeight / this.itemHeight) + 1; // 视图区域显示item的个数
        } else {
            this.container.style.height = realHeight + 'px';
            this.showItemCount = this.data.length + 1; // 视图区域显示item的个数
        };
        this.containerUL.style.height = realHeight + 'px'; // 容器的实际高度

        // 首次渲染的数据
        var count = this.data.length < this.showItemCount ? this.data.length : this.showItemCount;
        for (var i = 0; i < count; i++) {
            var item = this.render({
                index: i
            });
            this.containerUL.appendChild(item.dom);
            // 将已被渲染的数据储存起来
            this.items.push(item);
        };
    }

    /**
     * 修改内容并渲染数据
     * @param item 
     * @returns 
     */
    render(item) {
        var index = item.index;
        var itemDom = item.dom ? item.dom : document.createElement("LI"); // 获取到要被替换内容的 dom 节点
        var itemData = this.data[index];
        itemDom.innerHTML = `
            <div class="item">
                ${itemData}
            </div>
        `;
        itemDom.style.position = "absolute";
        itemDom.style.top = (index * this.itemHeight) + "px"; // 计算得出这一行的具体位置
        itemDom.style.height = this.itemHeight + "px";
        itemDom.style.width = "100%";
        itemDom.style.overflow = "hidden";
        item.dom = itemDom; // 完成替换
        item.dom.setAttribute("index", index);
        item.top = index * this.itemHeight;
        return item;
    }

    /**
     * 比较新数据和旧数据
     * @param startIndex 
     * @param startIndexNew 
     */
    diff(startIndex, startIndexNew) {
        var showItemCount = this.showItemCount;
        var items = this.items;
        var moveCount = Math.abs(startIndex - startIndexNew);
        if (moveCount >= showItemCount) {
            //全部渲染
            items.forEach((item, idx) => {
                item.index = startIndexNew + idx;
                this.render(item);
            })
        } else {
            //部分渲染
            // 这里的操作仅仅是修改数据的 index
            if (startIndex - startIndexNew > 0) {
                // 往上滑动
                for (var i = 1; i <= moveCount; i++) {
                    var item = items[showItemCount - i];
                    // 获取到要出现的那个数据的 index，用被隐藏的数据 index 减去 showItemCount
                    // 要出现的是 上方的数据，被隐藏的是下方的数据，中间差了 showItemCount
                    item.index = item.index - showItemCount;
                    this.render(item);
                }
                this.items = items.splice(showItemCount - moveCount, moveCount).concat(items);
            } else {
                for (var i = 0; i < moveCount; i++) {
                    var item = items[i];
                    item.index = item.index + showItemCount;
                    this.render(item);
                }
                this.items = items.concat(items.splice(0, moveCount));
            }
        }
    }

    /**
     * 监听滚动事件
     * @returns 
     */
    scrollEvent() {
        // 已经滚动的距离
        var containerScrollTop = this.container.scrollTop;
        // 没滚动也就不需要往下走了
        if (containerScrollTop <= 0) return;

        // 目前可见的第一个数据的下标
        var startIndexNew = Math.floor(containerScrollTop / this.itemHeight);

        // 已经滚动到底了,不需要往下走了
        if (startIndexNew === this.startIndex) return;

        var scrollOver = startIndexNew + this.showItemCount - 1 >= this.data.length;
        var renderOver = startIndexNew - this.startIndex === 1;

        // 如果到底没有渲染完就再渲染一次
        if (scrollOver && renderOver === false) {
            startIndexNew--;
        }
        this.diff(this.startIndex, startIndexNew);
        this.startIndex = startIndexNew;
    }
}
