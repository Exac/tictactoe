import sinon from 'sinon';
import { expect, should } from 'chai';
import 'mocha';
import { server, wss, WebSocketTTT, ServerTTT } from './server.ws';
import * as http from 'http';

describe(`websocket.server`, () => {

    describe('server', () => {

        it(`is created`, () => {
            let result: boolean = (typeof server !== 'undefined');
            expect(result).to.be.true;
        });

        it(`is instantiated`, () => {
            let result: boolean = server instanceof http.Server;
            expect(result).to.be.true;
        });

    })

})