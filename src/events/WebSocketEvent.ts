import { Server as WebSocketServer } from 'ws';

export default interface WebSocketEvent {
    callback: (wss: WebSocketServer) => void;
    name: string;
    wss: WebSocketServer;
    getCallback(): (wss: WebSocketServer, ...args: any[]) => void;
    setCallback(cb: (wss: WebSocketServer, ...args: any[]) => void): void;
    using(wss: WebSocketServer): WebSocketEvent;
}