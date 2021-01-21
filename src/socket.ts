import { Server } from 'http';
import { Server as WebSocketServer } from 'ws';

import { WebSocketEvent, WebSocketCloseEvent } from "./events";

export default class WsEasy {

    private wsServer: WebSocketServer; 
    private ws!: WebSocket;
    private events: Map<String, WebSocketEvent>;

    constructor(server: Server) {
        this.wsServer = new WebSocketServer({ server });

        this.events = new Map<String, WebSocketEvent>();
        this.events.set('close', new WebSocketCloseEvent());
        // TODO: On connection, on message, on error ...

        this.wsServer.on('connection', (socket: WebSocket) => {
            this.ws = socket;
        });
    }

    public on (event:string) : void {
       if(this.ws) {
        // TODO: Use events map
       } 
    }
}