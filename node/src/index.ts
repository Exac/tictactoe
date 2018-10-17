'use strict';
import * as dotenvsafe from 'dotenv-safe';
dotenvsafe.config();
import chalk from 'chalk'
import { createConnection, Connection } from 'typeorm';

function log(msg: any, isWarn?: boolean) {
    const prefix = `[TTT.index]`
    console.log((isWarn ? chalk.black.bgWhite(prefix) : chalk.black.bgGreenBright(prefix)) + ' ' + msg);
}

log(`Creating database connection...`, true)

createConnection().then(async (connection: Connection) => {
    log(`Database connection successful`)
    require('./server.ws')
}).catch((error: Error) => { log(`Error connecting to database, ${error.message}`, true) });
