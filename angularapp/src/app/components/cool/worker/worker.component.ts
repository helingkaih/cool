import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-worker',
    templateUrl: './worker.component.html',
    styleUrls: ['./worker.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkerComponent implements OnInit {
    constructor() { }

    ngOnInit(): void {
    }

    /**
     * 用主线程跑大量计算
     */
    runCompute() {
        let count = 0;
        console.log('主线程开始计算')
        for (let i = 0; i <= 1000000000; i++) {
            count++;
            count++;
            count++;
            count++;
            count++;
            count++;
        }
        console.log(count)
    }

    /**
     * 用 web worker 开启分线程跑大量计算
     */
    runWorker() {
        if (typeof Worker !== 'undefined') {
            const worker = new Worker('./worker.worker', { type: 'module' });
            worker.onmessage = ({ data }) => {
            };
            worker.postMessage('hello');
        };
    }

}
