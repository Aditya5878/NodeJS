"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http = require('http');
const port = 3000;
const server = http.createServer();
server.listen(port, () => {
    console.log(`Listening on ${port}`);
});
//# sourceMappingURL=index.js.map