// utils/review.ts
/* eslint-disable */
import JobPost, { IJobPost } from '@/models/jobPost';
import IProposal from '@/models/jobPost';
import User from '@/models/user';
import connectDB from "@/utils/connectDB";

export async function enforceReviews() {
    await connectDB();

    const now = new Date();

    const overdueJobs = await JobPost.find({
        isReviewed: false,
        createdAt: { $lte: new Date(now.getTime() - 60 * 60 * 1000) }, // 1 hour ago
    });

    for (const job of overdueJobs as IJobPost[]) {
        await User.updateOne({ _id: job.posterID }, { $set: { canPost: false } });

        const proposal = await IProposal.findOne({ jobID: job._id });
        if (proposal) {
            await User.updateOne({ _id: proposal.seekerID }, { $set: { canApply: false } });
        }

        await JobPost.updateOne({ _id: job._id }, { $set: { status: "completed", isReviewed: true } });
    }
}
