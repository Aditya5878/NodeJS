import express from 'express';
import { Response , Request } from "express";
import cors from 'cors';
import  healthCheckrouter from "./routes/healthcheck.route" 
import authRouter from "./routes/auth.route"
import cookieParser from "cookie-parser"
const app = express();

// Middlewares
app.use(express.json({limit : "16kb"}));
app.use(express.urlencoded({extended: true , limit :"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());
// cors for UI
app.use(cors({
    origin : process.env.CORS_ORIGIN?.split(",") || "http://localhost:5173",
    credentials : true,
    methods : ['GET' , 'POST' , 'PUT' , 'PATCH', 'DELETE' , 'OPTIONS'],
    allowedHeaders : ['Authorization' ,'Content-Type']
}));

// import the routes 
app.use("/api/v1/auth"  , authRouter);
app.use("/api/v1/healthcheck" ,  healthCheckrouter);

app.get("/" , (res : Response , req : Request)=>{
    res.send("Welcome to basecompany");
})


export default app;