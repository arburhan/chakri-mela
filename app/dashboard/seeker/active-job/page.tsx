/* eslint-disable */
'use client';
import { getActiveJobsSeekerByStatus, getRunningJobsBySeeker } from '@/app/find-work/jobFetch';
import Loading from '@/app/find-work/loading';
import { IJobPost } from '@/models/jobPost';
import { Button, Progress } from '@heroui/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaBriefcase, FaCalendarAlt, FaMapMarkerAlt, FaMoneyBillWave, FaClock } from 'react-icons/fa';


const ActiveJobSeeker = () => {
    const router = useRouter();
    const { data: session } = useSession();
    const userId = session?.user?.id;
    const [activeJob, setActiveJob] = useState<IJobPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);


    useEffect(() => {
        const fetchData = async () => {
            if (userId) {
                try {
                    const activeJob = await getRunningJobsBySeeker(userId.toString());
                    console.log(activeJob);
                    setActiveJob(activeJob);
                } catch (error) {
                    console.error("Error fetching jobs:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchData();
    }, [userId]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Active Projects</h1>
                    <p className="text-gray-600 mt-2">Your currently accepted job engagements</p>
                </div>

                {activeJob.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                        <div className="mb-4 text-gray-400 mx-auto">
                            <FaBriefcase className="h-16 w-16 inline-block" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Active Projects</h2>
                        <p className="text-gray-500">You don't have any ongoing projects at the moment</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {activeJob.map((job) => (
                            <div key={job._id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900">{job.jobTitle}</h3>
                                            <div className="flex items-center mt-1 text-sm text-gray-500">
                                                <FaMapMarkerAlt className="mr-2" />
                                                {job.jobLocation.city}, {job.jobLocation.country}
                                            </div>
                                        </div>
                                        <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                                            Active
                                        </span>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <FaMoneyBillWave className="mr-2 text-green-500" />
                                                ${job.salaryRange.startRange} - ${job.salaryRange.endRange}
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <FaClock className="mr-2 text-blue-500" />
                                                {job.workingHour}h/week
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="text-sm font-medium text-gray-900 mb-2">Project Progress</h4>
                                            <Progress value={50} className="h-2" />
                                            <div className="flex justify-between mt-2 text-xs text-gray-500">
                                                <span>50% Completed</span>
                                                <span>Due in 15 days</span>
                                            </div>
                                        </div>


                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <FaCalendarAlt className="mr-2" />
                                                Started: {new Date(job.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 px-6 py-3 border-t text-center">
                                    <Button onPress={() => router.push(`/find-work/${job?._id}/apply`)} >
                                        View Proposal
                                    </Button>

                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActiveJobSeeker;