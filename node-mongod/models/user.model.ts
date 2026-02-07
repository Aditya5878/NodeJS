import {Schema , model} from 'mongoose';
import { emitWarning } from 'node:process';

const userSchema = new Schema({
    name : {
        type : String ,
        requires : true,
    },
    email :{
        type : String , 
        required : true, 
        unique : true,
    },
    password : {
        type : String , 
        required : true,
    },
    salt : {
        type : String , 
        required : true,
    }
} , {timestamps: true}
)


export const User = model('user', userSchema);