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
    public isInQueue: boolean;

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
        return xcount > ocount
            ? /* o's turn */(this.playerType === 'o')
            : /* x's turn */(this.playerType === 'x');
    }
}
