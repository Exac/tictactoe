import Message from './message.i';

export default class MatchMessage implements Message {
    public type: string = 'match';
    public auth: string = '';
    public data: any[] = [];

    constructor(gameid: number, opponentName: string, opponentElo: number, playerType: 'x' | 'o') {
        this.data[0] = gameid;
        this.data[1] = opponentName;
        this.data[2] = opponentElo;
        this.data[3] = playerType;
    }

}
