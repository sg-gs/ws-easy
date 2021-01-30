import { Server as WebSocketServer } from 'ws';

import { WebSocketNotExistsError, WebSocketNotFoundError } from './errors';
import { WebSocketEvent, WebSocketCloseEvent, WebSocketConnectionEvent, StandardEvents, WebSocketErrorEvent, WebSocketCustomEvent } from "./events";

export class WsEasyInitializer {
    constructor(host: string, port: number) {
        const server = new WebSocketServer({ host, port });
        new WsEasy(server);
    }
}
export class WsEasy {
    private wss!: WebSocketServer;
    public events: Map<String, WebSocketEvent>;
    private closed: boolean

    constructor(wss: WebSocketServer) {
        this.wss = wss;
        this.closed = false;

        this.events = new Map<StandardEvents | string, WebSocketEvent>();
        this.events.set(StandardEvents.close, new WebSocketCloseEvent());
        this.events.set(StandardEvents.error, new WebSocketErrorEvent());
        this.events.set(StandardEvents.connection, new WebSocketConnectionEvent());
    }

    public on(event: StandardEvents | string, cb: (wss: WebSocketServer) => void): void {
        if (!this.wss) throw new WebSocketNotExistsError();

        if (!(this.wss instanceof WebSocketServer)) throw new WebSocketNotFoundError();        

        const exists = this.events.has(event);
        const notNull = this.events.get(event);

        if (exists && notNull) {

            if(notNull instanceof WebSocketCloseEvent) {
                const closeWrapper = (wss: WebSocketServer) => {
                    cb(wss);
                    this.closed = true;
                }
                this.events.get(StandardEvents.close)?.using(this.wss).setCallback(closeWrapper);
            } else {
                this.events.get(event)?.using(this.wss).setCallback(cb);
            }
            
        } else {
            const customEvent = new WebSocketCustomEvent(event);
            customEvent.using(this.wss).setCallback(cb);
            this._add(customEvent);
        }
    }

    private _add(wsEvent: WebSocketEvent | WebSocketCustomEvent): void {
        this.events.set(wsEvent.name, wsEvent);
    }

    public destroy () : Promise<Error | void> {
        return new Promise((resolve, reject) => {
            this.wss.close((err: Error | undefined) => {
                if (err && err instanceof Error) {
                    reject(err); 
                } else {
                    this.closed = true;
                    resolve();
                }
            });
        }) 
    }

    public isClosed () : boolean {
        return this.closed;
    }
}