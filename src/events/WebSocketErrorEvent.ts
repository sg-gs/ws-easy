import WebSocketEvent from "./WebSocketEvent";
import StandardEvents from "./StandardEvents";

export default class WebSocketErrorEvent implements WebSocketEvent {

    callback: Function;
    name = StandardEvents.error;
    ws!: WebSocket;

    constructor () {
        this.callback = () => {};
    }

    getCallback(): Function {
        return this.callback;
    }

    setCallback(cb: Function): void {
        this.ws.onerror = function (this: WebSocket, ev: Event) {
            cb(this, ev);
        };
        this.callback = cb;
    }

    using (ws: WebSocket): WebSocketEvent {
        this.ws = ws;
        return this;
    }

}