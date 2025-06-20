// utils/expirejobs.ts
/* eslint-disable */
import JobPost from '@/models/jobPost';
import connectDB from "@/utils/connectDB";

export async function expireJobs() {
    await connectDB();

    const now = new Date();

    await JobPost.updateMany(
        {
            status: "active",
            isUrgent: true,
            createdAt: { $lte: new Date(now.getTime() - 24 * 60 * 60 * 1000) },
            hiredAt: null,
        },
        { $set: { status: "expired" } }
    );

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
