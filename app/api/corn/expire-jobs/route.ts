// app/api/cron/expire-jobs/route.ts
import { NextResponse } from 'next/server';
import { expireJobs } from '@/utils/jobExpiration';

export async function GET() {
    try {
        await expireJobs();
        return NextResponse.json({ message: 'Job expiration check completed.' });
    } catch (error) {
        console.error('Error expiring jobs:', error);
        return NextResponse.json({ message: 'Failed to expire jobs.' }, { status: 500 });
    }
}
