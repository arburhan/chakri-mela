import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDB from '@/utils/connectDB';
import User from '@/models/user';
import JobPost from '@/models/jobPost';

export async function GET(request: NextRequest) {
    try {
        const token = await getToken({ req: request as NextRequest, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const seekerID = token.id;
        await connectDB();
        const user = await User.findById(seekerID).populate({ path: 'appliedJobs', model: JobPost }).exec();
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        // Current applied: jobs in appliedJobs with status 'active' or 'in-progress'
        const currentApplied = user.appliedJobs.filter((job: any) => job.jobStatus === 'active' || job.jobStatus === 'in-progress').length;
        // Total applied: all jobs in appliedJobs
        const totalApplied = user.appliedJobs.length;
        // Total hires: jobs in appliedJobs with at least one proposal with status 'accepted' and seekerID matches
        const totalHires = user.appliedJobs.filter((job: any) => Array.isArray(job.proposals) && job.proposals.some((p: any) => p.seekerID?.toString() === seekerID && p.proposalStatus === 'accepted')).length;
        // Success rate: (totalHires / totalApplied) * 100
        const successRate = totalApplied > 0 ? Math.round((totalHires / totalApplied) * 100) : 0;
        return NextResponse.json({
            currentApplied,
            totalApplied,
            totalHires,
            successRate
        });
    } catch (error) {
        console.error('Error fetching seeker short statics:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
