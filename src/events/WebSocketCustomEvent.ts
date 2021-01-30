import WebSocketEvent from "./WebSocketEvent";

export default class WebSocketErrorEvent implements WebSocketEvent {

    callback: Function;
    name: string;
    ws!: WebSocket;

    constructor (name: string) {
        this.callback = () => {};
        this.name = name;
    }

    getCallback (): Function {
        return this.callback;
    }

    setCallback (cb: Function): void {
        this.ws.onmessage = function (this: WebSocket, ev: Event) {
            cb(this, ev);
        };
        this.callback = cb;
    }

    using (ws: WebSocket): WebSocketEvent {
        this.ws = ws;
        return this;
    }

}