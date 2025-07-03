/* eslint-disable */
'use client';
import React from 'react';
import type { IJobPost } from '@/models/jobPost';
import JobCard from './jobCard';

interface ActiveWorksProps {
    jobs: IJobPost[];
}

const ActiveWorks: React.FC<ActiveWorksProps> = ({ jobs }) => {
    return (
        <div className="space-y-6">
            {jobs.map((job: IJobPost) => (
                <JobCard key={job?._id || job?.id} job={job} />
            ))}
        </div>
    );
};

export default ActiveWorks;