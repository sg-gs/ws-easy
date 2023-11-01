import { IncomingMessage } from 'http';
import { Server as WebSocketServer } from 'ws';

import { WebSocketCloseError, WebSocketNotExistsError, WebSocketNotFoundError } from './errors';
import { WebSocketEvent, WebSocketCloseEvent, WebSocketConnectionEvent, StandardEvents, WebSocketErrorEvent, WebSocketCustomEvent, WebSocketCustomEvents, CustomEvents } from "./events";
import WsEasyEvent from './events/WsEasyEvent';

export function init (host: string, port: number) {
    const s = new WebSocketServer({ host, port });
    s.on('connection', (wss: WebSocketServer, socket: WebSocket, request: IncomingMessage) => {
        socket.onmessage = console.log
    })
    return new WsEasy(s);
}

export class WsEasy {
    public wss!: WebSocketServer;
    private _ws: WebSocket;
    public stdEvents: Map<StandardEvents, WebSocketEvent>;
    public cstEvents: WebSocketCustomEvents;
    private closed: boolean

    constructor(wss: WebSocketServer) {
        this.wss = wss;
        this.closed = false;

        this.stdEvents = new Map<StandardEvents, WebSocketEvent>();
        this.stdEvents.set(StandardEvents.close, new WebSocketCloseEvent());
        this.stdEvents.set(StandardEvents.error, new WebSocketErrorEvent());
        this.stdEvents.set(StandardEvents.connection, new WebSocketConnectionEvent());   

        this.cstEvents = new WebSocketCustomEvents();

        this.wss.on('message', (msg: string) => {
            console.log('eeoeoeo', msg)
            const { name, data } : WsEasyEvent = JSON.parse(msg);
            // TODO: infer data type and add parser to it
            for (const cstEventName in this.cstEvents.customEventsMap.keys()) {
                if (name === cstEventName) {
                    const cb = this.cstEvents.customEventsMap.get(name)!.getCallback();
                    cb(wss, data);
                }
            }
        });
    }

    public on(event: StandardEvents | string, cb: (wss: WebSocketServer, ...args: any[]) => void): void {

        const notExists = !(this.wss);
        const notFound  = !(this.wss instanceof WebSocketServer);

        if (notExists) throw new WebSocketNotExistsError();
        if (notFound)  throw new WebSocketNotFoundError();    

        console.log(`${event}`)
        
        if(event in StandardEvents) {
            const wsEvent = (<any>StandardEvents)[event];
            this._handleStandardEvent(wsEvent!, cb);
        } else {
            this.cstEvents.add(new WebSocketCustomEvent(event, cb));
        }
    }

    private _handleStandardEvent (name: StandardEvents, cb: (wss: WebSocketServer, ...args: any[]) => void) : void {
        if(name === StandardEvents.close) {
            const closeCb = (wss: WebSocketServer, ...args: any[]) => {
                cb(wss, ...args);
                this.closed = true;
            } 
            cb = closeCb;
        }
        this.wss.on(name, cb);
    }

    public destroy () : Promise<WebSocketCloseError | void> {
        return new Promise((resolve: () => void, reject: (reason: WebSocketCloseError) => void) => {
            this.wss.close((err: Error | undefined) => {
                if(err) {
                    reject(new WebSocketCloseError(err.message));
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