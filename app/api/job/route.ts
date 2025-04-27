/* eslint-disable */
import connectDB from "@/utils/connectDB";
import { NextResponse } from "next/server";
import JobPostSchema from "@/models/jobPost";

export async function GET(request: Request) {
    try {
        // Connect to database
        await connectDB();

        // Parse the request URL to get the query parameters
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");

        if (id) {
            // Fetch a single job post by ID
            const jobPost = await JobPostSchema.findById(id);

            if (!jobPost) {
                return NextResponse.json(
                    { error: "Job post not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json(
                { message: "Job post fetched successfully", jobPost },
                { status: 200 }
            );
        } else {
            // Fetch all job posts
            const jobPosts = await JobPostSchema.find({}).sort({ createdAt: -1 });

            return NextResponse.json(
                { message: "Job posts fetched successfully", jobPosts },
                { status: 200 }
            );
        }
    } catch (error) {
        console.error("Error fetching job posts:", error);
        return NextResponse.json(
            { error: "Error fetching job posts" },
            { status: 500 }
        );
    }
}