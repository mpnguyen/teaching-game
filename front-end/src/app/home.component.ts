/**
 * Created by mp_ng on 11/20/2016.
 */
import {Component, OnInit, ViewContainerRef, OnDestroy} from '@angular/core';
import {SocketClient} from "./services/socket.service";
import {Router} from "@angular/router";
import {ToastsManager} from "ng2-toastr";

@Component({
    selector: 'my-home',
    styleUrls: ['./home.component.css'],
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit, OnDestroy{

    gamePIN: string;
    username: string;

    constructor(private router: Router, private toastr: ToastsManager, vRef: ViewContainerRef) {
        this.toastr.setRootViewContainerRef(vRef);
    }

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
        this.toastr.success(msg, 'Success!');
    }

    showError(error: string) {
        this.toastr.error(error, 'Error!');
    }
}
