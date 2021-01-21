export interface WebSocketEvent {
    callback: Function;
    getCallback(): Function;
    setCallback(cb: Function): void;
}

export class WebSocketCloseEvent implements WebSocketEvent {

    callback: Function;

    constructor () {
        this.callback = () => {};
    }

    getCallback(): Function {
        return this.callback;
    }   

    setCallback(cb: Function): void {
        this.callback = cb;
    }

}