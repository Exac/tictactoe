import Message from './message.i';

export default class TMessage implements Message {
    public type: string = '';
    public auth: string = '';
    public data: any[] = [];

    constructor() { }

}
