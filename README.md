# Auth and DB Server

Purpose of the Auth and DB server is to authenticate clients at the *top-level* connector and provide Data from the Database to the gameservers.
> ### Table of Contents
> 1. [Server](#server)
> 2. [Controller](#controller)
> 3. [Response](#response)
> 4. [TLS and Certificates](#tls)
## Server
The server accepts incomming connections from authorised clients. Messages sent by the client must be in the following format.
```ts
{
    v: 'GET' | 'POST' | 'PUT' | 'DELETE';
    m: string;
    d: any;
}
```
`v`: HTTP verb (GET, POST, PUT or DELETE)

`m`: Methode path

`d`: Data

### Construction
#### Signature
```ts
constructor(key: string, cert: string, clientCerts: string[])
```
#### Excample
```ts
import { Server } from 'potato-auth-server';

// Load private and public key
var key: string = fs.readFileSync("path_to_private_key.pem", "utf-8")
var cert: string = fs.readFileSync("path_to_private_cert.pem", "utf-8")

// Load client certificates
fs.readdirSync("certificate_folder").forEach(f => {
    clientCerts.push(fs.readFileSync(`certificate_folder/${f}`, "utf-8"));
})

var server = new Server(key, cert, clientCerts);
```
### Adding Controllers
#### Signature
```ts
RegisterController(path: string, controller: Controller)
```
#### Excample
```ts
server.RegisterController('echo', new Controller().setGET((data, res) => {
    res.sendData(200, data);
}));
```
### Removing Controllers
#### Signature
```ts
RemoveController(path: string)
```
#### Excample
```ts
server.RegisterController('echo', new Controller().setGET((data, res) => {
    res.sendData(200, data);
}));
```
## Controller
### Construction
The constructor takes no arguments.
### Adding callbacks to verbs
There is a methode for each verb allowing to add a callback to that verb. When the controller is called for that verb all registered callbacks are called. The add methodes return the Controller allowing for methode chaining.
#### Signature
```ts
addGET(callback: (data, res: Response) => void): Controller
addPOST(callback: (data, res: Response) => void): Controller
addPUT(callback: (data, res: Response) => void): Controller
addDELETE(callback: (data, res: Response) => void): Controller
```
### Excample
```ts
new Controller().addGET((data, res) => {
    // This echos the data back to the client
    res.sendData(200, data);
}).addGET((data, res) => {
    // CAUTION This will never get called. See response documentation for details
    res.sendData(200, data);
});
```
## Response
The response object holds the status code (Use HTTP status codes here) and the response data before sending it to the client. After sending data the response object will reject every further attempt to send data. This allows for chaning controller methodes without sending untill the response was sent. 

**This means that callbacks for a verb are chained only untill the response is sent! Each callback for a verb getts called with the same Response object!**

Be carefull when sending data directly, as not providing any data results in sending a response without data and you might end up overwriting data set by a previous callback.
### Sending Data
#### Signature
```ts
send(): void; // sends code and data properties
sendData(code: number, data?: any): void // sends code and data parameters
error(code?: number, e?: Error): void // sends parameters. code defaults to 400, e uses the message
```
#### Throws when
- Status code is invalid
- Response was already sent
## TLS and Certificates <a name="tls"></a>
The DB Server should only be accessable from the backend servers (tl connector and game server). Make sure to load certificates for every server that should be able to connect to this server.