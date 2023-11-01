import { WebSocketCustomEvent } from ".";

export default class WebSocketCustomEvents {
    customEventsMap: Map<string, WebSocketCustomEvent>;

    constructor () {
        this.customEventsMap = new Map<string, WebSocketCustomEvent>();
    }

    add (customEvent: WebSocketCustomEvent) : void {
        this.customEventsMap.set(customEvent.name, customEvent);
    }
}