/**
 * Created by mp_ng on 11/20/2016.
 */
import {Component, OnDestroy, OnInit, ViewContainerRef} from '@angular/core';
import {Router} from "@angular/router";
import {Utils} from "./others/Utils";
import {SocketClient} from "./services/socket.service";

declare let FB: any;

@Component({
    selector: 'user-login',
    styleUrls: ['./create-game.component.css'],
    templateUrl: './create-game.component.html'
})
export class CreateGameComponent implements OnInit{

    constructor(private router: Router) {}

    ngOnInit(): void {
        SocketClient.getInstance().on("newGameCreated", data => {
            SocketClient.getData().gamePIN = data.gamePIN;
            SocketClient.getData().isHost = true;
            this.router.navigate(['waiting']);
        });
    }

    idPackage: string;

    showSuccess(msg) {
        Utils.ShowSuccess(msg);
    }

    showError(error: string) {
        Utils.ShowError(error);
    }

    createGame(): void {
        if (!this.idPackage || this.idPackage === '') {
            this.showError('Enter package ID');
            return;
        }

        SocketClient.getInstance().emit("createNewGame", this.idPackage);
    }

    navigateToHome() {
        this.router.navigate(['home']);
    }
}
