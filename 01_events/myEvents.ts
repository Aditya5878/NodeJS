const EventEmitter = require("events");


const eventEmitter = new EventEmitter();

eventEmitter.on("greet" , (username: string)=>{
    console.log(`Hello! how are you ${username}?`)
})


eventEmitter.emit("greet", "Adi Manav");

