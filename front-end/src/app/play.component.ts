/**
 * Created by mp_ng on 12/3/2016.
 */
import {Component, OnInit, OnDestroy, ViewContainerRef} from '@angular/core';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import * as io from 'socket.io-client';
import {SocketClient} from "./services/socket.service";
import {Router} from "@angular/router";
import {Question} from "./models/question.model";
import {Constants} from "./others/Config";

declare let $: any;

@Component({
    selector: 'play',
    styleUrls: ['./play.component.css'],
    templateUrl: './play.component.html'
})
export class PlayComponent implements OnInit, OnDestroy{

    question: Question = new Question();
    isHost = false;
    isAllowNextQuestion = false;
    baseUrl: string;

    constructor(private router: Router, private toastr: ToastsManager, vRef: ViewContainerRef) {
        this.toastr.setRootViewContainerRef(vRef);
    }

    ngOnInit(): void {
        this.baseUrl = Constants.BASE_URL;

        this.isHost = SocketClient.getData().isHost;

        if (!SocketClient.getData().gamePIN) {
            this.showError('Please join room for playing!');
            setTimeout(() => {
                this.router.navigate(['home']);
            }, 1500);
            return;
        }

        SocketClient.getInstance().on('receiveQuestion', data => {
            this.question = data;
            for (let i = 0; i < 4; i++) {
                $('#answer' + i).prop("disabled", false);
                $('#answer' + i).removeClass('correct');
            }
            console.log(data);
            $('#clock').countdown((new Date(data.deadline)).toLocaleString())
              .on('update.countdown', function(event:any) {
                let format = '%S';
                $(this).html(event.strftime(format));
              })
              .on('finish.countdown', function(event: any) {
                $(this).html('Time up').parent().addClass('disabled');
              });
        });

        SocketClient.getInstance().on('endQuestion', data => {
            this.isAllowNextQuestion = true && this.isHost;
            for (let i = 0; i < 4; i++) {
                $('#answer' + i).prop("disabled", true);
                if (i === data.correct) {
                    $('#answer' + i).addClass('correct');
                }
            }
        });

        SocketClient.getInstance().on('questionChanged', data => {
            this.isAllowNextQuestion = false && this.isHost;
            SocketClient.getInstance().emit('currentQuestion');
        });

        setTimeout(() => SocketClient.getInstance().emit('currentQuestion', {}), 10);
    }

    ngOnDestroy(): void {
        SocketClient.getInstance().removeAllListeners();
    }

    nextQuestion(): void {
        setTimeout(() => SocketClient.getInstance().emit('nextQuestion', {}), 10);
    }

    showSuccess(msg: string) {
        this.toastr.success(msg, 'Success!');
    }

    showError(msg: string) {
        this.toastr.error(msg, 'Error!');
    }

    ngAfterViewInit() {
        //this.showSuccess();
    }
}
