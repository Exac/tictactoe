import readline from 'readline';
import chalk from 'chalk';
import WebSocket from 'ws';
import * as http from 'http';
import app from './server.http'
import * as jwt from 'jsonwebtoken';
import { getConnection, Connection } from 'typeorm';
import { Observable, Subject, from, of, range } from 'rxjs';
import { map, filter, switchMap } from 'rxjs/operators';
import { Game } from './entity/Game';
import { User } from './entity/User';
import Message from './networking/message.i';
import QueueMessage from './networking/queueMessage';
import MatchMessage from './networking/matchMessage';
import AI from './ai';


// Add isAlive property to ws so we can close abandoned connections
interface WebSocketTTT extends WebSocket {
    isAlive: boolean;
    userId: number;
    userAlias: string;
    /**
     * The type of queue the user is in. Blank for not queued.
     */
    queue: '' | 'ai' | 'pvp' | 'pve';
}

interface ServerTTT extends WebSocket.Server {
    clients: Set<WebSocketTTT>;
    matches: Game[];
}

// Setup server
const server = http.createServer();
const wss: ServerTTT = new WebSocket.Server({ /*port: 3000,*/ clientTracking: true, server: server }) as ServerTTT;
wss.matches = [];
console.log(chalk.black.bgGreen(`[TTT.server.ws]`) + ` loaded`)

!(async function () {

    // setup database connection
    let database: Connection = await getConnection();

    // Send requests to the HTTP app, and handle WebSockets connections here.
    server.on('request', app);

    wss.on('error', async function connection(err: Error) {
        console.log(chalk.black.bgRed(`[TTT.server.ws]`) + `WSS error caught: ${err.message}`)
    })

    wss.on('connection', async function connection(ws: WebSocketTTT, req: http.IncomingMessage) {
        // isAlive provides a backup method for us to ensure dead ws connections can be removed.
        ws.isAlive = true;

        // ping() is running on an interval, when a client 
        // recieves a ping, they respond with a pong and
        // we know that the connection is still alive.
        ws.on('pong', function () { (this as WebSocketTTT).isAlive = true; })

        ws.on('close', async function (code: number, reason: string) {
            console.log(chalk.black.bgYellow(`[TTT.server.ws]`) + ` Connection closed. code: ${code}, reason: ${reason}`)
            // remove from queue if in queue
        })

        ws.on('message', function incoming(message: WebSocket.Data) {
            let msg: any = parseJSON(message.toString());

            try {
                var decodedJwt: any = jwt.verify(msg.auth, process.env['JWT_SECRET']!);
            } catch (err) {
                console.log(chalk.black.bgRedBright(`[TTT.server.ws]`) + ` Failed JWT authentication`, err.message);
                ws.send(JSON.stringify({ type: 'reauth', data: { 'error': err.message } }));
                return;
            }

            let type: string = msg.type; // queue | match | update | gameover
            let data: any = msg.data;
            let userId = decodedJwt['user_id'];
            let userAlias = decodedJwt['alias'];

            console.log(chalk.black.bgWhite(`[TTT.server.ws]`) + ` message recieved`, type, userAlias, data)

            switch (type) {
                case 'syn':
                    ws.userId = userId;
                    ws.userAlias = userAlias;
                    break;
                case 'queue':
                    ws.userId = userId;
                    ws.userAlias = userAlias;
                    ws.queue = data[0];
                    matchMake();
                    break;
                case 'match':
                    console.error(chalk.black.bgRedBright(`[TTT.server.ws]`) + ` Client cannot send 'match' messages.`);
                    break;
                case 'update':

                    break;
                case 'gameover':
                    console.error(chalk.black.bgRedBright(`[TTT.server.ws]`) + ` Client cannot send 'gameover' messages.`);
                    break;
                default:
                    console.error(chalk.black.bgRedBright(`[TTT.server.ws]`) + ` Unknown message, type=${type}`);
            }

        });


        /**
         * Match players against their desired opponents if possible.
         */
        async function matchMake() {
            let gameRepository = database.getRepository(Game);
            let userRepository = database.getRepository(User);

            console.error(chalk.black.bgBlueBright(`[TTT.server.ws]`) + ` matchMake()`);

            let wsP1: WebSocketTTT, wsP2: WebSocketTTT;
            wss.clients.forEach(async (_ws: WebSocketTTT) => {
                // PVP matches.
                if (_ws.queue === 'pvp') {
                    // take the first two players in queue.
                    if (!wsP1) { wsP1 = _ws; } else if (!wsP2) { wsP2 = _ws; }
                    if (wsP1 && wsP2) {
                        console.error(chalk.black.bgBlueBright(`[TTT.server.ws]`) + ` PVP started`);
                        let pvpGame = new Game(); // Randomly choose who moves first:
                        const isP1First: boolean = Math.floor(Math.random() * 2) === 1 ? true : false;
                        pvpGame.x = isP1First ? wsP1.userId : wsP2.userId;
                        pvpGame.o = !isP1First ? wsP1.userId : wsP2.userId;
                        pvpGame.xstatus = 'connected';
                        pvpGame.ostatus = 'connected';
                        pvpGame.last = new Date(Date.now());
                        pvpGame.board = [['', '', ''], ['', '', ''], ['', '', '']];
                        wsP1.queue = '';
                        wsP2.queue = '';
                        await gameRepository.save(pvpGame);
                        wss.matches.push(pvpGame)
                        const mp1 = new MatchMessage(
                            pvpGame.game_id,
                            wsP2.userAlias,
                            await userRepository.findOneOrFail({ user_id: wsP2.userId }).then((u: User) => { return u.elo; }),
                            isP1First ? 'x' : 'o');
                        const mp2 = new MatchMessage(
                            pvpGame.game_id,
                            wsP1.userAlias,
                            await userRepository.findOneOrFail({ user_id: wsP1.userId }).then((u: User) => { return u.elo; }),
                            isP1First ? 'o' : 'x');
                        wsP1.send(JSON.stringify({ type: mp1.type, data: mp1.data }));
                        wsP2.send(JSON.stringify({ type: mp2.type, data: mp2.data }));
                    }
                }
                // AI matches.
                if (_ws.queue === 'ai') {
                    let aiGame = new Game(); // Randomly choose who moves first:
                    const isAiFirst: boolean = Math.floor(Math.random() * 2) === 1 ? true : false;
                    aiGame.x = isAiFirst ? 0 : _ws.userId;
                    aiGame.o = !isAiFirst ? 0 : _ws.userId;
                    aiGame.xstatus = 'connected';
                    aiGame.ostatus = 'connected';
                    aiGame.last = new Date(Date.now());
                    aiGame.board = [['', '', ''], ['', '', ''], ['', '', '']];
                    await gameRepository.save(aiGame);
                    wss.matches.push(aiGame)
                }
            });

        }
    });

    function ping() {
        // Check if each connection is still connected. `ws` does this automatically,
        // so this acts as a backup.
        wss.clients.forEach((ws: WebSocket) => {
            let w = ws as WebSocketTTT;
            if (w.isAlive === false) {
                console.log(chalk.black.bgWhiteBright(`[TTT.server.ws]`) + ' Terminating WebSocket');
                return w.terminate();
            }
            w.isAlive = false;
            w.ping(() => { }); // noop
        })
    }

    setInterval(ping, 3000)

    /**
     * DEV BROADCAST FUNCTIONALITY
     */
    const rl = readline.createInterface({
        input: process.stdin
    })

    rl.on('line', (input) => {
        console.log(chalk.black.bgGreen(`broadcast[${wss.clients.size}]:`) + ` ${input}`)
        wss.clients.forEach((ws: WebSocket) => {
            ws.send(`server: ${input}`, function ack(error) {
                if (error) {
                    console.log(chalk.black.bgRedBright(`failed sending:`) + ` ${input}`)
                }
            })
        })
    })

    // Start the server
    server.listen(3000, function () {
        console.log(chalk.black.bgGreen(`[TTT.server.ws]`)
            + ` WebSocket server listening on ws://localhost:3000`)
        console.log(chalk.black.bgGreen(`[TTT.server.ws]`)
            + ` Express HTTP server listening on http://localhost:3000`)
    })

    /**
         * parseJSON returns a parsed object from the supplied string if possible
         * @param str String that is potentially JSON
         */
    function parseJSON(str: string): object | string {
        try {
            let obj: object = JSON.parse(str);
            // JSON.parse(null) => null, so check for it here.
            if (obj && typeof obj === 'object') {
                return obj;
            }
        } catch (err) {
            // Return str
        }

        return str;
    }

})();

export default wss
