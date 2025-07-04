/* eslint-disable */
'use client';
import Link from 'next/link';
import { FaHome, FaUser, FaCog, FaSignOutAlt, FaHistory } from 'react-icons/fa';
import { useState } from 'react';
import { RiMenu2Line } from "react-icons/ri";
import { MdPublish } from 'react-icons/md';
import { BiCurrentLocation } from 'react-icons/bi';

const posterDashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const closeSidebar = () => setIsSidebarOpen(false);

    return (
        <div className="flex relative">
            {/* Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
                    onClick={closeSidebar}
                ></div>
            )}

            {/* Sidebar */}
            <aside
                className={`bg-gray-800 md:bg-transparent text-gray-200 p-5 mt-16 md:mt-20 fixed h-full overflow-y-auto transform transition-transform z-20 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:translate-x-0 md:relative w-64`}
            >
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-xl font-bold">Dashboard</h2>
                </div>
                <ul className="space-y-5">
                    <li className="flex items-center">
                        <FaHome className="mr-2" />
                        <Link
                            href="/dashboard/poster"
                            className="text-gray-200 hover:text-white"
                            onClick={closeSidebar}
                        >
                            Home
                        </Link>
                    </li>
                    <li className="flex items-center">
                        <FaUser className="mr-2" />
                        <Link
                            href="/dashboard/poster/profile"
                            className="text-gray-200 hover:text-white"
                            onClick={closeSidebar}
                        >
                            Profile
                        </Link>
                    </li>
                    <li className="flex items-center">
                        <BiCurrentLocation className="mr-2" />
                        <Link
                            href="/dashboard/poster/currentJob"
                            className="text-gray-200 hover:text-white"
                            onClick={closeSidebar}
                        >
                            Current Jobs
                        </Link>
                    </li>
                    <li className="flex items-center">
                        <MdPublish className='mr-2' />
                        <Link
                            href="/dashboard/poster/postNewJob"
                            className="text-gray-200 hover:text-white"
                            onClick={closeSidebar}
                        >
                            Post New Job
                        </Link>
                    </li>
                    <li className="flex items-center">
                        <FaHistory className='mr-2' />
                        <Link
                            href="/dashboard/poster/history"
                            className="text-gray-200 hover:text-white"
                            onClick={closeSidebar}
                        >
                            Work History
                        </Link>
                    </li>
                    <li className="flex items-center">
                        <FaCog className="mr-2" />
                        <Link
                            href="/dashboard/poster/settings"
                            className="text-gray-200 hover:text-white"
                            onClick={closeSidebar}
                        >
                            Settings
                        </Link>
                    </li>
                    <li className="flex items-center">
                        <FaSignOutAlt className="mr-2" />
                        <Link
                            href="/logout"
                            className="text-gray-200 hover:text-white"
                            onClick={closeSidebar}
                        >
                            Logout
                        </Link>
                    </li>
                </ul>
            </aside>

            {/* Main Content */}
            <main
                className={`flex-1 py-10 md:p-5 transition-all md:ml-0`}
            >
                <div className="flex items-center justify-between mt-10 pb-2 px-4 w-full md:hidden">
                    <button
                        className="text-gray-500"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <RiMenu2Line size={24} />
                    </button>
                    <h1 className="text-2xl font-bold truncate">Dashboard</h1>
                </div>
                {children}
            </main>
        </div>
    );
};

export default posterDashboardLayout;
