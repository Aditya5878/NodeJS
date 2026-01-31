import express from "express";
const fs = require("node:fs");
import  bookRouter from "../routes/book_routes";
const port = 8000;
const app = express();

import {loggerMiddleware} from "../middleware/logger"

// Middleware
// app.use(express.json());

// // A custom middleware:

// app.use((req: Request, res: Response, next) => {
//   console.log("I am middleware A.");
//   next();
// });

// app.use((req: Request, res: Response, next) => {
//   console.log("I am middleware B");
//   next();
// });

// A middleware to log the activities.
// app.use((req: Request, res: Response, next) => {
//   const method = req.method;
//   const path = req.url;
//   const log = `[${new Date().toISOString()}]:${method}:${path}`;
//   fs.appendFileSync("log.txt", log, "utf-8");
//   next();
// });
//  Or we can write it as : 
// function loggerMiddleware(req : Request , res: Response , next : NextFunction){
//   const method = req.method;
//   const path = req.url;
//   const log = `[${new Date().toISOString()}]:${method}:${path}`;
//   fs.appendFileSync("log.txt", log, "utf-8");
//   next();
// };

// app.use(loggerMiddleware);


// function customMiddleware(req: Request , res: Response , next : NextFunction){
//      console.log("This is a custom middleware for /books path with GET method. ")
//      next();
// }

// Routes
// app.get("/books",customMiddleware, (req: Request, res: Response) => {    // Here can put another middleware next to customMiddleware
//   res.setHeader("x-name", "Aditya");
//   res.json(books);
// });

// app.get("/book/:id", (req: Request, res: Response) => {
//   const id = Number(req.params.id);

//   // for (const b of books) {
//   //     if (b.id === id) {
//   //         return res.json(b);
//   //     }
//   // }

//   const book = books.find((b) => b.id === id);
//   if (!book) {
//     res.status(404).json({ message: "Book not found" });
//   }
//   res.json(book);
// });

// app.post("/books", (req: Request, res: Response) => {
//   // you have to keep endpoint as books only
//   books.push(req.body); // before this we can add some condtion and checks too
//   console.log(books);
//   return res.send(`Successfully added ${JSON.stringify(req.body)} in db`);
// });

// app.delete("/book/:id", (res: Response, req: Request) => {
//   // delete the book having of given id.
//   const id = Number(req.params.id);

//   const indexTodelete = books.findIndex((e) => e.id === id);

//   if (indexTodelete < 0) {
//     return res.status(404).end("invalid id");
//   }

//   books.splice(indexTodelete, 1);

//   return res.status(200).json({ message: "deleted" });
// });



// Middleware plugin
app.use(express.json());
app.use(loggerMiddleware);

// Routers 
app.use('/books', bookRouter);

app.listen(port, () => {
  console.log(`listening at port ${port}`);
});
