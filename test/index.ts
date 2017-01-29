import { Server, Controller } from '../src';
import * as fs from 'fs';

var clientCerts: string[] = [];
var key: string = fs.readFileSync("./test/ssl/auth-test-key.pem", "utf-8")
var cert: string = fs.readFileSync("./test/ssl/auth-test-cert.pem", "utf-8")

readCertificates();
var server: Server = new Server(key, cert, clientCerts);

server.RegisterController('echo', new Controller().addGET((data, res) => {
    res.sendData(200, data);
}));

server.Start();

function readCertificates() {
    fs.readdirSync("./test/ssl/certificates").forEach(f => {
        clientCerts.push(fs.readFileSync(`./test/ssl/certificates/${f}`, "utf-8"));
    })
}