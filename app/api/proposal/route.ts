/* eslint-disable */
import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/utils/connectDB";
import { getToken } from "next-auth/jwt";
import ProposalSchm from "@/models/proposal";
import JobPost from "@/models/jobPost"; // Import JobPost model to check salary range

// POST - Create a new proposal
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

        const seekerID = token.id; // User ID from JWT token

        // Check if user already has a proposal for this job
        const existingProposal = await ProposalSchm.findOne({
            jobID,
            seekerID
        });

        if (existingProposal) {
            return NextResponse.json(
                { error: "You have already submitted a proposal for this job" },
                { status: 400 }
            );
        }

        // Get job details to validate bid amount
        const jobPost = await JobPost.findById(jobID);
        if (!jobPost) {
            return NextResponse.json(
                { error: "Job not found" },
                { status: 404 }
            );
        }

        // Convert bid amount to number for comparison
        const bidAmountNum = Number(bidAmount);

        // Validate bid is within salary range
        if (bidAmountNum < jobPost.salaryRange.startRange || bidAmountNum > jobPost.salaryRange.endRange) {
            return NextResponse.json(
                {
                    error: `Bid amount must be between ${jobPost.salaryRange.startRange} and ${jobPost.salaryRange.endRange}`
                },
                { status: 400 }
            );
        }

        const newProposal = await ProposalSchm.create({
            coverLetter,
            bidAmount: bidAmountNum,
            jobID,
            seekerID,
        });

        return NextResponse.json(
            { message: "Proposal submitted successfully", proposal: newProposal },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error submitting proposal:", error);
        return NextResponse.json(
            { error: "Server Error" },
            { status: 500 }
        );
    }
}

// GET - Check if user has already applied and get the proposal
// GET - Get all proposals for a specific job
export async function GET(req: NextRequest) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        const url = new URL(req.url);
        const jobID = url.searchParams.get("jobID");
        const checkApplied = url.searchParams.get("checkApplied");

        if (!jobID) {
            return NextResponse.json(
                { error: "Job ID is required" },
                { status: 400 }
            );
        }

        const seekerID = token.id;

        // If only checking if user has applied
        if (checkApplied === "true") {
            // Find existing proposal
            const existingProposal = await ProposalSchm.findOne({
                jobID,
                seekerID
            });

            if (!existingProposal) {
                return NextResponse.json(
                    { hasApplied: false },
                    { status: 200 }
                );
            }

            return NextResponse.json(
                {
                    hasApplied: true,
                    proposal: existingProposal
                },
                { status: 200 }
            );
        }

        // Check if the user is the job owner
        const jobPost = await JobPost.findById(jobID);
        if (!jobPost) {
            return NextResponse.json(
                { error: "Job not found" },
                { status: 404 }
            );
        }

        // Verify ownership - ensure this user is the job creator
        /*    if (jobPost.employerID.toString() !== seekerID) {
               return NextResponse.json(
                   { error: "Unauthorized to view these proposals" },
                   { status: 403 }
               );
           } */

        // Get all proposals for this job
        const proposals = await ProposalSchm.find({ jobID })
            .populate({
                path: 'seekerID',
                select: 'name profilePicture' // Only select necessary fields
            });

        return NextResponse.json(
            { proposals },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching proposals:", error);
        return NextResponse.json(
            { error: "Server Error" },
            { status: 500 }
        );
    }
}



// PUT - Update existing proposal
export async function PUT(req: NextRequest) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        const { proposalId, coverLetter, bidAmount } = await req.json();

        if (!proposalId || !coverLetter || !bidAmount) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        const seekerID = token.id;

        // Find the proposal
        const proposal = await ProposalSchm.findById(proposalId);

        if (!proposal) {
            return NextResponse.json(
                { error: "Proposal not found" },
                { status: 404 }
            );
        }

        // Verify ownership
        if (proposal.seekerID.toString() !== seekerID) {
            return NextResponse.json(
                { error: "Unauthorized to edit this proposal" },
                { status: 403 }
            );
        }

        // Get job details to validate bid amount
        const jobPost = await JobPost.findById(proposal.jobID);
        if (!jobPost) {
            return NextResponse.json(
                { error: "Job not found" },
                { status: 404 }
            );
        }

        // Convert bid amount to number for comparison
        const bidAmountNum = Number(bidAmount);

        // Validate bid is within salary range
        if (bidAmountNum < jobPost.salaryRange.startRange || bidAmountNum > jobPost.salaryRange.endRange) {
            return NextResponse.json(
                {
                    error: `Bid amount must be between ${jobPost.salaryRange.startRange} and ${jobPost.salaryRange.endRange}`
                },
                { status: 400 }
            );
        }

        // Update proposal
        proposal.coverLetter = coverLetter;
        proposal.bidAmount = bidAmountNum;
        await proposal.save();

        return NextResponse.json(
            { message: "Proposal updated successfully", proposal },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating proposal:", error);
        return NextResponse.json(
            { error: "Server Error" },
            { status: 500 }
        );
    }
}

// DELETE - Withdraw a proposal
export async function DELETE(req: NextRequest) {
    try {
        const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

        if (!token) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        await connectDB();

        const url = new URL(req.url);
        const proposalId = url.searchParams.get("proposalId");

        if (!proposalId) {
            return NextResponse.json(
                { error: "Proposal ID is required" },
                { status: 400 }
            );
        }

        const seekerID = token.id;

        // Find the proposal
        const proposal = await ProposalSchm.findById(proposalId);

        if (!proposal) {
            return NextResponse.json(
                { error: "Proposal not found" },
                { status: 404 }
            );
        }

        // Verify ownership
        if (proposal.seekerID.toString() !== seekerID) {
            return NextResponse.json(
                { error: "Unauthorized to withdraw this proposal" },
                { status: 403 }
            );
        }

        // Delete the proposal
        await ProposalSchm.findByIdAndDelete(proposalId);

        return NextResponse.json(
            { message: "Proposal withdrawn successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error withdrawing proposal:", error);
        return NextResponse.json(
            { error: "Server Error" },
            { status: 500 }
        );
    }
}