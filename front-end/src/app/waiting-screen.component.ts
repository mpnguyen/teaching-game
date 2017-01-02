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

        SocketClient.getInstance().on('hostLeaveRoom', data => {
            this.showError(data.message);
            setTimeout(() => {
                this.router.navigate(['home']);
            }, 1500);
        });

        SocketClient.getInstance().on('newPlayerJoined', data => {
            this.listUser = data;
        });

        SocketClient.getInstance().emit('playerJoinedRoom', {});
    }


    showError(error: string) {
        this.toastr.error(error, 'Error!');
    }
}
