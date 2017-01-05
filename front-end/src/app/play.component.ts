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
import 'chart.js/src/chart.js'
import {Utils} from "./others/Utils";
declare let Chart;

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
    userCount: number = 0;

    constructor(private router: Router) {}

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
                $('#answer' + i).removeClass('chooseAnswer');
            }
            this.userCount = 0;
            this.showInfo('New question!');
            $('#clock').countdown((new Date(data.deadline)).toLocaleString())
              .on('update.countdown', function(event:any) {
                let format = '%S';
                $(this).html(event.strftime(format));
              })
              .on('finish.countdown', function(event: any) {
                $(this).html('00').parent().addClass('disabled');
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

            var players = [];
            var scores = [];


            for (var i = 0; i < data.score.length; i++) {
                players.push(data.score[i].username);
                scores.push(data.score[i].score);
            }

            var ctx = $("#myChart");
            var myChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: players,
                    datasets: [{
                        label: '# of Players',
                        data: scores,
                        backgroundColor: [
                          'rgba(255, 99, 132, 0.2)',
                          'rgba(54, 162, 235, 0.2)',
                          'rgba(255, 206, 86, 0.2)',
                          'rgba(75, 192, 192, 0.2)',
                          'rgba(153, 102, 255, 0.2)',
                        ],
                        borderColor: [
                          'rgba(255,99,132,1)',
                          'rgba(54, 162, 235, 1)',
                          'rgba(255, 206, 86, 1)',
                          'rgba(75, 192, 192, 1)',
                          'rgba(153, 102, 255, 1)',
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero:true
                            }
                        }]
                    },
                    responsive: true
                }
            });
        });

        SocketClient.getInstance().on('playerAnswered', data => {
            this.userCount = data;
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

    chooseAnswer(answer: number): void {
        if (this.isHost) {
            return;
        }

        for (let i = 0; i < 4; i++) {
            if (i === answer) {
                $('#answer' + i).addClass('chooseAnswer');
            } else {
                $('#answer' + i).prop("disabled", true);
            }
        }

        SocketClient.getInstance().emit('answerQuestion', answer);
    }

    showSuccess(msg: string) {
        Utils.ShowSuccess(msg);
    }

    showInfo(msg: string) {
        Utils.ShowInfo(msg);
    }

    showError(msg: string) {
        Utils.ShowError(msg);
    }

    ngAfterViewInit() {

    }
}
