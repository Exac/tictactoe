import sinon from 'sinon';
import { expect, should } from 'chai';
import 'mocha';
import { cn, log } from './index';
import { Connection } from 'typeorm';

describe('index', () => {

    it(`loads environmental variables`, async () => {
        expect(process.env['TYPEORM_CONNECTION']).to.not.be.empty
        expect(process.env['TYPEORM_HOST']).to.be.string
        expect(process.env['TYPEORM_PORT']).does.exist
        expect(process.env['TYPEORM_USERNAME']).is.not.undefined
    })

    describe(`log()`, () => {
        it(`is loaded as a function`, () => {
            let result: boolean = (log instanceof Function);
            expect(result).to.be.true;
        });
    })

})
