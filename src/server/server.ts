import { createServer, TlsOptions, ClearTextStream } from 'tls';
import * as winston from 'winston';

import { Response } from './response';
import { Controller } from './controller';

interface IRequest {
    v: 'GET' | 'POST' | 'PUT' | 'DELETE';
    m: string;
    d: any;
}

export class Server {

    private controllers: any = {};
    private options: TlsOptions;

    constructor(key: string, cert: string, clientCerts: string[]) {
        this.options = {
            key,
            cert,

            requestCert: true,
            rejectUnauthorized: true,
            ca: clientCerts
        }
    }

    public Start(port: number = 8000) {
        winston.info("TLS server starting");
        let server = createServer(this.options, (stream) => {
            winston.info(`Stream opened on ${stream.remoteAddress}:${stream.remotePort}`);
            stream.on("data", (chunk) => {
                try {
                    let request: IRequest;
                    if (typeof chunk === "string") request = JSON.parse(chunk);
                    else request = JSON.parse(chunk.toString("utf-8"));
                    this.HandleClientMessage(stream, request);
                } catch (e) {
                    winston.error(e);
                    new Response(stream).sendData(400);
                }
            });
            stream.on("error", (e) => {
                winston.error("Client error", e);
            })
        })

        server.listen(port, () => {
            winston.info('Server bound on port ' + port);
        });

        server.on('error', (e) => {
            winston.error("Server error", e);
            setTimeout(() => {
                winston.info('Restarting server');
                this.Start();
            }, 15 * 1000)
        })
    }

    public RegisterController(path: string, controller: Controller) {
        if (this.controllers[path]) winston.warn(`Controller ${path} is already registered and will be overwritten`);
        this.controllers[path] = controller;
    }

    public RemoveController(path: string) {
        if (!this.controllers[path]) return winston.warn(`Trying to remove controller ${path} wich is not registered`);
        delete this.controllers[path];
    }

    private HandleClientMessage(stream: ClearTextStream, request: IRequest) {
        try {
            if (!this.controllers[request.m]) return new Response(stream).sendData(404, `Controller '${request.m}' does not exist`);
            let controller: Controller = this.controllers[request.m];
            switch (request.v) {
                case 'GET':
                    if (!controller.GET) return new Response(stream).sendData(405, `Controller '${request.m}' does not support GET verb`);
                    this.CallControllers(stream, controller.GET, request.d);
                    break;
                case 'POST':
                    if (!controller.POST) return new Response(stream).sendData(405, `Controller '${request.m}' does not support POST verb`);
                    this.CallControllers(stream, controller.POST, request.d);
                    break;
                case 'PUT':
                    if (!controller.PUT) return new Response(stream).sendData(405, `Controller '${request.m}' does not support PUT verb`);
                    this.CallControllers(stream, controller.PUT, request.d);
                    break;
                case 'DELETE':
                    if (!controller.DELETE) return new Response(stream).sendData(405, `Controller '${request.m}' does not support DELETE verb`);
                    this.CallControllers(stream, controller.DELETE, request.d);
                    break;
                default:
                    return new Response(stream).sendData(400, 'Supported HTTP verbs: GET, POST, PUT, DELETE');
            }
        } catch (e) {
            new Response(stream).error(500, e);
        }
    }

    private CallControllers(stream: ClearTextStream, controllers: Array<(data, res: Response) => void>, data: any) {
        let response = new Response(stream);
        controllers.forEach(c => {
            if (response.isSent) return;
            c(data, response);
        });
        if (!response.isSent) response.error(501);
    }
}