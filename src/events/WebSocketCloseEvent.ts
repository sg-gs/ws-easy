import WebSocketEvent from "./WebSocketEvent";
import StandardEvents from "./StandardEvents";

export default class WebSocketCloseEvent implements WebSocketEvent {

    callback: Function;
    name = StandardEvents.close;
    ws!: WebSocket;

    constructor () {
        this.callback = () => {};
    }

    getCallback(): Function {
        return this.callback;
    }   

    setCallback(cb: Function): void {
        this.ws.onclose = function (this: WebSocket, ev: Event) {
            cb(this, ev);
        };
        this.callback = cb;
    }

    using (ws: WebSocket): WebSocketEvent {
        this.ws = ws;
        return this;
    }

}