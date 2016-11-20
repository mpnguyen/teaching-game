/**
 * Created by mp_ng on 11/20/2016.
 */
export class User {
    get password(): string {
        return this._password;
    }

    set password(value: string) {
        this._password = value;
    }
    get email(): string {
        return this._email;
    }

    set email(value: string) {
        this._email = value;
    }
    get username(): string {
        return this._username;
    }

    set username(value: string) {
        this._username = value;
    }

    private _username: string;
    private _email: string;
    private _password: string;

    constructor() {

    }
}