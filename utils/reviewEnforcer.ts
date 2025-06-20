/* eslint-disable */
import JobPost, { IJobPost } from '@/models/jobPost';
import IProposal from '@/models/jobPost';
import User from '@/models/user';
import connectDB from "@/utils/connectDB";


// Enforce review requirements
export async function enforceReviews() {
    await connectDB();

    const now = new Date();

    // Find jobs where working hours have passed and reviews are not provided
    const overdueJobs = await JobPost.find({
        isReviewed: false,
        createdAt: { $lte: new Date(now.getTime() - 60 * 60 * 1000) }, // 1 hour ago
    });

    for (const job of overdueJobs as IJobPost[]) {
        // Restrict job poster and seeker from further actions
        await User.updateOne({ _id: job.posterID }, { $set: { canPost: false } });
        const proposal = await IProposal.findOne({ jobID: job._id });
        if (proposal) {
            await User.updateOne({ _id: proposal.seekerID }, { $set: { canApply: false } });
        }

        // Mark job as completed if reviews are provided
        await JobPost.updateOne({ _id: job._id }, { $set: { status: "completed", isReviewed: true } });
    }
}
