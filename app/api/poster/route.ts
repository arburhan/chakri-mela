/* eslint-disable */
import connectDB from "@/utils/connectDB";
import { NextResponse } from "next/server";
import JobPostSchema from "@/models/jobPost";

export async function POST(request: Request) {
    try {
        // Connect to database
        await connectDB();

        // Get the request body
        const body = await request.json();

        // Destructure the data
        const {
            jobTitle,
            jobDescription,
            jobType,
            workingHour,
            salaryRange,
            jobLevel,
            skills
        } = body;

        // Validate required fields
        if (!jobTitle || !jobDescription || !jobType || !workingHour || !salaryRange || !jobLevel || !skills) {
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
            skills
        });
        console.log(`Job posted: ${jobPost.jobTitle} (${jobPost._id})`);
        return NextResponse.json(
            {
                message: "Job posted successfully",
                jobPost: {
                    jobTitle,
                    jobDescription,
                    jobType,
                    workingHour,
                    salaryRange,
                    jobLevel,
                    skills
                }
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

export async function GET(request: Request) {
    try {
        // Connect to database
        await connectDB();

        // Fetch all job posts
        const jobPosts = await JobPostSchema.find({}).sort({ createdAt: -1 });

        return NextResponse.json(
            { message: "Job posts fetched successfully", jobPosts },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching job posts:", error);
        return NextResponse.json(
            { error: "Error fetching job posts" },
            { status: 500 }
        );
    }
}