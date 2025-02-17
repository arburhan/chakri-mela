// app/api/users/route.ts

import { NextRequest, NextResponse } from "next/server";
import { hash } from 'bcryptjs';
import User from "@/models/user";
import connectDB from "@/utils/connectDB";

// Interface for the request body
interface CreateUserRequest {
    name: string;
    email: string;
    password: string;
}

export async function GET(): Promise<NextResponse> {
    try {
        await connectDB();
        const users = await User.find().select('-password');

        return NextResponse.json({ users });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to fetch users" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const { name, email, password }: CreateUserRequest = await request.json();

        // Validate input
        if (!name || !email || !password) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        await connectDB();

        // Check for existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 422 }
            );
        }

        // Hash password and create user
        const hashedPassword = await hash(password, 12);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = newUser.toObject();

        return NextResponse.json(
            {
                message: "User registered successfully",
                user: userWithoutPassword
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Registration error:', error);

        return NextResponse.json(
            { message: "Error creating user" },
            { status: 500 }
        );
    }
}