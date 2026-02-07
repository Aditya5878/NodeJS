import express from 'express';
import {connectMongoDB} from './connection';
import dotenv from 'dotenv';
import userRouter from './routes/user.route';
import {authmiddleware}  from './middlewares/auth.middleware' ;
dotenv.config();
const app = express();
const PORT = process.env.PORT ?? 8000;

const connect : string  =process.env.MONGODB_URL as string

connectMongoDB(connect).then(() => console.log(`MongoDB connected.`));

app.use(express.json());
app.use('/user',userRouter);
app.use(authmiddleware);
app.listen(PORT , ()=>{
    console.log(`Listening at port ${PORT}`);
})