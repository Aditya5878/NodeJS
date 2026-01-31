"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require('http');
const server = http.createServer(function (res, req) {
    console.log(`Incoming requestion at [${Date.now}]`);
    console.log(req.header);
    res.writeHead(200);
    res.end("OK!");
});
server.listen(3000, () => {
    console.log(`Server is running on port 3000`);
});
// const http = require('http')
// const port = 3000;
// const server = http.createServer(function(req:any , res:any){
//  console.log('I got an incoming request');
//  // do some db operation
//  res.writeHead(200);
//  res.end('Thanks for vising my server');
// });
// server.listen(port , ()=>{
//     console.log(`Listening on ${port}`);
// })
//# sourceMappingURL=index.js.map