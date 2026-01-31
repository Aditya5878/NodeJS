const http = require("http");
const fs = require("node:fs");
const server = http.createServer(function (req: any, res: any) {
  const method = req.method;
  const path = req.url;
  const log = `[${new Date().toISOString()}]:${method}:${path}`;

    fs.appendFileSync('log.txt', log , 'utf-8');

  switch (method) {
    case "GET":
      switch (path) {
        case "/":
          res.writeHead(200);
          return res.end("Hello");

        case "/contact-us":
          res.writeHead(200);
          return res.end(
            "Please contact at Email: aditya.dev@gmail.com or mob: xxxxxxxxxx",
          );

        case "/tweet":
          res.writeHead(200);
          return res.end("Here is you tweet");

        default :
        res.writeHead(404);
        return res.end("You are lost");
      }


    case "POST":
      if (path == "/tweet") {
        res.writeHead(201);
        return res.end("Your Tweet was created");
      }

    default : 
    res.writeHead(404);
    return res.end("You are lost");


    
  }
});

server.listen(3000, () => {
  console.log("listening at port 3000");
});
