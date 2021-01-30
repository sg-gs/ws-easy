export class WebSocketError extends Error {
    name = 'WebSocketError';
    message = 'WebSocket error';
}

export class WebSocketNotExistsError extends WebSocketError {
    message: string = `${this.message}: ws is null or undefined`;
}

export class WebSocketNotFoundError extends WebSocketError {
    message: string = `${this.message}: ws is not an instance of WebSocket`;
}