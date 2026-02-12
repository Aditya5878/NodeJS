import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import connetMongoDB from "./db/index";
// import "./types/express";


// dotenv.config({
//   path: "./.env",
// });
// dotenv.config();

const port = process.env.PORT || 3000;
const connectionURL = process.env.MONGO_URI as string;
connetMongoDB(connectionURL)
  .then(() => {
    app.listen(port, () => {
      console.log(`connected to Port : ${port}`);
    });
  })
  .catch((err) => {
    console.log("MongoDB connect error", err);
    process.exit(1);
  });

// const connect = process.env.MONGO_URI as string ;
// connetMongoDB(connect).then();
// app.listen(port, ()=>{
//     console.log(`listening at post ${port}`);
// })
