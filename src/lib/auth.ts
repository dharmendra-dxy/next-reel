import { NextAuthOptions } from "next-auth";
import CredentialsProvider  from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { connectToDb } from "./db";
import User from "@/models/user.model";


export const authOptions: NextAuthOptions= {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: {label: "Email", type: 'text'},
                password: {label: "Password", type: 'text'},
            },
            async authorize(credentials){
                if(!credentials?.email || !credentials?.password){
                    throw new Error("Email and Password in required");
                }

                try {
                    // connectDB:
                    await connectToDb();    

                    const user = await User.findOne({email: credentials.email});
                    if(!user){
                        throw new Error("No user found");
                    }

                    // check password:
                    const isValidPass= await bcrypt.compare(credentials.password, user.password);
                    if(!isValidPass){
                        throw new Error("Invalid password");
                    }

                    return{
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                    }

                } 
                catch (error) {
                    throw new Error("Error in auth");
                }
            }
        }),
    ],

    callbacks: {
        async jwt({token, user}){
            if(user){
                token.id = user.id;
            }
            return token;
        },

        async session({session, token}) {

            if(session.user){
                session.user.id = token.id as string;

            }

            return session;
        },
    },

    pages: {
        signIn: '/login',
        error: '/login',
    },

    session: {
        strategy: "jwt",
        maxAge: 30*24*60*60;
    },

    secret: process.env.NEXTAUTH_SECRET
}