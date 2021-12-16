import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { interval, Subscription, timer, } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-rxjs-unsubscribe',
    templateUrl: './rxjs-unsubscribe.component.html',
    styleUrls: ['./rxjs-unsubscribe.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RxjsUnsubscribeComponent implements OnInit {
    subs: Subscription = new Subscription();
    clear: boolean = false; // 是否清除订阅
    intervalCase: string = `
import { interval } from 'rxjs';
......
const inter = interval(1000);
const a = inter.subscribe(() => { console.log('interval') })
`;
    takeUntilCase: string = `
import { interval, Subscription, timer, } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
......
// 每1秒发出值
const source = interval(1000);
// 5秒后发出值
const timer$ = timer(5000);
// 当5秒后 timer 发出值时， source 则完成
source.pipe(takeUntil(timer$)).subscribe(val => console.log(val))
    `;
    takeCase: string = `
import { interval, Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
......
// 每1秒发出值
const source = interval(1000);
this.subs.add(source.pipe(take(1)).subscribe(val => console.log(val)));
    `;

    linkList: Array<{ title: string, href: string }> = [
        { title: 'Rxjs Observables的简介', href: 'Rxjs-Observable-what' },
        { title: '异步编程思想的发展史', href: 'Rxjs-Observable-why' },
        { title: '.subscribe()方法，致命的内存泄漏', href: 'Rxjs-Observable-subscribe' },
        { title: 'RxJS 操作符—— takeUnti', href: 'Rxjs-Observable-takeUnti' },
        { title: 'RxJS 操作符—— take', href: 'Rxjs-Observable-take' }
    ];

    constructor(
    ) { }

    ngOnInit(): void {
    }

    /**
     * 创建一个 interval 例子
     */
    createIntervalCase(): void {
        const inter = interval(1000);
        this.subs.add(inter.subscribe(() => { console.log('create interval') }));
    }

    /** 
     * 创建一个 TakeUntil 例子
     */
    createTakeUntilCase() {
        // 每1秒发出值
        const source = interval(1000);
        // 5秒后发出值
        const timer$ = timer(5000);
        // 当5秒后 timer 发出值时， source 则完成
        this.subs.add(source.pipe(takeUntil(timer$)).subscribe(val => console.log(val)));
    }

    /**
     * 创建一个 take 例子
     */
    createTakeCase() {
        // 每1秒发出值
        const source = interval(1000);
        this.subs.add(source.pipe(take(1)).subscribe(val => console.log(val)));
    }

    ngOnDestroy(): void {
        if (this.clear) {
            this.subs.unsubscribe();
        };
    }
}
