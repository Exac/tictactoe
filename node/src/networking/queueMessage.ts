import Message from './message.i';

export default class QueueMessage implements Message {
    public type: string = 'queue';
    public auth: string;
    public data: any[] = [];

    constructor(against: 'ai' | 'pvp' | 'self') {
        this.data[0] = against;
    }

}
