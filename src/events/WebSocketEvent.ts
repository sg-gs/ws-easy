export default interface WebSocketEvent {
    callback: Function;
    name: string;
    ws: WebSocket;
    getCallback(): Function;
    setCallback(cb: Function): void;
    using (ws: WebSocket): WebSocketEvent;
}