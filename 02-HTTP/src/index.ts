const http = require("http");
const time = Date.now;
const port = 3000;

console.log("time is ", time);
const server = http.createServer(function (req: any, res: any) {

  switch (req.url) {
    case "/":
      res.writeHead(200);
      return res.end(" You are at home page");
    case "/contact-us":
      res.writeHead(200);
      return res.end("Contact me at adityaverma.dev@gmail.com");
    default:
      res.writeHead(404);
      return res.end("You are lost");
  }
});

server.listen(port, () => {
  console.log(`Listening on ${port}`);
});
