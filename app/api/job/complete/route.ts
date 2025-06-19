/* eslint-disable */
import mongoose from "mongoose";
import connectDB from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";
import JobPostSchema, { IProposal } from "@/models/jobPost";
import IUser from "@/models/user";

import IWorkHistory from "@/models/workHistory";


export async function PATCH(request: Request) {
    try {
        const body = await request.json();
        const { jobId, seekerID, jobStatus, rating, comment } = body;


        await connectDB();

        const jobPost = await JobPostSchema.findById(jobId);
        if (!jobPost) {
            return NextResponse.json({ error: "Job not found" }, { status: 404 });
        }

        jobPost.jobStatus = jobStatus;
        await jobPost.save();

        const jobSeeker = await IUser.findById(seekerID);
        if (!jobSeeker) {
            return NextResponse.json({ error: "Job seeker not found" }, { status: 404 });
        }
        // Use push() if workHistory is an array and you want to add a new job ID
        jobSeeker.workHistory.push(jobPost._id);
        await jobSeeker.save();

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