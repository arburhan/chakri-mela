/* eslint-disable */
'use client';
import React, { useEffect, useState } from 'react';
import { IJobPost } from '@/models/jobPost';
import { Button } from '@heroui/button';
import { getActiveJobs } from '@/app/find-work/jobFetch';
import ProposalTracker from './proposalTracker';
import { useRouter } from 'next/navigation';
import Loading from '@/app/find-work/loading';


const JobsPage = () => {
    const [activeJobs, setActiveJobs] = useState<IJobPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const jobs = await getActiveJobs();
                setActiveJobs(jobs || []);
            } catch (error) {
                console.error('Error fetching jobs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, []);

    if (loading) {
        return (
            <Loading />
        );
    }

    if (!activeJobs || activeJobs.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
                <div className="text-2xl font-semibold text-gray-600 mb-4">
                    No active jobs found
                </div>
                <Button color="primary" size="lg">
                    Post a New Job
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="lg:w-2/3">
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-bold text-gray-800">Your Active Jobs</h1>
                            <div className="text-sm text-gray-500">
                                {activeJobs.length} {activeJobs.length === 1 ? 'job' : 'jobs'} active
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {activeJobs.map((job) => (
                                <JobCard key={job._id} job={job} />
                            ))}
                        </div>
                    </div>

                    <div className="lg:w-1/3">
                        <ProposalTracker jobs={activeJobs} />
                    </div>
                </div>
            </div>
        </div>
    );
};

const JobCard = (({ job }: { job: IJobPost }) => {
    const router = useRouter();
    const handleShowProposals = (jobID: string) => {
        console.log('Show proposals for job:', jobID);
        // router.push(`/dashboard/poster/currentJob/${jobID}`);
    }
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all">
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-800">{job.jobTitle}</h3>
                    <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                        {job.jobType}
                    </span>
                </div>

                <div className="flex items-center mb-4">
                    <span className="text-gray-600 mr-2">Rate:</span>
                    <span className="font-medium text-green-900">
                        ${job.salaryRange.startRange} - ${job.salaryRange.endRange}/hr
                    </span>
                </div>

                <div className="flex items-center mb-6">
                    <span className="text-gray-600 mr-2">Proposals:</span>
                    <span className="font-medium text-blue-700">12</span>
                </div>

                <div className="flex flex-col space-y-3">
                    <Button onPress={() => handleShowProposals(job?._id)} color="secondary" size="sm" className="w-full mt-6">
                        View Proposals
                    </Button>
                </div>
            </div>
        </div>
    );
});

export default JobsPage;