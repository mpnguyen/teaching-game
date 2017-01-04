import { Component, OnInit, ViewContainerRef, OnDestroy } from '@angular/core';
import {Router} from "@angular/router";
import {ToastsManager} from "ng2-toastr";
import {SocketClient} from "./services/socket.service";
@Component({
    selector: 'forget-pass',
    styleUrls: ['./waiting-screen.component.css'],
    templateUrl: './waiting-screen.component.html'
})
export class WaitingScreenComponent implements OnInit, OnDestroy{

    listUser: string[] = [];
    isHost: boolean = false;
    gamePIN: string;

    constructor(private router: Router, public toastr: ToastsManager, vRef: ViewContainerRef) {
        this.toastr.setRootViewContainerRef(vRef);
    }

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
            setTimeout(() => {
                this.router.navigate(['home']);
            }, 1500);
            return;
        });

        SocketClient.getInstance().on('newPlayerJoined', data => {
            this.listUser = data;
        });

        SocketClient.getInstance().on('gameStarted', data => {
            this.showSuccess(data.message);
            setTimeout(() => {
                this.router.navigate(['play']);
            }, 1500);
            return;
        });

        setTimeout(() => SocketClient.getInstance().emit('playerJoinedRoom', {}), 10);
    }

    ngOnDestroy(): void {
        SocketClient.getInstance().removeAllListeners();
    }

    startGame() {
        setTimeout(() => SocketClient.getInstance().emit('startGame', {}), 10);
    }

    showError(error: string) {
        this.toastr.error(error, 'Error!');
    }

    showSuccess(success: string){
        this.toastr.success(success,'Success!');
    }
}
