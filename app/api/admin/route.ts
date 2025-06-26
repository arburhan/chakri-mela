import { NextResponse } from "next/server";

import User from "@/models/user";
import JobPost from "@/models/jobPost";
import connectDB from "@/utils/connectDB";

export async function GET() {
    try {
        await connectDB();

        // Get total counts using MongoDB aggregation
        const totalUsers = await User.countDocuments();
        const totalSeekers = await User.countDocuments({ role: "seeker" });
        const totalPosters = await User.countDocuments({ role: "poster" });
        const totalJobs = await JobPost.countDocuments();

        return NextResponse.json({
            success: true,
            data: {
                totalUsers,
                totalSeekers,
                totalPosters,
                totalJobs,
            },
        });
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch admin statistics" },
            { status: 500 }
        );
    }
}