import { Server as WebSocketServer } from 'ws';

import { WebSocketNotExistsError, WebSocketNotFoundError } from './errors';
import { WebSocketEvent, WebSocketCloseEvent, StandardEvents, WebSocketErrorEvent, WebSocketCustomEvent } from "./events";

export default class WsEasyInitializer {
    constructor (host: string, port: number) {
        const server = new WebSocketServer({ host, port });
        new WsEasy(server);
    }
}
class WsEasy {
    private wsServer: WebSocketServer;
    private ws!: WebSocket;
    private events: Map<String, WebSocketEvent>;

    constructor(server: WebSocketServer) {
        this.wsServer = server;

        this.events = new Map<StandardEvents | string, WebSocketEvent>();
        this.events.set(StandardEvents.close, new WebSocketCloseEvent());
        this.events.set(StandardEvents.error, new WebSocketErrorEvent());

        this.wsServer.on('connection', (socket: WebSocket) => {
            this.ws = socket;
        });
    }

    public on(event: StandardEvents | string, cb: Function): void {

        if (!(this.ws instanceof WebSocket)) throw new WebSocketNotFoundError();

        if (!this.ws) throw new WebSocketNotExistsError();

        const exists = this.events.has(event);
        const notNull = this.events.get(event);

        if(exists && notNull) {
            this.events.get(event)?.using(this.ws).setCallback(cb); 
        } else {
            const add = this._add;
            const customEvent = new WebSocketCustomEvent(event);
            customEvent.using(this.ws).setCallback(cb);
            add(customEvent);
        }         
    }

    private _add (wsEvent: WebSocketEvent | WebSocketCustomEvent): void {
        this.events.set(wsEvent.name, wsEvent);
    }
}