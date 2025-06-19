/* eslint-disable */
import connectDB from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import JobPost from "@/models/jobPost";
import { getToken } from "next-auth/jwt";

export async function GET(request: NextRequest) {
    try {
        const token = await getToken({ req: request as NextRequest, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const seekerID = token.id;

        await connectDB();

        // Get the user and populate workHistory with job post details
        const user = await User.findById(seekerID)
            .populate({
                path: "workHistory",
                model: JobPost
            })
            .exec();

        if (!user) {
            return NextResponse.json({ error: "No work history found" }, { status: 404 });
        }

        return NextResponse.json({ workHistory: user.workHistory }, { status: 200 });

    } catch (error) {
        console.error("Error fetching work history:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}