import Message from './message.i';

export default class GameoverMessage implements Message {
    public type: string = 'gameover';
    public auth: string = '';
    public data: any[] = [];

    constructor(board: string[][], isPlayerWin: boolean, playerEloChange: number, playerElo: number, opponentEloChange: number, opponentElo: number) {
        this.data[0] = board;
        this.data[1] = isPlayerWin;
        this.data[2] = playerEloChange;
        this.data[3] = playerElo;
        this.data[4] = opponentEloChange;
        this.data[5] = opponentElo;
    }

}
