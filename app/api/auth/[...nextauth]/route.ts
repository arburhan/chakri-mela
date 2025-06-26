/* eslint-disable */
export const runtime = 'nodejs';
import User from "@/models/user";
import connectDB from "@/utils/connectDB";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { Document } from 'mongoose';

// Define the User interface
interface IUser extends Document {
    _id: string;
    name: string;
    email: string;
    password: string;
    role: string;
    matchPassword(enteredPassword: string): Promise<boolean>;
}

const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/auth/login",
        error: "/auth/login",
    },
    debug: process.env.NODE_ENV === "development",
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    if (!credentials?.email || !credentials?.password) {


                        throw new Error("Missing credentials");
                    }

                    // Connect to the database using your connection function
                    const mongoose = await connectDB();
                    console.log("MongoDB connection status:", mongoose.readyState);

                    // Find the user by email and explicitly type it as IUser
                    const user = await User.findOne({
                        email: credentials.email.toLowerCase()
                    }).select('+password') as IUser | null;

                    console.log("User lookup result:", user ? "User found" : "User not found");

                    if (!user) {
                        throw new Error("Invalid email or password");
                    }

                    // Check if the password matches
                    const isMatch = await user.matchPassword(credentials.password);
                    // console.log("Password match:", isMatch);

                    if (!isMatch) {
                        throw new Error("Invalid password");
                    }

                    // Return the user object without sensitive information
                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    };
                } catch (error: any) {
                    console.error("Authentication error:", error);
                    throw error;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name as string;
                session.user.email = token.email as string;
                session.user.role = token.role as string;
            }
            return session;
        },
    },
};

// Extend the built-in session types
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            name: string;
            email: string;
            role: string;
        };
    }

    interface User {
        id: string;
        name: string;
        email: string;
        role: string;
    }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };