/**
 * Created by mp_ng on 11/20/2016.
 */
import {Component, OnInit, ViewContainerRef, OnDestroy} from '@angular/core';
import {SocketClient} from "./services/socket.service";
import {Router} from "@angular/router";
import {ToastsManager} from "ng2-toastr";
import {Utils} from "./others/Utils";

@Component({
    selector: 'my-home',
    styleUrls: ['./home.component.css'],
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy{

    gamePIN: string;
    username: string;

    constructor(private router: Router) {}

    ngOnInit(): void {
        SocketClient.getInstance().on('joinRoomSuccess', data => {
            SocketClient.getData().gamePIN = data.gamePIN;
            this.router.navigate(['waiting']);
        });

        SocketClient.getInstance().on('joinRoomFail', data => {
            this.showError(data.message);
        });
    }

    ngOnDestroy(): void {
        SocketClient.getInstance().removeAllListeners();
    }

    joinGame() {
        let data = {
            username: this.username,
            gamePIN: this.gamePIN
        };

        SocketClient.getInstance().emit('joinGame', data);
    }

    showSuccess(msg: string) {
        Utils.ShowSuccess(msg);
    }

    showError(error: string) {
        Utils.ShowError(error);
    }
}
