import mongoose from "mongoose";

const MONOGO_URI=process.env.MONOGO_URI!;

if(!MONOGO_URI){
    throw new Error("Please define mongo uri");
}

let cached = global.mongoose;

if(!cached){
    cached = global.mongoose = {conn: null, promise:null};
}

export async function connectToDb(){

    // case: check if connection is already connected:
    if(cached.conn){
        return cached.conn;
    }
    
    // case: if no cached.conn:
    // case: check if no promise:
    if(!cached.promise){
        const options = {
            bufferCommands: true,
            maxPoolSize: 10, 
        }

        // create new promise:
        cached.promise = mongoose
        .connect(MONOGO_URI, options)
        .then(()=> mongoose.connection);
    }

    // case: if promise already exsists:
    try {
        cached.conn = await cached.promise;
    } 
    catch (error) {
        cached.promise = null;
        throw new Error()
    }

    return cached.conn;

    
}

