/* eslint-disable */
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const NotFound = () => {
    const router = useRouter();
    useEffect(() => {
        const timer = setTimeout(() => {
            router.push('/');
        }, 5000);
        return () => clearTimeout(timer);
    }, [router]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700 text-white">
            <div className="text-8xl font-extrabold mb-4 animate-bounce">404</div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Oops! Page Not Found</h1>
            <p className="mb-8 text-lg md:text-xl text-blue-100">The page you are looking for doesn't exist or has been moved.</p>
            <div className="flex items-center gap-2 mb-2">
                <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
                <span>Redirecting to home in 5 seconds...</span>
            </div>
            <a href="/" className="mt-4 px-6 py-2 bg-white text-blue-700 rounded-lg font-semibold shadow hover:bg-blue-100 transition">Go Home Now</a>
        </div>
    );
};

export default NotFound;
