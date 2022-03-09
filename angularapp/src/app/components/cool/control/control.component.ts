import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
    selector: 'app-control',
    templateUrl: './control.component.html',
    styleUrls: ['./control.component.scss']
})
export class ControlComponent implements OnInit {
    videoSrc
    constructor() { }

    ngOnInit(): void {
        // 要用localhost
        // 视频流
        navigator.mediaDevices.getUserMedia(
            {
                audio: false,
                video: {
                    width: 1280, height: 720
                }
            }).then(function (stream) {
                console.log('stream', stream)
                let target = document.getElementById('video') as HTMLVideoElement;
                target.srcObject = stream;
                target?.play();
            }
            ).catch(function (err) {

            }
            );
        // 桌面流
        // @ts-ignore
        // navigator.mediaDevices.getDisplayMedia({
        //     audio: false,
        //     video: {
        //         width: 1280, height: 720
        //     }
        // }).then(function (stream) {
        //     console.log(stream)
        //     let target = document.getElementById('video') as HTMLVideoElement;
        //     target.srcObject = stream;
        //     target?.play();
        // }
        // ).catch(function (err) {

        // })
    }

}
