import { Component, OnInit, ViewContainerRef, OnDestroy } from '@angular/core';
import {Router} from "@angular/router";
import {ToastsManager} from "ng2-toastr";
import {SocketClient} from "./services/socket.service";
import {Utils} from "./others/Utils";
@Component({
    selector: 'forget-pass',
    styleUrls: ['./waiting-screen.component.css'],
    templateUrl: './waiting-screen.component.html'
})
export class WaitingScreenComponent implements OnInit, OnDestroy{

    listUser: string[] = [];
    isHost: boolean = false;
    gamePIN: string;

    constructor(private router: Router) {}

    ngOnInit(): void {

        SocketClient.getInstance().removeAllListeners();

        this.isHost = (SocketClient.getData().isHost === true);

        this.gamePIN = SocketClient.getData().gamePIN;

        if (!SocketClient.getData().gamePIN) {
            this.showError('Please join room for playing!');
            setTimeout(() => {
                this.router.navigate(['home']);
            }, 1500);
            return;
        }

        SocketClient.getInstance().on('hostLeaveRoom', data => {
            this.showError(data.message);
            SocketClient.getInstance().removeAllListeners();
            setTimeout(() => {
                this.router.navigate(['home']);
            }, 1500);
            return;
        });

        SocketClient.getInstance().on('playerLeaveRoom', data => {
            this.listUser = data;
        });

        SocketClient.getInstance().on('newPlayerJoined', data => {
            this.listUser = data;
        });

        SocketClient.getInstance().on('gameStarted', data => {
            this.router.navigate(['play']);
            return;
        });

        setTimeout(() => SocketClient.getInstance().emit('playerJoinedRoom', {}), 10);
    }

    ngOnDestroy(): void {
    }

    startGame() {
        if (this.listUser.length <= 0) {
          this.showError("Waiting for players!");
            return;
        }
        setTimeout(() => SocketClient.getInstance().emit('startGame', {}), 10);
    }

    showError(error: string) {
        Utils.ShowError(error);
    }

    showSuccess(success: string){
        Utils.ShowSuccess(success);
    }
}
