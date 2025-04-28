/* eslint-disable */
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import { getToken } from "next-auth/jwt";
import ProposalSchm from "@/models/proposal";
import JobPost from "@/models/jobPost";

// PATCH - Update proposal status (shortlist or reject)
export async function PATCH(req: NextRequest) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        const { proposalId, status } = await req.json();

        if (!proposalId || !status || !['pending', 'shortlisted', 'rejected'].includes(status)) {
            return NextResponse.json(
                { error: "Valid proposal ID and status required" },
                { status: 400 }
            );
        }

        const userId = token.id;

        // Find the proposal
        const proposal = await ProposalSchm.findById(proposalId);

        if (!proposal) {
            return NextResponse.json(
                { error: "Proposal not found" },
                { status: 404 }
            );
        }

        // Get job to verify ownership
        const jobPost = await JobPost.findById(proposal.jobID);
        if (!jobPost) {
            return NextResponse.json(
                { error: "Job not found" },
                { status: 404 }
            );
        }

        // Verify the user is the job owner - uncomment this when your auth is ready
        /* 
        if (jobPost.employerID.toString() !== userId) {
            return NextResponse.json(
                { error: "Unauthorized to update this proposal" },
                { status: 403 }
            );
        }
        */

        // Update proposal status
        proposal.status = status;
        await proposal.save();

        return NextResponse.json(
            { message: "Proposal status updated successfully", proposal },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating proposal status:", error);
        return NextResponse.json(
            { error: "Server Error" },
            { status: 500 }
        );
    }
}