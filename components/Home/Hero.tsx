/* eslint-disable */
'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { SearchIcon } from '@/components/icons';
import { getActiveJobs } from '@/app/find-work/jobFetch';
import type { IJobPost } from '@/models/jobPost';

const Hero = () => {
    const [search, setSearch] = useState('');
    const [suggestions, setSuggestions] = useState<IJobPost[]>([]);
    const [allJobs, setAllJobs] = useState<IJobPost[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    useEffect(() => {
        // Fetch all jobs for search suggestions
        getActiveJobs().then(jobs => setAllJobs(jobs));
    }, []);

    useEffect(() => {
        if (search.trim().length === 0) {
            setSuggestions([]);
            return;
        }
        const lower = search.toLowerCase();
        setSuggestions(
            allJobs.filter(job =>
                job.jobTitle.toLowerCase().includes(lower) ||
                job.jobType.toLowerCase().includes(lower) ||
                job.jobCategory.toLowerCase().includes(lower) ||
                job.skills.some(skill => skill.toLowerCase().includes(lower))
            ).slice(0, 6)
        );
    }, [search, allJobs]);

    // Hide suggestions when clicking outside
    useEffect(() => {
        function handleClick(e: MouseEvent) {
            if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
                setShowSuggestions(false);
            }
        }
        if (showSuggestions) {
            document.addEventListener('mousedown', handleClick);
        }
        return () => document.removeEventListener('mousedown', handleClick);
    }, [showSuggestions]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setShowSuggestions(true);
    };
    const handleSuggestionClick = (jobId: string) => {
        setShowSuggestions(false);
        setSearch('');
        router.push(`/find-work/${jobId}`);
    };
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (suggestions.length === 1) {
            router.push(`/find-work/${suggestions[0]._id}`);
        } else if (suggestions.length > 1) {
            // If user typed a category or job type, redirect to search-result page
            router.push(`/find-work/search-result?q=${encodeURIComponent(search)}`);
        } else if (search.trim()) {
            router.push(`/find-work?search=${encodeURIComponent(search)}`);
        }
    };

    return (
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-3xl">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Find the perfect freelance services for your business
                    </h1>
                    <form onSubmit={handleSubmit} autoComplete="off">
                        <div className="bg-white rounded-lg p-2 flex items-center shadow-lg relative">
                            <SearchIcon className="text-gray-400 w-6 h-6 ml-2" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={search}
                                onChange={handleInput}
                                onFocus={() => setShowSuggestions(true)}
                                placeholder="Search for any service..."
                                className="w-full px-4 py-2 text-gray-800 bg-white focus:outline-none"
                            />
                            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
                                Search
                            </button>
                            {showSuggestions && suggestions.length > 0 && (
                                <ul className="absolute left-0 right-0 top-full mt-2 bg-white text-gray-800 rounded-lg shadow-lg z-10 max-h-72 overflow-y-auto">
                                    {suggestions.map(job => (
                                        <li
                                            key={job._id}
                                            className="px-4 py-2 hover:bg-blue-100 cursor-pointer border-b last:border-b-0"
                                            onMouseDown={() => handleSuggestionClick(job._id)}
                                        >
                                            <span className="font-semibold">{job.jobTitle}</span>
                                            <span className="ml-2 text-xs text-gray-500">{job.jobType} | {job.jobCategory}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </form>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <span className="text-sm bg-blue-500 bg-opacity-20 px-3 py-1 rounded-full">
                            Popular: Home Repair
                        </span>
                        <span className="text-sm bg-blue-500 bg-opacity-20 px-3 py-1 rounded-full">
                            Painting
                        </span>
                        <span className="text-sm bg-blue-500 bg-opacity-20 px-3 py-1 rounded-full">
                            Electrical Work
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;