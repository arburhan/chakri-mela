/* eslint-disable */
'use client'
import { useState } from 'react';
import Link from 'next/link';
import {
    FaBars,
    FaTimes,
} from 'react-icons/fa';
import { signOut } from 'next-auth/react';
interface NavcompProps {
    session: {
        id: string;
        name: string;
        email: string;
        role: string;
    } | undefined;
}

const Navcomp: React.FC<NavcompProps> = ({ session }) => {

    const [isOpen, setIsOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);


    return (
        <nav className="bg-white shadow-md fixed w-full z-50">
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
                <Link href="/" className="text-blue-600 text-2xl font-bold">Chakri-Mela</Link>

                <div className="hidden md:flex space-x-8">
                    <Link href="/find-work" className="text-gray-700 hover:text-blue-600 transition duration-300">Jobs</Link>
                    <Link href="/talent" className="text-gray-700 hover:text-blue-600 transition duration-300">Talent</Link>
                    <Link href="/projects" className="text-gray-700 hover:text-blue-600 transition duration-300">Projects</Link>
                    <Link href="/resources" className="text-gray-700 hover:text-blue-600 transition duration-300">Resources</Link>
                </div>

                <div className="hidden md:flex items-center space-x-6">
                    {session ? (
                        <div className="hidden md:block">
                            <div className="ml-4 flex items-center md:ml-6">
                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                        className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                                    >
                                        <span className="sr-only">Open user menu</span>
                                        <div className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center text-white">
                                            {session?.name?.charAt(0)}
                                        </div>
                                    </button>
                                    {/* Profile dropdown */}
                                    {isProfileMenuOpen && (
                                        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                                            <div className="px-4 py-2 text-sm text-gray-700">
                                                <p>{session?.name}</p>
                                                <p>role: {session?.role}</p>
                                            </div>
                                            <div className="border-t border-gray-100"></div>
                                            <button
                                                onClick={() => signOut()}
                                                className="block px-4 py-2 text-sm text-gray-700 w-full text-left hover:bg-gray-100"
                                            >
                                                Sign out
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                        : (
                            <Link href="/auth/login" className="text-blue-600 px-4 py-2 rounded-md bg-blue-100 transition duration-300">Sign In</Link>
                        )}
                </div>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="md:hidden text-gray-700 hover:text-blue-600 focus:outline-none transition duration-300"
                >
                    {isOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
                </button>
            </div>

            {isOpen && (
                <div className="md:hidden bg-white shadow-lg">
                    <div className="px-2 pt-2 pb-3 space-y-1">
                        <Link href="/jobs" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition duration-300">Jobs</Link>
                        <Link href="/talent" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition duration-300">Talent</Link>
                        <Link href="/projects" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition duration-300">Projects</Link>
                        <Link href="/resources" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition duration-300">Resources</Link>

                        <div className="flex flex-col space-y-2 mt-4">
                            {session ? (
                                <div className="flex items-center justify-center space-x-4">
                                    <div className="ml-4 flex items-center md:ml-6">
                                        <div className="relative">
                                            <button
                                                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                                className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                                            >
                                                <span className="sr-only">Open user menu</span>
                                                <div className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center text-white">
                                                    {session?.name?.charAt(0)}
                                                </div>
                                            </button>
                                            {/* Profile dropdown */}
                                            {isProfileMenuOpen && (
                                                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
                                                    <div className="px-4 py-2 text-sm text-gray-700">
                                                        {session?.name}
                                                    </div>
                                                    <div className="border-t border-gray-100"></div>
                                                    <button
                                                        onClick={() => signOut()}
                                                        className="block px-4 py-2 text-sm text-gray-700 w-full text-left hover:bg-gray-100"
                                                    >
                                                        Sign out
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                                : (
                                    <Link href="/auth/login" className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-center transition duration-300">Sign in</Link>
                                )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navcomp;
