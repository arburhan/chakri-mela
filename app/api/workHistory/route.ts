/* eslint-disable */
export const runtime = 'nodejs';
import connectDB from "@/utils/connectDB";
import { NextResponse, NextRequest } from "next/server";
import WorkHistorySchema from "@/models/workHistory";
import { getToken } from "next-auth/jwt";



export async function GET(request: NextRequest) {
    try {
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized: Token is missing or invalid" },
                { status: 401 }
            );
        }

        const userID = token.id;
        await connectDB();

        const workHistory = await WorkHistorySchema.find({ userID }).populate("jobID");

        if (!workHistory) {
            return NextResponse.json(
                { error: "No work history found" },
                { status: 404 }
            );
        }

        return NextResponse.json(workHistory, { status: 200 });
    }
    catch (error) {
        console.error("Error fetching work history:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}