import { Server, Controller } from '../src';
import * as fs from 'fs';

let clientCerts: string[] = [];
let key: string = fs.readFileSync("./ssl/auth-test-key.pem", "utf-8");
let cert: string = fs.readFileSync("./ssl/auth-test-cert.pem", "utf-8");

readCertificates();
let server: Server = new Server(key, cert, clientCerts);

server.RegisterController('echo', new Controller().addGET((data, res) => {
    res.sendData(200, data);
}));

server.Start();

function readCertificates() {
    fs.readdirSync("./ssl/certificates").forEach(f => {
        clientCerts.push(fs.readFileSync(`./ssl/certificates/${f}`, "utf-8"));
    });
}