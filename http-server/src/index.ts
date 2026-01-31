const http = require('http')

const port = 3000;

const server = http.createServer(function(req:any , res:any){
 console.log('I got an incoming request');
 // do some db operation
 res.writeHead(200);
 res.end('Thanks for vising my server');
});

server.listen(port , ()=>{
    console.log(`Listening on ${port}`);
})

