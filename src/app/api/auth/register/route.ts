import { NextRequest, NextResponse } from "next/server";
import { connectToDb } from "@/lib/db";
import User from "@/models/user.model";

export async function POST(request:NextRequest){
    try{
        const {name,email, password} = await request.json();

        if(!name ||!email || !password){
            return NextResponse.json(
                {error: "Details are required"},
                {status: 400}
            );
        }

        // conectDB:
        await connectToDb();

        // check for already registered email:
        const exisitingUser =  await User.findOne({email});
        if(exisitingUser){
            return NextResponse.json(
                {error: "Email is already registered"},
                {status: 400}
            );
        }

        // create a user:
        const user = User.create({
            name,
            email,
            password,
        });

        return NextResponse.json(
            {message: "User registered succesfully"},
            {status: 201}
        );

    }
    catch(error){
        return NextResponse.json(
            {error: "Failed to register"},
            {status: 400}
        );
    }
}


