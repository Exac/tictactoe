"use strict";
import "reflect-metadata";
import chalk from 'chalk';
import { getConnection, Connection } from 'typeorm';
import { User } from './entity/User';
import { Request, Response, Router } from 'express';
import express from 'express';
import bodyParser from 'body-parser'
import * as bcrypt from 'bcrypt';
import morgan from 'morgan';
import { Game } from './entity/Game';
import cors from 'cors';
import * as jwt from 'jsonwebtoken';
import expressJwt from 'express-jwt';

console.log(chalk.black.bgGreen(`[TTT.server.http]`) + ` loaded`)

let app: express.Express = express().use(bodyParser.json());

!(async function () {

    var allowCrossDomain = function (req: Request, res: Response, next: any) {
        res.header('Access-Control-Allow-Origin', 'localhost');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type');
        next();
    }
    app.use(allowCrossDomain);
    app.use(cors());
    app.use(expressJwt({ secret: process.env['jwt_secret']! }).unless({ path: ['/api/auth', '/api/register', '/api/test'] }))
    app.use(morgan(function (tokens: morgan.TokenIndexer, req: Request, res: Response) {
        morgan.token('request', function getRequest(req) {
            if (req.body && req.body.password) req.body.password = '**********'; // Don't log people's passwords
            return JSON.stringify(req.body);
        })
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms',
            tokens['request'](req, res), '-'
        ].join(' ')
    }));

    let connection: Connection = await getConnection()

    console.log(chalk.black.bgGreen(`[TTT.server.http]`) + ` Database connection successful`)

    app.get('/api/test', async function (req: Request, res: Response) {
        let board: string[][] = [['', '', ''], ['x', 'x', 'o'], ['', '', '']];
        let g: Game = new Game();
        g.x = 1;
        g.o = 0;
        g.xstatus = 'connected'
        g.ostatus = 'connected'
        g.board = board;
        let gameRepository = connection.getRepository(Game);
        let x = await gameRepository.save(g);
        console.log('g added', x)

        let gamefromdb = await gameRepository.findOne({ game_id: x.game_id });
        res.send('check database' + JSON.stringify(gamefromdb))
    });

    app.get('/', (req: Request, res: Response) => {
        res.send('root')
    })

    // goo.gl/jpV9LL
    app.post('/api/auth', async function (req: Request, res: Response) {
        const body = req.body;
        const USERS = await connection.manager.find(User);
        const user = USERS.find(user => user.alias == body.alias);
        if (!user) {
            console.log(chalk.black.bgYellow(`[TTT.server.http]`) + ` Failed to find user with alias ${body.alias}.`);
            return res.sendStatus(401);
        }
        let match = await bcrypt.compare(body.password, user.password)
        if (!match) {
            console.log(chalk.black.bgYellow(`[TTT.server.http]`) + ` Unauthorized login attempt`);
            return res.sendStatus(401);
        }

        var token = jwt.sign(
            {
                user_id: user.user_id,
                alias: user.alias,
                email: user.email,
            },
            process.env['JWT_SECRET']!,
            { expiresIn: '2h' });
        console.log(chalk.black.bgGreen(`[TTT.server.http]`) + ` Login successful for user:`, user)
        return res.send({ token });
    })
    app.get('/api/auth', async function (req: Request, res: Response) {
        return res.send('POST to /api/auth instead of GET');
    })

    app.post('/api/register', async function (req: Request, res: Response) {
        const body = req.body;
        let userRepository = connection.getRepository(User);
        let existingAlias = await userRepository.findOne({ alias: body.alias });
        let existingEmail = await userRepository.findOne({ email: body.email });
        if (existingAlias || existingEmail) {
            // User already exists
            return res.sendStatus(400);
        }
        // create the user
        const user = new User();
        user.alias = body.alias;
        user.email = body.email;
        user.password = await bcrypt.hash(body.password, await bcrypt.genSalt(4));
        await connection.manager.save(user);
        return res.send({ user: user })
    })

})();

export default app
