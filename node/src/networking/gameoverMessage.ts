import Message from './message.i';

export default class GameoverMessage implements Message {
    public type: string = 'gameover';
    public auth: string = '';
    public data: any[] = [];

    constructor(board: string[][], winner: 'x' | 'o' | false, playerEloChange: number, playerElo: number, opponentEloChange: number, opponentElo: number) {
        this.data[0] = board;
        this.data[1] = winner;
        this.data[2] = playerEloChange;
        this.data[3] = playerElo;
        this.data[4] = opponentEloChange;
        this.data[5] = opponentElo;
    }

}
