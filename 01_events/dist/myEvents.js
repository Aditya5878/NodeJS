"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EventEmitter = require("events");
const eventEmitter = new EventEmitter();
eventEmitter.on("greet", (username) => {
    console.log(`Hello! how are you ${username}?`);
});
eventEmitter.emit("greet", "Adi Manav");
//# sourceMappingURL=myEvents.js.map