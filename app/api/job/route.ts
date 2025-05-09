/* eslint-disable */
import mongoose from "mongoose";
import connectDB from "@/utils/connectDB";
import { NextRequest, NextResponse } from "next/server";
import JobPostSchema from "@/models/jobPost";
import userSchema from "@/models/user";
import IWorkHistory from "@/models/workHistory";
import IJobPost from "@/models/jobPost";
import { getToken } from "next-auth/jwt";



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

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const token = await getToken({ req: request as NextRequest, secret: process.env.NEXTAUTH_SECRET });

        if (!token) {
            return NextResponse.json({ error: 'Authentication token is missing.' }, { status: 401 });
        }

        const seekerID: string = token.id as string;
        let { jobID, bidAmount, coverLetter } = await request.json();

        // Convert bidAmount to number if it's a string
        if (typeof bidAmount === 'string') {
            bidAmount = parseFloat(bidAmount);
        }

        console.log(seekerID, jobID, bidAmount, coverLetter);

        if (!jobID || bidAmount === undefined || isNaN(bidAmount) || !coverLetter) {
            return NextResponse.json({ error: 'Please provide all required fields.' }, { status: 400 });
        }

        if (typeof bidAmount !== 'number' || typeof coverLetter !== 'string') {
            return NextResponse.json({
                error: `Invalid data types provided. bidAmount type: ${typeof bidAmount}, coverLetter type: ${typeof coverLetter}`
            }, { status: 400 });
        }

        const job = await IJobPost.findById(jobID);
        if (!job) {
            return NextResponse.json({ error: 'Job not found.' }, { status: 404 });
        }

        // Check if user has already submitted a proposal
        const existingProposal = job.proposals.find(
            proposal => proposal.seekerID.toString() === seekerID.toString()
        );

        if (existingProposal) {
            return NextResponse.json(
                { error: 'You have already submitted a proposal for this job.' },
                { status: 409 }
            );
        }

        // Add the new proposal
        const updatedJob = await IJobPost.findByIdAndUpdate(
            jobID,
            {
                $push: {
                    proposals: {
                        coverLetter,
                        bidAmount,
                        jobID,
                        seekerID,
                        status: 'pending',
                    }
                }
            },
            { new: true } // Return the updated document
        );

        if (!updatedJob) {
            return NextResponse.json({ error: 'Failed to add proposal.' }, { status: 500 });
        }

        return NextResponse.json({
            message: 'Proposal added successfully.',
            proposal: updatedJob.proposals[updatedJob.proposals.length - 1]
        }, { status: 201 }); // Status 201 Created for successful resource creation

    } catch (error) {
        console.error('Detailed error:', error);
        return NextResponse.json({
            error: (error instanceof Error ? error.message : 'Server error.')
        }, { status: 500 });
    }
}

export async function PUT(request: NextRequest) {
    try {
        await connectDB();
        const token = await getToken({ req: request as NextRequest, secret: process.env.NEXTAUTH_SECRET });

        if (!token) {
            return NextResponse.json({ error: 'Authentication token is missing.' }, { status: 401 });
        }

        const seekerID: string = token.id as string;
        let { jobID, proposalId, bidAmount, coverLetter } = await request.json();

        // Convert bidAmount to number if it's a string
        if (typeof bidAmount === 'string') {
            bidAmount = parseFloat(bidAmount);
        }

        console.log(seekerID, jobID, proposalId, bidAmount, coverLetter);

        if (!jobID || !proposalId || (bidAmount === undefined && !coverLetter)) {
            return NextResponse.json({
                error: 'Please provide jobID, proposalId, and at least bidAmount or coverLetter.'
            }, { status: 400 });
        }

        // Validate bidAmount if provided
        if (bidAmount !== undefined) {
            if (isNaN(bidAmount)) {
                return NextResponse.json({ error: 'Bid amount must be a valid number.' }, { status: 400 });
            }
        }

        // Create update object with only the fields that need to be updated
        const updateFields: Record<string, any> = {};

        if (bidAmount !== undefined) {
            updateFields['proposals.$.bidAmount'] = bidAmount;
        }

        if (coverLetter !== undefined) {
            updateFields['proposals.$.coverLetter'] = coverLetter;
        }

        // Find and update the proposal
        const updatedJob = await IJobPost.findOneAndUpdate(
            {
                _id: jobID,
                'proposals._id': proposalId,
                'proposals.seekerID': seekerID // Ensure the user owns this proposal
            },
            {
                $set: updateFields
            },
            {
                new: true, // Return updated document
                runValidators: true // Run schema validators
            }
        );

        if (!updatedJob) {
            return NextResponse.json({
                error: 'Proposal not found or you do not have permission to update it.'
            }, { status: 404 });
        }

        // Find the updated proposal in the array
        const updatedProposal = updatedJob.proposals.find(
            proposal => proposal._id.toString() === proposalId
        );

        return NextResponse.json({
            message: 'Proposal updated successfully.',
            proposal: updatedProposal
        }, { status: 200 });

    } catch (error) {
        console.error('Detailed error:', error);
        return NextResponse.json({
            error: (error instanceof Error ? error.message : 'Server error.')
        }, { status: 500 });
    }
}

// Add DELETE endpoint to remove a proposal
export async function DELETE(request: Request) {
    try {
        // Connect to database
        await connectDB();

        // Get authentication token
        const token = await getToken({ req: request as NextRequest, secret: process.env.NEXTAUTH_SECRET });

        if (!token) {
            return NextResponse.json({ error: 'Authentication token is missing.' }, { status: 401 });
        }

        // Get seeker ID from token
        const seekerID: string = token.id as string;

        // Parse the URL to get query parameters
        const { searchParams } = new URL(request.url);
        const jobID = searchParams.get("jobID");
        const proposalId = searchParams.get("proposalId");

        // Validate required parameters
        if (!seekerID || !mongoose.Types.ObjectId.isValid(seekerID)) {
            return NextResponse.json(
                { error: "Valid seeker ID is required" },
                { status: 400 }
            );
        }

        if (!jobID || !mongoose.Types.ObjectId.isValid(jobID)) {
            return NextResponse.json(
                { error: "Valid job ID is required" },
                { status: 400 }
            );
        }

        if (!proposalId || !mongoose.Types.ObjectId.isValid(proposalId)) {
            return NextResponse.json(
                { error: "Valid proposal ID is required" },
                { status: 400 }
            );
        }

        // Remove the proposal from the job post
        const updatedJobPost = await IJobPost.findOneAndUpdate(
            {
                _id: jobID,
                'proposals._id': proposalId,
                'proposals.seekerID': seekerID // Ensure the user owns this proposal
            },
            {
                $pull: {
                    proposals: {
                        _id: new mongoose.Types.ObjectId(proposalId)
                    }
                }
            },
            { new: true }
        );

        if (!updatedJobPost) {
            return NextResponse.json(
                { error: "Job post not found or proposal could not be removed" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                message: "Proposal withdrawn successfully",
                jobPost: updatedJobPost
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error removing proposal:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Error removing proposal" },
            { status: 500 }
        );
    }
}

// Add a PATCH endpoint to update proposal status
export async function PATCH(request: Request) {
    try {
        // Connect to database
        await connectDB();

        // Parse the request body
        const body = await request.json();
        const { jobID, proposalId, status } = body;

        // Validate required fields
        if (!jobID || !mongoose.Types.ObjectId.isValid(jobID)) {
            return NextResponse.json(
                { error: "Valid job ID is required" },
                { status: 400 }
            );
        }


        if (!proposalId || !mongoose.Types.ObjectId.isValid(proposalId)) {
            return NextResponse.json(
                { error: "Valid proposal ID is required" },
                { status: 400 }
            );
        }

        if (!status || !['pending', 'accepted', 'rejected'].includes(status)) {
            return NextResponse.json(
                { error: "Valid status is required (pending, accepted, or rejected)" },
                { status: 400 }
            );
        }

        // Find the job post first to make sure it exists
        const jobPost = await JobPostSchema.findById(jobID);


        if (!jobPost) {
            return NextResponse.json(
                { error: "Job post not found" },
                { status: 404 }
            );
        }

        // Find the proposal in the job post
        const proposalIndex = jobPost.proposals.findIndex(
            proposal => proposal._id.toString() === proposalId
        );

        if (proposalIndex === -1) {
            return NextResponse.json(
                { error: "Proposal not found in the job post" },
                { status: 404 }
            );
        }

        // Update the specific proposal's status
        jobPost.proposals[proposalIndex].status = status;

        // If status is accepted, reject all other proposals
        if (status === 'accepted') {
            jobPost.proposals.forEach((proposal, index) => {
                if (index !== proposalIndex) {
                    proposal.status = 'rejected';
                }
            });

            const addToWorkHistory = await IWorkHistory.create({
                jobID: jobPost._id,
                review:
                {
                    rating: 0,
                    comment: "No review yet"
                }

            });
            console.log("Work history created:", addToWorkHistory);

        }

        // Save the updated job post
        await jobPost.save();

        return NextResponse.json(
            {
                message: "Proposal status updated successfully",
                proposal: jobPost.proposals[proposalIndex],
                jobPost: jobPost
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating proposal status:", error);
        return NextResponse.json(
            { error: "Error updating proposal status" },
            { status: 500 }
        );
    }
}
