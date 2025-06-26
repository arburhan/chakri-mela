/* eslint-disable */
'use client'
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes } from 'react-icons/fa';
import { signOut, useSession } from 'next-auth/react';



const Navcomp: React.FC = () => {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const profileMenuRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                profileMenuRef.current &&
                !profileMenuRef.current.contains(event.target as Node)
            ) {
                setIsProfileMenuOpen(false);
            }
            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);


    return (
        <nav className="bg-white shadow-md w-full">
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
                <Link href="/" className="text-blue-600 text-2xl font-bold">Chakri-Mela</Link>

                <div className="hidden md:flex space-x-8">
                    <Link href="/find-work" className="text-gray-700 hover:text-blue-600 transition duration-300">Jobs</Link>
                    <Link href="/talent" className="text-gray-700 hover:text-blue-600 transition duration-300">Talent</Link>
                    <Link href="/projects" className="text-gray-700 hover:text-blue-600 transition duration-300">Projects</Link>
                    <Link href="/resources" className="text-gray-700 hover:text-blue-600 transition duration-300">Resources</Link>
                    {session && (
                        <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 transition duration-300">Dashboard</Link>
                    )}
                </div>

                <div className="hidden md:flex items-center space-x-6">
                    {session ? (
                        <div className="hidden md:block z-50">
                            <div className="ml-4 flex items-center md:ml-6"></div>
                            <div className="relative" ref={profileMenuRef}>
                                <button
                                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                    className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                                >
                                    <span className="sr-only">Open user menu</span>
                                    <div className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center text-white">
                                        {session?.user?.name?.charAt(0)}
                                    </div>
                                </button>
                                {isProfileMenuOpen && (
                                    <div className="origin-top-right absolute right-0 mt-2 w-64 rounded-xl shadow-lg py-3 bg-white ring-1 ring-black ring-opacity-5 z-50 animate-fade-in">
                                        <div className="flex flex-col items-center px-6 py-4 border-b border-gray-100">
                                            <div className="h-14 w-14 rounded-full bg-blue-500 flex items-center justify-center text-2xl font-bold text-white mb-2">
                                                {session?.user?.name?.charAt(0)}
                                            </div>
                                            <div className="text-lg font-semibold text-gray-800">{session?.user?.name}</div>
                                            <div className="text-xs text-gray-500 mt-1">Role: <span className="font-medium text-blue-600">{session?.user?.role}</span></div>
                                        </div>
                                        <div className="flex flex-col py-2">
                                            <Link href="/dashboard" className="px-6 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition rounded-md text-left">Dashboard</Link>
                                            <Link href={`/dashboard/${session?.user?.role}/profile`} className="px-6 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition rounded-md text-left">Profile</Link>
                                            {/* <Link href="/settings" className="px-6 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition rounded-md text-left">Settings</Link> */}
                                        </div>
                                        <div className="border-t border-gray-100 mt-2"></div>
                                        <button
                                            onClick={() => signOut()}
                                            className="block w-full px-6 py-2 text-sm text-red-600 text-left hover:bg-red-50 transition rounded-b-xl mt-1"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
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

            {
                isOpen && (
                    <div ref={mobileMenuRef} className="md:hidden bg-white shadow-lg">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <Link href="/jobs" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition duration-300">Jobs</Link>
                            <Link href="/talent" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition duration-300">Talent</Link>
                            <Link href="/projects" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition duration-300">Projects</Link>
                            <Link href="/resources" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition duration-300">Resources</Link>
                            {session && (
                                <Link href="/dashboard" className="block px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md transition duration-300">Dashboard</Link>
                            )}
                        </div>

                        <div className="flex flex-col space-y-2 mt-4">
                            {session ? (
                                <div className="flex items-center justify-center space-x-4 w-full">
                                    <div className="relative w-full">
                                        <button
                                            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                                            className="w-full max-w-xs bg-gray-800 rounded-full flex items-center justify-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white mx-auto"
                                        >
                                            <span className="sr-only">Open user menu</span>
                                            <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-2xl font-bold text-white">
                                                {session?.user?.name?.charAt(0)}
                                            </div>
                                        </button>
                                        {isProfileMenuOpen && (
                                            <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-72 rounded-xl shadow-lg py-3 bg-white ring-1 ring-black ring-opacity-5 z-50 animate-fade-in">
                                                <div className="flex flex-col items-center px-6 py-4 border-b border-gray-100">
                                                    <div className="h-14 w-14 rounded-full bg-blue-500 flex items-center justify-center text-2xl font-bold text-white mb-2">
                                                        {session?.user?.name?.charAt(0)}
                                                    </div>
                                                    <div className="text-lg font-semibold text-gray-800">{session?.user?.name}</div>
                                                    <div className="text-xs text-gray-500 mt-1">Role: <span className="font-medium text-blue-600">{session?.user?.role}</span></div>
                                                </div>
                                                <div className="flex flex-col py-2 w-full">
                                                    <Link href="/dashboard" className="px-6 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition rounded-md text-left">Dashboard</Link>
                                                    <Link href={`/dashboard/${session?.user?.role}/profile`} className="px-6 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition rounded-md text-left">Profile</Link>
                                                    {/*  <Link href="/settings" className="px-6 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition rounded-md text-left">Settings</Link> */}
                                                </div>
                                                <div className="border-t border-gray-100 mt-2"></div>
                                                <button
                                                    onClick={() => signOut()}
                                                    className="block w-full px-6 py-2 text-sm text-red-600 text-left hover:bg-red-50 transition rounded-b-xl mt-1"
                                                >
                                                    Sign out
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <Link href="/auth/login" className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-center transition duration-300">Sign in</Link>
                            )}
                        </div>
                    </div>
                )
            }
        </nav >
    );
};

export default Navcomp;
