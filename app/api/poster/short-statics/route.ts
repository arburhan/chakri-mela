import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import connectDB from '@/utils/connectDB';
import JobPost from '@/models/jobPost';

export async function GET(request: NextRequest) {
    try {
        const token = await getToken({ req: request as NextRequest, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const posterID = token.id;
        await connectDB();
        // Get all jobs posted by this poster
        const jobs = await JobPost.find({ posterID });
        // Current job post: jobs with status 'active' or 'in-progress'
        const currentJobPost = jobs.filter((job: any) => job.jobStatus === 'active' || job.jobStatus === 'in-progress').length;
        // Total job posts
        const totalJobPosts = jobs.length;
        // Total hires: jobs with at least one proposal with status 'accepted'
        const totalHires = jobs.reduce((acc: number, job: any) => acc + (Array.isArray(job.proposals) ? job.proposals.filter((p: any) => p.proposalStatus === 'accepted').length : 0), 0);
        // Apply rate: (total proposals / total job posts)
        const totalProposals = jobs.reduce((acc: number, job: any) => acc + (Array.isArray(job.proposals) ? job.proposals.length : 0), 0);
        const applyRate = totalJobPosts > 0 ? Math.round((totalProposals / totalJobPosts) * 100) : 0;
        return NextResponse.json({
            currentJobPost,
            totalJobPosts,
            totalHires,
            applyRate
        });
    } catch (error) {
        console.error('Error fetching poster short statics:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
