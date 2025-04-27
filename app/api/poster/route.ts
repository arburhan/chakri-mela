/* eslint-disable */
import connectDB from "@/utils/connectDB";
import { NextResponse, NextRequest } from "next/server";
import JobPostSchema from "@/models/jobPost";
import { getToken } from "next-auth/jwt";

export async function POST(req: Request) {
    try {
        const request = new NextRequest(req);
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized: Token is missing or invalid" },
                { status: 401 }
            );
        }

        const posterID = token.id;
        await connectDB();

        const body = await request.json();


        const {
            jobTitle,
            jobDescription,
            jobType,
            workingHour,
            salaryRange,
            jobLevel,
            jobCategory,
            skills,
            jobLocation,
        } = body;

        if (!jobTitle || !jobDescription || !jobType || !workingHour || !salaryRange || !jobLevel || !jobCategory || !skills || !jobLocation) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const jobPost = await JobPostSchema.create({
            jobTitle,
            jobDescription,
            jobType,
            workingHour,
            salaryRange,
            jobLevel,
            jobCategory,
            skills,
            status: "active",
            jobLocation,
            posterID,
        });

        console.log(`Job posted: ${jobPost.jobTitle} (${jobPost._id})`);
        return NextResponse.json(
            {
                message: "Job posted successfully",
                jobPost,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error posting job:", error);
        return NextResponse.json(
            { error: "Error creating job post" },
            { status: 500 }
        );
    }
}
