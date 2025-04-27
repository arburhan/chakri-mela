/* eslint-disable */
'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@heroui/button';
import { Textarea } from '@heroui/input';
import { getJobById } from '../jobFetch';
import { IJobPost } from '@/models/jobPost';
import { BreadcrumbItem, Breadcrumbs } from '@heroui/react';
import moment from 'moment';
import { HiAcademicCap } from "react-icons/hi2";
import { FaSackDollar } from 'react-icons/fa6';
import { MdOutlineAccessTimeFilled } from 'react-icons/md';
import { useRouter } from 'next/navigation';



const JobDetailsPage = ({ params }: { params: Promise<{ id: string }> }) => {
    const [isApplying, setIsApplying] = useState(false);
    const [coverLetter, setCoverLetter] = useState('');
    const [job, setJob] = useState<IJobPost | null>(null);
    const resolvedParams = React.use(params);
    const router = useRouter();
    const url = `${process.env.NEXT_PUBLIC_API_URL}`;

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const jobData = await getJobById(resolvedParams.id);
                setJob(jobData);
            } catch (error) {
                console.error('Error fetching job:', error);
            }
        };
        fetchJob();
    }, [resolvedParams.id]);

    const handleApply = async () => {
        console.log("nothing");

        router.push(`/find-work/${resolvedParams.id}/apply`);
        /* alert('Your application has been submitted!');
        setIsApplying(false);
        setCoverLetter(''); */
    };

    if (!job) {
        return <div>Loading...</div>;
    }

    return (
        <section className="py-8 bg-gray-100 text-black">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Breadcrumb */}
                <Breadcrumbs color='primary' className='pb-4' >
                    <BreadcrumbItem>Jobs</BreadcrumbItem>
                    <BreadcrumbItem>{job.jobType}</BreadcrumbItem>
                    <BreadcrumbItem>{job.jobTitle}</BreadcrumbItem>
                </Breadcrumbs>


                {/* Job Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6 ">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 className="text-2xl font-bold mb-2">{job.jobTitle}</h1>
                            <div className="flex flex-wrap gap-2 text-sm text-gray-600 mb-4">
                                <span>{job.jobType}</span>
                                <span>•</span>
                                <span>Posted {moment(job.createdAt).format("MMMM Do YYYY")}</span>
                            </div>
                        </div>
                        <div>
                            <Button
                                color="success"
                                onClick={handleApply}
                                className="mb-5 text-white px-16"
                            >
                                Apply Nowsss
                            </Button>
                            <br />
                            <Button color="primary" variant="bordered" className=' px-16'>Saved Job</Button>

                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-700">
                        <div className='flex items-center gap-4'>
                            <FaSackDollar className='w-8 h-8' />
                            <div>
                                <div className="font-medium mb-1">Salary Range</div>
                                <div className="text-xl font-bold text-gray-900">
                                    {job?.salaryRange?.startRange} - {job?.salaryRange?.endRange}
                                </div>
                                <div className="text-sm text-gray-500">Per Hour</div>
                            </div>
                        </div>
                        <div className='flex items-center gap-4'>
                            <HiAcademicCap className='w-8 h-8' />
                            <div>
                                <div className="font-medium mb-1">Job Level</div>
                                <div className="text-xl font-bold text-gray-900">{Array.isArray(job.jobLevel) ? job.jobLevel.join(', ') : 'N/A'}</div>
                            </div>
                        </div>
                        <div className='flex items-center gap-4'>
                            <MdOutlineAccessTimeFilled className='w-8 h-8' />
                            <div>
                                <div className="font-medium mb-1">Working Hours</div>
                                <div className="text-xl font-bold text-gray-900">{job.workingHour} hrs/week</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Job Details */}
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

                        {/* Application Section */}
                        {/* {isApplying && (
                            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                                <h2 className="text-xl font-bold mb-4">Submit a Proposal</h2>
                                <form onSubmit={handleApply}>
                                    <div className="mb-4">
                                        <label className="block text-gray-700 text-sm font-bold mb-2">
                                            Cover Letter
                                        </label>
                                        <Textarea
                                            required
                                            rows={6}
                                            placeholder="Introduce yourself and explain why you're a good fit for this job..."
                                            className="w-full"
                                            value={coverLetter}
                                            onChange={(e) => setCoverLetter(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Button

                                            type="submit" color="primary">
                                            Submit Proposal
                                        </Button>
                                        <Button
                                            type="button"
                                            onPress={() => setIsApplying(false)}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )} */}
                    </div>
                </div>
            </div>
        </section >
    );
};

export default JobDetailsPage;
