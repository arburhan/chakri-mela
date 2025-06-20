/* eslint-disable */
export const runtime = 'nodejs';
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import User from "@/models/user";

export async function POST(request: NextRequest) {
    try {
        // Connect to the database
        await connectDB();

        // Parse request body
        const body = await request.json();
        //  console.log("Registration request:", { ...body, password: "REDACTED" });

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

        //  console.log(`User registered: ${user.email} (${user._id})`);

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

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");

        if (email) {
            const singleUser = await User.findOne({ email }, { password: 0 });
            if (singleUser) {
                return NextResponse.json(
                    {
                        message: "User fetched successfully",
                        user: singleUser,
                    },
                    { status: 200 }
                );
            } else {
                return NextResponse.json(
                    { message: "User not found" },
                    { status: 404 }
                );
            }
        } else {
            const users = await User.find({}, { password: 0 });
            if (!users || users.length === 0) {
                return NextResponse.json(
                    { message: "No users found" },
                    { status: 404 }
                );
            }
            // Return the list of users
            return NextResponse.json(
                {
                    message: "Users fetched successfully",
                    users,
                },
                { status: 200 }
            );
        }
    } catch (error: any) {
        console.error("Error fetching users:", error);
        return NextResponse.json(
            { message: error.message || "Failed to fetch users" },
            { status: 500 }
        );
    }
}


export async function PUT(request: NextRequest) {
    try {
        // Connect to the database
        await connectDB();

        // Get email from URL search params
        const url = new URL(request.url);
        const email = url.searchParams.get('email');

        if (!email) {
            return NextResponse.json(
                { message: 'Email is required' },
                { status: 400 }
            );
        }

        // Get data from request body
        const userData = await request.json();


        // Find user by email and update
        const updatedUser = await User.findOneAndUpdate(
            { email },
            {
                $set: {
                    name: userData.name,
                    gender: userData.gender,
                    mobileNumber: userData.mobileNumber,
                    currentLocation: userData.currentLocation,
                    dateOfBirth: userData.dateOfBirth,
                    nidNumber: userData.nidNumber,
                    categories: userData.categories,
                    skills: userData.skills
                }
            },
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            return NextResponse.json(
                { message: 'User not found' },
                { status: 404 }
            );
        }

        // Return the updated user
        return NextResponse.json(updatedUser, { status: 200 });

    } catch (error: any) {
        console.error('Error updating user profile:', error);
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}
