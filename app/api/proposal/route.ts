/* eslint-disable */
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import { getToken } from "next-auth/jwt";
import ProposalSchm from "@/models/proposal";


export async function POST(req: NextRequest) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        const { coverLetter, bidAmount, jobID } = await req.json();

        if (!coverLetter || !bidAmount || !jobID) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        const seekerID = token.id; // ✅ User ID from JWT token

        const newApply = await ProposalSchm.create({
            coverLetter,
            bidAmount,
            jobID,
            seekerID,
        });

        return NextResponse.json(
            { message: "Application submitted successfully", apply: newApply },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error submitting application:", error);
        return NextResponse.json(
            { error: "Server Error" },
            { status: 500 }
        );
    }
}
