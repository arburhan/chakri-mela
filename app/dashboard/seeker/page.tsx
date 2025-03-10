/* eslint-disable */
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Seeker Dashboard | Your App Name',
    description: 'Seeker dashboard description here',
};

export default async function SeekerDashboardPage() {
    const session = await getServerSession();

    // The middleware already handles role-based routing, so we just need to make sure
    // there is a session. If not, the middleware should have redirected already,
    // but this is an extra safety check
    if (!session) {
        redirect('/auth/login');
    }

    return (
        <div className="min-h-screen bg-gray-100 py-10">
            <div className="py-10">
                <header>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold leading-tight text-gray-900">
                            Welcome back, {session.user.name} (Seeker)!
                        </h1>
                    </div>
                </header>
                <main>
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        {/* Seeker Dashboard Content */}
                        <div className="px-4 py-8 sm:px-0">
                            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
                                {/* Your seeker dashboard content goes here */}
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <h2 className="text-xl font-semibold text-gray-700">
                                            Seeker Dashboard Content
                                        </h2>
                                        <p className="mt-2 text-gray-500">
                                            Add your seeker dashboard components here
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}