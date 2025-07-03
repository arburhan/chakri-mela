/* eslint-disable */
'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getActiveJobs } from '../jobFetch';
import type { IJobPost } from '@/models/jobPost';
import ActiveWorks from '../activeWorks';

const JOBS_PER_PAGE = 10;

const SearchResultPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [jobs, setJobs] = useState<IJobPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const q = searchParams.get('q') || '';
        setQuery(q);
        async function fetchJobs() {
            setLoading(true);
            const allJobs = await getActiveJobs();
            const lower = q.toLowerCase();
            const filtered = allJobs.filter(job =>
                job.jobTitle.toLowerCase().includes(lower) ||
                job.jobType.toLowerCase().includes(lower) ||
                job.jobCategory.toLowerCase().includes(lower) ||
                job.skills.some(skill => skill.toLowerCase().includes(lower))
            );
            setJobs(filtered);
            setLoading(false);
        }
        fetchJobs();
    }, [searchParams]);

    useEffect(() => {
        setCurrentPage(1); // Reset to first page on new search
    }, [query]);

    const totalPages = Math.ceil(jobs.length / JOBS_PER_PAGE);
    const paginatedJobs = jobs.slice((currentPage - 1) * JOBS_PER_PAGE, currentPage * JOBS_PER_PAGE);

    return (
        <div className="min-h-screen bg-gray-50 pt-16 text-black">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold mb-6">Search Results for: <span className="text-blue-600">{query}</span></h1>
                {loading ? (
                    <div className="text-center py-10">Loading jobs...</div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-10 text-gray-500">No jobs found for this search.</div>
                ) : (
                    <>
                        <ActiveWorks jobs={paginatedJobs} />
                        {/* Pagination */}
                        <div className="flex justify-center mt-8">
                            <nav className="flex items-center gap-2">
                                <button
                                    className="px-3 py-1 border rounded hover:bg-gray-50"
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Previous
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => (
                                    <button
                                        key={i + 1}
                                        className={`px-3 py-1 rounded ${currentPage === i + 1 ? 'bg-blue-600 text-white' : 'border hover:bg-gray-50'}`}
                                        onClick={() => setCurrentPage(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    className="px-3 py-1 border rounded hover:bg-gray-50"
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </nav>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default SearchResultPage;
