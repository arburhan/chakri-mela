import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';


import { Metadata } from 'next';
import DashboardLayout from './layout';

// Add metadata for the dashboard page
export const metadata: Metadata = {
    title: 'Dashboard | Your App Name',
    description: 'Your dashboard description here',
};

export default async function DashboardPage() {
    const session = await getServerSession();

    if (!session) {
        redirect('/auth/login');
    }

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-100">
                <div className="py-10">
                    <header>
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <h1 className="text-3xl font-bold leading-tight text-gray-900">
                                Welcome back, {session.user.name}!
                            </h1>
                        </div>
                    </header>
                    <main>
                        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                            {/* Dashboard Content */}
                            <div className="px-4 py-8 sm:px-0">
                                <div className="border-4 border-dashed border-gray-200 rounded-lg h-96">
                                    {/* Your dashboard content goes here */}
                                    <div className="flex items-center justify-center h-full">
                                        <div className="text-center">
                                            <h2 className="text-xl font-semibold text-gray-700">
                                                Dashboard Content
                                            </h2>
                                            <p className="mt-2 text-gray-500">
                                                Add your dashboard components here
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </DashboardLayout>
    );
}