import GameStateI from "./gamestate.interface";
import { JwtHelperService } from "@auth0/angular-jwt";

export default class GameState implements GameStateI {
    public board: string[][];
    public gameId: number;
    public opponentAlias: string;
    public opponentElo: number;
    private _opponentType: 'x' | 'o';
    public playerAlias: string;
    public playerElo: number;
    private _playerType: 'x' | 'o';
    public isInQueue: Date | false;
    public isDisconnected: Date | false;

    constructor(board?: string[][], gameId?: number, opponentAlias?: string, opponentElo?: number, opponentType?: 'x' | 'o', playerType?: 'x' | 'o') {
        const helper = new JwtHelperService();

        this.board = board ? board : [['', '', ''], ['', '', ''], ['', '', '']];
        this.gameId = gameId ? gameId : 0;
        this.opponentAlias = opponentAlias ? opponentAlias : 'AI';
        this.opponentElo = opponentElo ? opponentElo : 1500;
        this.opponentType = opponentType ? opponentType : 'o';
        this.playerAlias = helper.decodeToken(localStorage.getItem('access_token')).alias;
        this.playerType = this.opponentType === 'x' ? 'o' : 'x'; // opposite
        this.isInQueue = false;
        this.isDisconnected = false;
    }

    /**
     * Reset game to its original state
     */
    public reset = () => {
        this.board = [['', '', ''], ['', '', ''], ['', '', '']];
        this.gameId = 0;
        this.opponentAlias = 'AI';
        this.opponentElo = 1500;
        this._opponentType = 'o';
        this._playerType = 'x';
    }

    get opponentType(): 'x' | 'o' {
        return this._opponentType;
    }

    get playerType(): 'x' | 'o' {
        return this._playerType;
    }

    set opponentType(type: 'x' | 'o') {
        this._opponentType = type;
        this._playerType = (type === 'o') ? 'x' : 'o';
    }

    set playerType(type: 'x' | 'o') {
        this._playerType = type;
        this._opponentType = (type === 'o') ? 'x' : 'o';
    }

    get isPlayerTurn(): boolean {
        // Use game service's state if not provided
        let _board = this.board;
        let xcount = 0, ocount = 0;
        // check number of 'x' and 'o' occurances on board.
        _board.map((v) => {
            v.map((i) => {
                if (i === 'x') { ++xcount; }
                if (i === 'o') { ++ocount; }
            });
        });
        let turn: boolean =  xcount > ocount
            ? /* o's turn */(this.playerType === 'o')
            : /* x's turn */(this.playerType === 'x');
        return !this.isInQueue ? turn : false;
    }

    get winner(): 'x' | 'o' | false {
        // poor code
        let b = this.board;
        if ((b[0][0] === 'x' && b[0][1] === 'x' && b[0][2] === 'x') ||
            (b[1][0] === 'x' && b[1][1] === 'x' && b[1][2] === 'x') ||
            (b[2][0] === 'x' && b[2][1] === 'x' && b[2][2] === 'x') ||
            (b[0][0] === 'x' && b[1][0] === 'x' && b[2][0] === 'x') ||
            (b[0][1] === 'x' && b[1][1] === 'x' && b[2][1] === 'x') ||
            (b[0][2] === 'x' && b[1][2] === 'x' && b[2][2] === 'x') ||
            (b[0][0] === 'x' && b[1][1] === 'x' && b[2][2] === 'x') ||
            (b[2][0] === 'x' && b[1][1] === 'x' && b[0][2] === 'x')) { return 'x'; }
        if ((b[0][0] === 'o' && b[0][1] === 'o' && b[0][2] === 'o') ||
            (b[1][0] === 'o' && b[1][1] === 'o' && b[1][2] === 'o') ||
            (b[2][0] === 'o' && b[2][1] === 'o' && b[2][2] === 'o') ||
            (b[0][0] === 'o' && b[1][0] === 'o' && b[2][0] === 'o') ||
            (b[0][1] === 'o' && b[1][1] === 'o' && b[2][1] === 'o') ||
            (b[0][2] === 'o' && b[1][2] === 'o' && b[2][2] === 'o') ||
            (b[0][0] === 'o' && b[1][1] === 'o' && b[2][2] === 'o') ||
            (b[2][0] === 'o' && b[1][1] === 'o' && b[0][2] === 'o')) { return 'o'; }
        return false;
    }

}
