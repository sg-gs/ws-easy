import { Server as WebSocketServer } from 'ws';

export default interface WebSocketEvent {
    callback: (wss: WebSocketServer) => void;
    name: string;
    wss: WebSocketServer;
    getCallback(): (wss: WebSocketServer) => void;
    setCallback(cb: (wss: WebSocketServer) => void): void;
    using(wss: WebSocketServer): WebSocketEvent;
}