import { expect } from 'chai';

import { Server as WebSocketServer } from 'ws';

import { WebSocketNotExistsError, WebSocketNotFoundError } from '../errors';
import { StandardEvents, WebSocketCloseEvent, WebSocketConnectionEvent, WebSocketCustomEvent, WebSocketErrorEvent } from '../events';
import { WsEasy } from '../socket';

const wss = new WsEasy(new WebSocketServer({ port: 3000 }));
const wsNotExistsErr = new WebSocketNotExistsError();
const wsNotFoundErr = new WebSocketNotFoundError();
const customEvtName = 'my-custom-event';

describe('WsEasy', () => {
    describe('#constructor()', () => {
        it('should have standard events in events Map', () => {
            expect(wss.events.get(StandardEvents.close)).to.be.instanceOf(WebSocketCloseEvent);
            expect(wss.events.get(StandardEvents.error)).to.be.instanceOf(WebSocketErrorEvent);
            expect(wss.events.get(StandardEvents.connection)).to.be.instanceOf(WebSocketConnectionEvent);
        });

        it('should mark closed flag as false', () => {
            expect(wss.isClosed()).to.be.false;
        });
    });

    describe('#on()', () => {
        it('should throw WebSocketNotFoundError', () => {
            const wsBroken = new WsEasy(3);
            expect(() => wsBroken.on('x', () => {})).throws(wsNotFoundErr.message);
        });

        it('should throw WebSocketNotExistsError', () => {
            const wsBroken = new WsEasy(null);
            expect(() => wsBroken.on('x', () => {})).throws(wsNotExistsErr.message);
        });

        it('should bind fn to its standard event', () => {
            const errorfn = () => 'Error fn!';
            const connfn = () => 'Conn fn!';

            wss.on(StandardEvents.error, errorfn);
            wss.on(StandardEvents.connection, connfn);

            expect(wss.events.get(StandardEvents.error).getCallback()).to.be.equal(errorfn);
            expect(wss.events.get(StandardEvents.connection).getCallback()).to.be.equal(connfn);
        });

        it('should have the custom event set', () => {
            wss.on(customEvtName, () => {});

            expect(wss.events.get(customEvtName)).to.not.be.null;
            expect(wss.events.get(customEvtName)).to.be.instanceOf(WebSocketCustomEvent);
        });

        it('should replace one cb for the next cb', () => {
            const firstcb = () => 1;
            const secondcb = () => 2;

            wss.on(StandardEvents.connection, firstcb);
            wss.on(StandardEvents.connection, secondcb);
            wss.on(customEvtName, firstcb);
            wss.on(customEvtName, secondcb);

            expect(wss.events.get(StandardEvents.connection).getCallback()).to.not.be.equal(firstcb);
            expect(wss.events.get(StandardEvents.connection).getCallback()).to.be.equal(secondcb);
            expect(wss.events.get(customEvtName).getCallback()).to.not.be.equal(firstcb);
            expect(wss.events.get(customEvtName).getCallback()).to.be.equal(secondcb);
        });
    });

    describe('#destroy()', () => {
        it('should finish without errors', async () => {
            expect(await wss.destroy()).to.not.be.instanceOf(Error);
        });

        it('should mark closed flag as true', async () => {
            await wss.destroy();
            expect(wss.isClosed()).to.be.true;
        });
    });
});