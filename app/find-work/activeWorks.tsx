/* eslint-disable */
import React from 'react';
import moment from 'moment';
import { FaBriefcase, FaClock } from 'react-icons/fa6';
import type { IJobPost } from '@/models/jobPost';


interface JobData {
    jobPosts: IJobPost[];
}

const url = `${process.env.NEXT_PUBLIC_API_URL}/poster`;
async function getData(): Promise<JobData> {
    const res = await fetch(url)
    if (!res.ok) {
        console.log('Failed to fetch data')
    }
    return res.json()
}
const ActiveWorks = async () => {
    const allJobs = await getData();
    const activeJobs = allJobs.jobPosts
        .filter((job) => job.status === 'active')

    return (
        <div className="space-y-6">
            {activeJobs.map((job) => (
                <div key={job.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
                        <div>
                            <h3 className="text-lg font-semibold mb-2">{job.jobTitle}</h3>
                            <p className="text-gray-600 mb-2">Job Type: {job.jobType}</p>
                            <div className="flex flex-wrap gap-2">
                                {job.skills.map((skill) => (
                                    <span key={skill} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-green-600 font-semibold">${job.salaryRange.startRange} - ${job.salaryRange.endRange}/hr</span>
                            {/* <p className="text-gray-500 text-sm">Remote</p> */}
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t flex-wrap gap-4">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                                <FaBriefcase className="h-4 w-4" />
                                Full-time
                            </span>
                            <span className="flex items-center gap-1">
                                <FaClock className="h-4 w-4" />
                                Posted {moment(job.createdAt).fromNow()}
                            </span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700 font-medium">
                            View Details
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ActiveWorks;