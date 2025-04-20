/* eslint-disable */
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import User from "@/models/user";

export async function POST(request: NextRequest) {
    try {
        // Connect to the database
        await connectDB();

        // Parse request body
        const body = await request.json();
        console.log("Registration request:", { ...body, password: "REDACTED" });

        const { name, email, password, role } = body;

        // Validate input
        if (!name || !email || !password || !role) {
            return NextResponse.json(
                { message: "Please provide all required fields" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }

        // Create a new user (password will be hashed by pre-save middleware)
        const user = await User.create({
            name,
            email,
            password,
            role: role
        });

        console.log(`User registered: ${user.email} (${user._id})`);

        // Return success response (excluding password)
        return NextResponse.json(
            {
                message: "User registered successfully",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            },
            { status: 201 }
        );

    } catch (error: any) {
        console.error("Registration error:", error);
        return NextResponse.json(
            { message: error.message || "User registration failed" },
            { status: 500 }
        );
    }
}


export async function GET() {
    try {
        // Connect to the database
        await connectDB();

        // Fetch all users
        const users = await User.find({}, { password: 0 }); // Exclude passwords from the result

        // Return the list of users
        return NextResponse.json(
            {
                message: "Users fetched successfully",
                users,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { message: error.message || "Failed to fetch users" },
            { status: 500 }
        );
    }
}