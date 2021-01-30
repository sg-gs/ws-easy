export class WebSocketError extends Error {
    name = 'WebSocketError';
    message = 'WebSocket error';
}

export class WebSocketNotExistsError extends WebSocketError {
    message: string = `${this.message}: wss is null or undefined`;
}

export class WebSocketNotFoundError extends WebSocketError {
    message: string = `${this.message}: wss is not an instance of WebSocketServer`;
}