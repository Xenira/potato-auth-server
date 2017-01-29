import { ClearTextStream } from 'tls';

export class Response {
    isSent: boolean = false;
    code: number;
    data: any;

    constructor(private stream: ClearTextStream) { }

    send() {
        if (!this.code || this.code < 100 || this.code >= 600) throw new Error("Code must be set and between 100 and 600");
        if (this.isSent) throw new Error("Response was already sent");
        this.stream.write(JSON.stringify({ c: this.code, d: this.data }));
        this.isSent = true;
    }

    sendData(code: number, data?: any) {
        this.code = code;
        this.data = data;
        this.send();
    }

    error(code?: number, e?: Error) {
        this.sendData(code || 400, e ? e.message : null);
    }
}