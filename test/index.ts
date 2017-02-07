import { Server, Controller } from '../src';
import * as fs from 'fs';
import { DynamoDatabase } from './dynamo.database';

let clientCerts: string[] = [];
let key: string = fs.readFileSync(__dirname + "/ssl/auth-test-key.pem", "utf-8");
let cert: string = fs.readFileSync(__dirname + "/ssl/auth-test-cert.pem", "utf-8");

readCertificates();
let server: Server = new Server(key, cert, clientCerts);
let db: DynamoDatabase = new DynamoDatabase("eu-west-1", "abc", "def", "id", "mail");
server.RegisterController('echo', new Controller().addGET((data, res) => {
    res.sendData(200, data);
}));

server.Start();

function readCertificates() {
    fs.readdirSync(__dirname + "/ssl/certificates").forEach(f => {
        clientCerts.push(fs.readFileSync(`${__dirname}/ssl/certificates/${f}`, "utf-8"));
    });
}