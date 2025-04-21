/* eslint-disable */
import React from 'react';
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


const FeatureJobs = async () => {
    const allJobs = await getData();
    const activeJobs = allJobs.jobPosts
        .filter((job) => job.status === 'active')
        .slice(0, 6);
    return (
        <section className="py-16 bg-gray-50 text-black">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8">Featured Jobs</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {activeJobs.map((job) => (
                        <div key={job?.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-semibold mb-2">{job?.jobTitle}</h3>
                                    <p className="text-gray-600 text-sm mb-2">Job Type: {job.jobType}</p>
                                </div>
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                    ${job?.salaryRange?.startRange}-${job?.salaryRange?.endRange}/hr
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">{job.jobDescription}</p>
                            <div className="flex flex-wrap gap-2">
                                {job.skills.map((skill) => (
                                    <span key={skill} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                                        {skill}
                                    </span>
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