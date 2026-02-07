import mongoose from 'mongoose';

export const connectMongoDB = async(connectionURL: string) =>{
    return await mongoose.connect(connectionURL);
}

// const mongoose = require('mongoose');
// mongoose.connect('mongodb://127.0.0.1:27017/test');

// const Cat = mongoose.model('Cat', { name: String });

// const kitty = new Cat({ name: 'Zildjian' });
// kitty.save().then(() => console.log('meow'));