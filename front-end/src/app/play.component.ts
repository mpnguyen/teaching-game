/**
 * Created by mp_ng on 12/3/2016.
 */
import {Component, OnInit, OnDestroy, ViewContainerRef} from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import * as io from 'socket.io-client';
import {SocketClient} from "./services/socket.service";
import {Router} from "@angular/router";

declare let $: any;

@Component({
    selector: 'play',
    styleUrls: ['./play.component.css'],
    templateUrl: './play.component.html'
})
export class PlayComponent implements OnInit, OnDestroy{

    constructor(private router: Router, private toastr: ToastsManager, vRef: ViewContainerRef) {
        this.toastr.setRootViewContainerRef(vRef);
    }

    ngOnInit(): void {
        if (!SocketClient.getData().gamePIN) {
            this.showError('Please join room for playing!');
            setTimeout(() => {
                this.router.navigate(['home']);
            }, 1500);
        }
    }

    ngOnDestroy(): void {
    }

    showSuccess() {
        this.toastr.success('You are awesome!', 'Success!');
    }

    showError(msg) {
        this.toastr.error(msg, 'Error!');
    }

    ngAfterViewInit() {
        this.showSuccess();
        let deadline = new Date(Date.now());
        deadline.setSeconds(deadline.getSeconds() + 10);

        $('#clock').countdown(deadline.toLocaleString())
            .on('update.countdown', function(event:any) {
                let format = '%S';

                $(this).html(event.strftime(format));
            })
            .on('finish.countdown', function(event: any) {
                $(this).html('Time up')
                    .parent().addClass('disabled');

            });
    }
}
