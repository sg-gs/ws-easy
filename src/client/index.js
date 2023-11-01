let ws;

class WS {

    constructor ({ url, port }) {
        
        this._ws = new WebSocket(`ws://${url}:${port}`);

        this._events = {
            close: 'onclose',
            connection: 'onopen',
            error: 'onerror'
        };

        this._customEvents = {};
        this._ws.onmessage = (event) => this._onMessageHandler(event);
    }

    emit (event, data) {
        this._ws.send(JSON.stringify({ name: event, data }));
    }

    on (event, cb) {
        this._typeGuard(event, 'string', 'Event should be a string');
        this._typeGuard(cb, 'function', 'Callback should be a function');

        if(event in this._events) {
            this._ws[this._events[event]] = cb;
            return;
        } 

        if (!(event in this._customEvents)) {
            this._customEvents = { ...this._customEvents, [event]: cb };
        }
    }

    _onMessageHandler (event = new MessageEvent()) {
        const message = JSON.parse(event.data);
        if(message && message.type) {
            if(message.type in this._customEvents) {
                const customCallback = this._customEvents[message.type];
                customCallback(event);
            } else {
                console.warn(`Event '${message.type}' emitted by server is not being listened using .on() method`);
                this._listCustomEvents();
            }
        }
    }

    _listCustomEvents () {
        for (let customEvent in this._customEvents) {
            console.warn(`Event ${customEvent} with callback:`);
            console.warn(this._customEvents[customEvent]);
        }
    }

    stream (arrBuf = new ArrayBuffer()) {

        this._instanceGuard(arrBuf, ArrayBuffer, 'Websocket only streams ArrayBuffers right now');

        const size = arrBuf.byteLength;
        let offset = 0;
        let nChunks, progress, chunk;

        return ({
            usingChunksOf: (nBytes) => ({
                start: (progressCb) => {
                    return new Promise((resolve, reject) => {
                        let chunkLength = nBytes;

                        nChunks = Math.ceil(size / chunkLength);

                        for(let i = 0; i < nChunks; i++) {
                            if(chunkLength + offset > size) {
                                chunkLength = size - offset;
                            }
                            chunk = new Uint8Array(arrBuf, offset, chunkLength);

                            if(offset < size) {
                                offset += chunkLength;
                                this._ws.send(chunk);
                                progress = Math.round((offset / size) * 100);
                            }
                            progressCb(progress);
                        }

                        resolve('stream finished');
                    })
                }
            }),
        });
    }

    /**
     * 
     * @param {any} content Content to broadcast
     */
    broadcast (content) {
        const broadcastProtocol = { type: 'broadcast', content };
        this._ws.send(JSON.stringify(broadcastProtocol));
    }

    _instanceGuard (content, type, errmsg) {
        if(!(content instanceof type)) {
            throw new Error(errmsg);
        }
    }
    _typeGuard (content, type, errmsg) {
        if(typeof content != type) {
            throw new Error(errmsg);
        }
    }

}