import { Response } from './response';

export class Controller {
    GET: Array<(data, res: Response) => void>;
    POST: Array<(data, res: Response) => void>;
    PUT: Array<(data, res: Response) => void>;
    DELETE: Array<(data, res: Response) => void>;

    addGET(callback: (data, res: Response) => void): Controller {
        this.GET.push(callback);
        return this;
    }

    addPOST(callback: (data, res: Response) => void): Controller {
        this.POST.push(callback);
        return this;
    }

    addPUT(callback: (data, res: Response) => void): Controller {
        this.PUT.push(callback);
        return this;
    }

    addDELETE(callback: (data, res: Response) => void): Controller {
        this.DELETE.push(callback);
        return this;
    }
}