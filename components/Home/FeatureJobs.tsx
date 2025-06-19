/* eslint-disable */
'use client'
import React, { useEffect, useState } from 'react';
import type { IJobPost } from '@/models/jobPost';
import { useRouter } from 'next/navigation';
import { getActiveJobs } from '@/app/find-work/jobFetch';
import { Chip } from '@heroui/react';


const FeatureJobs = () => {
    const router = useRouter();
    const [activeJobs, setActiveJobs] = useState<IJobPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        // Define and immediately invoke the fetch function within useEffect
        const fetchJobs = async () => {
            try {
                const allJobs = await getActiveJobs();
                console.log(allJobs);
                const filteredJobs = allJobs.filter((job) => job.jobStatus === 'active').slice(0, 6);
                setActiveJobs(filteredJobs);
            } catch (error) {
                console.error("Error fetching jobs:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobs();
    }, []);

    const handleJobClick = (jobId: string) => {
        router.push(`/find-work/${jobId}`);
    };

    if (isLoading) {
        return (
            <section className="py-16 bg-gray-50 text-black">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold mb-8">Featured Jobs</h2>
                    <div className="flex justify-center items-center h-40">
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce"></div>
                            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-400"></div>
                        </div>
                        <p className="ml-4">Loading jobs...</p>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-gray-50 text-black">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8">Featured Jobs</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeJobs.map((job) => (
                        <div
                            key={job._id}
                            className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => handleJobClick(job._id)}
                            role="button"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-semibold mb-2">{job.jobTitle}</h3>
                                    <p className="text-gray-600 text-sm mb-2">Job Type: {job?.jobType}</p>
                                </div>
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                    ${job.salaryRange.startRange}-${job.salaryRange.endRange}/hr
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">
                                {job.jobDescription.length > 100 ? job.jobDescription.substring(0, 100) + "..." : job.jobDescription}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {job?.skills.map((skill: string, index: number) => (
                                    <Chip key={index} size="sm" >
                                        {skill}
                                    </Chip>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeatureJobs;