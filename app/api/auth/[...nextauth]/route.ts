// app/api/auth/[...nextauth]/route.ts

import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/user";
import connectDB from "@/utils/connectDB";

interface Credentials {
    email: string;
    password: string;
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {},
            async authorize(credentials): Promise<any> {
                const { email, password } = credentials as Credentials;

                try {
                    await connectDB();

                    const user = await User.findOne({ email });

                    if (!user) {
                        throw new Error("No user found with this email");
                    }

                    const passwordsMatch = await bcrypt.compare(password, user.password);

                    if (!passwordsMatch) {
                        throw new Error("Incorrect password");
                    }

                    return {
                        id: user.id.toString(),
                        name: user.name,
                        email: user.email,
                    };
                } catch (error) {
                    if (error instanceof Error) {
                        console.error("Authentication error:", error.message);
                        throw new Error(error.message);
                    }
                    console.error("Unexpected error during authentication:", error);
                    throw new Error("An unexpected error occurred");
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id;
            }
            return session;
        },
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/auth/login",
    },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };