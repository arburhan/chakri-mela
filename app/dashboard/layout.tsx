/* eslint-disable */
'use client';

import { useSession, SessionProvider } from 'next-auth/react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { data: session } = useSession();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);


    return (
        <div>
            {/* Navigation */}
            <nav className="bg-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Link href="/dashboard">
                                    <span className="text-white text-xl font-bold">
                                        Your Logo
                                    </span>
                                </Link>
                            </div>
                            <div className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-4">
                                    <Link
                                        href="/dashboard"
                                        className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        Dashboard
                                    </Link>
                                    {/* Add more navigation items here */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Page Content */}
            {children}
        </div>
    );
}

export default function App({ children }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <DashboardLayout>{children}</DashboardLayout>
        </SessionProvider>
    );
}