/**
 * Created by mp_ng on 12/3/2016.
 */
import {Component, OnInit, OnDestroy, ViewContainerRef} from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import * as io from 'socket.io-client'

declare let $: any;

@Component({
    moduleId: module.id,
    selector: 'play',
    styleUrls: ['./play.component.css'],
    templateUrl: './play.component.html'
})
export class PlayComponent implements OnInit, OnDestroy{

    constructor(private toastr: ToastsManager, private containerRef: ViewContainerRef) {};

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
    }

    showSuccess() {
        this.toastr.success('You are awesome!', 'Success!');
    }

    showError() {
        this.toastr.error('You are awesome!', 'Error!');
    }

    ngAfterViewInit() {
        this.showSuccess()
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