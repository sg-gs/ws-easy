import { Server as WebSocketServer } from 'ws';

import WebSocketEvent from "./WebSocketEvent";

export default class WebSocketErrorEvent implements WebSocketEvent {

    callback: (wss: WebSocketServer) => void;
    name: string;
    wss!: WebSocketServer;

    constructor(name: string) {
        this.callback = () => { };
        this.name = name;
    }

    getCallback(): (wss: WebSocketServer) => void {
        return this.callback;
    }

    setCallback(cb: (wss: WebSocketServer) => void): void {
        this.wss.on('message', cb);
        this.callback = cb;
    }

    using(wss: WebSocketServer): WebSocketEvent {
        this.wss = wss;
        return this;
    }

}