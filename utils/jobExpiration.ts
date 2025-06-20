/* eslint-disable */
import JobPost from '@/models/jobPost';
import connectDB from "@/utils/connectDB";

// Expire jobs based on conditions
export async function expireJobs() {
    await connectDB();

    const now = new Date();

    // Expire urgent jobs not hired within 1 day
    await JobPost.updateMany(
        {
            status: "active",
            isUrgent: true,
            createdAt: { $lte: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
            hiredAt: null,
        },
        { $set: { status: "expired" } }
    );

    // Expire normal jobs not hired within 3 days
    await JobPost.updateMany(
        {
            status: "active",
            isUrgent: false,
            createdAt: { $lte: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000) },
            hiredAt: null,
        },
        { $set: { status: "expired" } }
    );
}
