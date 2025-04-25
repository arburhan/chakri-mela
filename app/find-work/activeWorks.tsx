/* eslint-disable */
import React from 'react';
import type { IJobPost } from '@/models/jobPost';
import JobCard from './jobCard';
import { getActiveJobs } from './jobFetch';


const ActiveWorks = async () => {
    const jobs: IJobPost[] = await getActiveJobs();
    return (
        <div className="space-y-6">
            {jobs.map((job: IJobPost) => (
                <JobCard key={job.id} job={job} />
            ))}
        </div>
    );
};

export default ActiveWorks;