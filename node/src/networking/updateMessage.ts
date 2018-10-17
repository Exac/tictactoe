import Message from './message.i';

export default class UpdateMessage implements Message {
    public type: string = 'match';
    public auth: string;
    public data: any[] = [];

    constructor(gameId: number, board: string[][]) {
        this.data[0] = gameId;
        this.data[1] = board;
    }

}
