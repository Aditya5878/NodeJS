
import mongoose from 'mongoose';

// export const connectMongoDB = async(connectionURL: string) =>{
//     return await mongoose.connect(connectionURL);
// }


const connetMongoDB = async(connectionURL : string) =>{
    try{
        await mongoose.connect(connectionURL);
        console.log("MongoDB connected...")
    } catch (error){
        console.log("mongoDB connection error" , error);
        process.exit(1);
    }
}

export default connetMongoDB;
