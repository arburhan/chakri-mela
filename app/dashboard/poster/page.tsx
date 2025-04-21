/* eslint-disable */
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { Metadata } from 'next';
import ShortStatics from './shortStatics';

export const metadata: Metadata = {
    title: 'job poster Dashboard | Your App Name',
    description: 'job poster dashboard description here',
};

export default async function DashboardPage() {
    const session = await getServerSession();

    // The middleware already handles role-based routing, so we just need to make sure
    // there is a session. If not, the middleware should have redirected already,
    // but this is an extra safety check
    if (!session) {
        redirect('/auth/login');
    }

    return (
        <div className=" bg-gray-100 py-5">
            <div className="py-10">
                <header>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold leading-tight text-gray-900">
                            Welcome back, {session.user.name} (job poster)!
                        </h1>
                    </div>
                </header>
                <main>
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        {/* job poster Dashboard Content */}
                        <div className="px-4 py-8 sm:px-0">
                            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
                                {/* Your job poster dashboard content goes here */}
                                <div className="flex items-center justify-center h-full">
                                    <ShortStatics />
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}