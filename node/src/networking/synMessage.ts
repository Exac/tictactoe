import Message from './message.i';

export default class SynMessage implements Message {
    public type: string = 'syn';
    public auth: string;
    public data: any[] = [];

    constructor() { }

}
