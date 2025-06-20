// app/api/cron/enforce-reviews/route.ts
import { NextResponse } from 'next/server';
import { enforceReviews } from '@/utils/reviewEnforcer';

export async function GET() {
    try {
        await enforceReviews();
        return NextResponse.json({ message: 'Review enforcement completed.' });
    } catch (error) {
        console.error('Error enforcing reviews:', error);
        return NextResponse.json({ message: 'Failed to enforce reviews.' }, { status: 500 });
    }
}
