/* eslint-disable */
import mongoose from "mongoose";
import connectDB from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";
import JobPostSchema, { IProposal } from "@/models/jobPost";

import IWorkHistory from "@/models/workHistory";


export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { jobID: jobId, jobStatus, rating, comment } = body;
        console.log("jobId:", jobId);


        await connectDB();

        const jobPost = await JobPostSchema.findById(jobId);
        if (!jobPost) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        jobPost.jobStatus = jobStatus;
        await jobPost.save();

        // Create work history entry
        const workHistoryEntry = await IWorkHistory.create({
            jobID: jobPost._id,
            review:
            {
                status: true,
                rating: rating || 4,
                comment: comment || "no comment provided"
            }
        });

        await workHistoryEntry.save();

        return NextResponse.json({ message: "Job completed successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error completing job:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

}