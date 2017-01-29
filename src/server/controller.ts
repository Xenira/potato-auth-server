import { Response } from './response';

export class Controller {
    GET: Array<(data, res: Response) => void>;
    POST: Array<(data, res: Response) => void>;
    PUT: Array<(data, res: Response) => void>;
    DELETE: Array<(data, res: Response) => void>;

    addGET(callback: (data, res: Response) => void): Controller {
        if (!this.GET) this.GET = [];
        this.GET.push(callback);
        return this;
    }

    addPOST(callback: (data, res: Response) => void): Controller {
        if (!this.POST) this.POST = [];
        this.POST.push(callback);
        return this;
    }

    addPUT(callback: (data, res: Response) => void): Controller {
        if (!this.PUT) this.PUT = [];
        this.PUT.push(callback);
        return this;
    }

    addDELETE(callback: (data, res: Response) => void): Controller {
        if (!this.DELETE) this.DELETE = [];
        this.DELETE.push(callback);
        return this;
    }
}