/*eslint-disable */
'use client';
import React, { Suspense, useState, useEffect } from 'react';
import { Button } from '@heroui/button';
import { getJobById } from '../jobFetch';
import { IJobPost } from '@/models/jobPost';
import { BreadcrumbItem, Breadcrumbs } from '@heroui/react';
import moment from 'moment';
import { HiAcademicCap } from "react-icons/hi2";
import { FaSackDollar } from 'react-icons/fa6';
import { MdOutlineAccessTimeFilled } from 'react-icons/md';
import { redirect, useParams, useRouter } from 'next/navigation';
import JobDetailsLoading from '@/components/JobDetailsLoading';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

const JobHeader = ({ job, handleApply, session }: { job: IJobPost, handleApply: () => void, session: any }) => (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
            <div>
                <h1 className="text-2xl font-bold mb-2">{job.jobTitle}</h1>
                <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-4">
                    <span>{job.jobType}</span>
                    <span>•</span>
                    <span>Posted: {moment(job.createdAt).format("MMMM Do YYYY")}</span>
                </div>
            </div>
            <div>
                {
                    session ? (session?.user?.role === 'seeker' &&
                        <Button
                            color="success"
                            onPress={handleApply}
                            className="mb-5 text-white px-16"
                        >
                            Apply Now
                        </Button>) :
                        <Button
                            onPress={() => redirect('/auth/login')}
                            className="mb-5 text-white px-12"
                        >
                            Login to Apply
                        </Button>


                }
                <br />
                <Button color="primary" variant="bordered" className="px-16">
                    Save Job
                </Button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700">
            <div className="flex items-center gap-4">
                <FaSackDollar className="w-8 h-8" />
                <div>
                    <div className="font-medium mb-1">Salary Range</div>
                    <div className="text-xl font-bold text-gray-900">
                        {job?.salaryRange?.startRange} - {job?.salaryRange?.endRange}
                    </div>
                    <div className="text-sm text-gray-500">Per Hour</div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <HiAcademicCap className="w-8 h-8" />
                <div>
                    <div className="font-medium mb-1">Job Level</div>
                    <div className="text-xl font-bold text-gray-900">
                        {Array.isArray(job.jobLevel) ? job.jobLevel.join(', ') : 'N/A'}
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <MdOutlineAccessTimeFilled className="w-8 h-8" />
                <div>
                    <div className="font-medium mb-1">Working Hours</div>
                    <div className="text-xl font-bold text-gray-900">{job.workingHour} hrs/day</div>
                </div>
            </div>
        </div>
    </div>
);

// Separate component for job details content
const JobContent = ({ job }: { job: IJobPost }) => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">Job Description</h2>
                <div className="text-gray-700 whitespace-pre-line mb-6">
                    {job.jobDescription}
                </div>

                <h3 className="text-lg font-bold mb-3">Skills and Expertise</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                    {(job?.skills ?? []).map((skill, index) => (
                        <span
                            key={index}
                            className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm"
                        >
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        </div>
        <div className="lg:col-span-1">
            {/* You can add additional content here if needed */}
        </div>
    </div>
);

// Main component with streaming
const JobDetailsPage = () => {
    const { data: session } = useSession();
    const params = useParams<{ id: string }>();
    const jobId = params.id;
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [job, setJob] = useState<IJobPost | null>(null);
    // Get job ID from URL

    useEffect(() => {
        const fetchJob = async () => {
            try {
                // Simulate loading state
                const singleJob = await getJobById(jobId);
                setJob(singleJob);
                setIsLoading(false); // Add this line to turn off the loading state
            } catch (error) {
                console.error("Error fetching job:", error);
                setIsLoading(false); // Also turn off loading in case of error
            }
        };
        fetchJob();
    }, [jobId]);

    const handleApply = async () => {
        router.push(`/find-work/${jobId}/apply`);
    };

    if (isLoading) {
        return <JobDetailsLoading />;
    }

    if (!job) {
        return (
            <div className="py-8 bg-gray-100 text-black">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h2 className="text-xl font-bold text-red-500">Job not found</h2>
                        <p className="text-gray-700 mt-2">The job you're looking for doesn't exist or has been removed.</p>
                        <Button
                            color="primary"
                            className="mt-4"
                            onPress={() => router.push('/find-work')}
                        >
                            Browse Jobs
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <section className="py-8 bg-gray-100 text-black">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Breadcrumb */}
                <Breadcrumbs color="primary" className="pb-4">
                    <BreadcrumbItem>Jobs</BreadcrumbItem>
                    <BreadcrumbItem>{job.jobType}</BreadcrumbItem>
                    <BreadcrumbItem>{job.jobTitle}</BreadcrumbItem>
                </Breadcrumbs>

                {/* Job Header */}
                <Suspense fallback={<div className="animate-pulse bg-white rounded-lg shadow-sm p-6 mb-6 h-48"></div>}>
                    <JobHeader job={job} handleApply={handleApply} session={session} />
                </Suspense>

                {/* Main Content */}
                <Suspense fallback={<div className="animate-pulse bg-white rounded-lg shadow-sm p-6 mb-6 h-64"></div>}>
                    <JobContent job={job} />
                </Suspense>
            </div>
        </section>
    );
};

export default JobDetailsPage;