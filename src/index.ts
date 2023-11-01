import { StandardEvents } from './events';
import { init } from './socket';
import { Server as WebSocketServer } from 'ws';
import { IncomingMessage } from 'http';

const ss = new WebSocketServer({ host: 'localhost', port: 3000 });
ss.on('connection', (socket: WebSocket, msg: IncomingMessage) => {
    socket.onmessage = () => {
        console.log('eee')
    }
})

// const ws = init('localhost', 3000);

// ws.on(StandardEvents.connection, (wss) => {
//     console.log('connection established');
// });

// ws.on('exampleevent', (wss, data) => {
//     console.log(data)
// });