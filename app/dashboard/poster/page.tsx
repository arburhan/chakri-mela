/* eslint-disable */
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Poster Dashboard | Your App Name',
    description: 'Poster dashboard description here',
};

export default async function PosterDashboardPage() {
    const session = await getServerSession();

    if (!session) {
        redirect('/auth/login');
    }

    return (

        <div className="min-h-screen bg-gray-100">
            <div className="py-10">
                <header>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold leading-tight text-gray-900 py-10">
                            Welcome back, {session.user.name} (Poster)!
                        </h1>
                    </div>
                </header>
                <main>
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        {/* Poster Dashboard Content */}
                        <div className="px-4 py-8 sm:px-0">
                            <div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
                                {/* Your poster dashboard content goes here */}
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <h2 className="text-xl font-semibold text-gray-700">
                                            Poster Dashboard Content
                                        </h2>
                                        <p className="mt-2 text-gray-500">
                                            Add your poster dashboard components here
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