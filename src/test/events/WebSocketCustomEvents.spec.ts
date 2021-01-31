import { expect } from 'chai';

import { WebSocketCustomEvent, WebSocketCustomEvents } from "../../../src/events";

const wsce = new WebSocketCustomEvents();
const customEventsMapFreezed = wsce.customEventsMap;

describe('WebSocketCustomEvents', () => {
    describe('#constructor()', () => {
        it('should initialize customEventsMap', () => {
            expect(customEventsMapFreezed).to.not.be.null;
            expect(customEventsMapFreezed.size).to.be.equal(0);
        });
    });

    describe('#add', () => {
        it('should add the event', () => {
            const customEventName = 'custom-event-name';
            const customEvent = new WebSocketCustomEvent(customEventName)
            wsce.add(customEvent);

            expect(wsce.customEventsMap.size).to.be.equal(1);
            expect(wsce.customEventsMap.get(customEventName)).to.not.be.null;
            expect(wsce.customEventsMap.get(customEventName)).to.be.deep.equal(customEvent);
        })
    });
});