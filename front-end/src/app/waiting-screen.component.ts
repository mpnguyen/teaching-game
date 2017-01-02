import {Component, OnInit, ViewContainerRef} from '@angular/core';
import {Router} from "@angular/router";
import {ToastsManager} from "ng2-toastr";
import {SocketClient} from "./services/socket.service";
@Component({
    selector: 'forget-pass',
    styleUrls: ['./waiting-screen.component.css'],
    templateUrl: './waiting-screen.component.html'
})
export class WaitingScreenComponent implements OnInit{


    listUser: string[] = [];
    isHost: boolean = false;

    constructor(private router: Router, public toastr: ToastsManager, vRef: ViewContainerRef) {
        this.toastr.setRootViewContainerRef(vRef);
    }

    ngOnInit(): void {
        this.isHost = (SocketClient.getData().isHost === true);

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
            console.log(data.message);
            setTimeout(() => {
                this.router.navigate(['play']);
            }, 1500);
            return;
        });

        SocketClient.getInstance().emit('playerJoinedRoom', {});
    }

    startGame() {
        SocketClient.getInstance().emit('startGame');
    }

    showError(error: string) {
        this.toastr.error(error, 'Error!');
    }

    showSuccess(success: string){
        this.toastr.success(success,'Success!');
    }
}
