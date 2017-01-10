/**
 * Created by mpnguyen on 01/01/2017.
 */
import * as io from 'socket.io-client';
import {Constants} from "../others/Config";

export class SocketClient {

  private static _instance;
  private static _data;

  constructor() {
  }

  public static getInstance(): SocketIOClient.Socket
  {
      if(!SocketClient._instance){
          SocketClient._instance = io.connect(Constants.BASE_URL);
      }

      return this._instance;
  }

  public static getData(): any
  {
    if(!SocketClient._data){
        SocketClient._data = {};
    }

    return this._data;
  }

}
