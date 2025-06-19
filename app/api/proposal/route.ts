/* eslint-disable */
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import { getToken } from "next-auth/jwt";

import JobPost from "@/models/jobPost";

export async function POST(req: NextRequest) {
    await connectDB();

    const token = await getToken({ req });
    if (!token) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jobID } = await req.json();

    // Prevent proposals for completed or expired jobs
    const job = await JobPost.findById(jobID);
    if (!job) {
        return NextResponse.json({ error: "Job not found." }, { status: 404 });
    }
    if (job.jobStatus === "completed" || job.jobStatus === "expired") {
        return NextResponse.json({ error: "Cannot send proposals to this job." }, { status: 400 });
    }

    // Additional logic for handling proposals
}



