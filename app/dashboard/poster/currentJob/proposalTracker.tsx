/* eslint-disable */
'use client';
import React, { useEffect, useState } from 'react';
import { IJobPost } from '@/models/jobPost';

interface ProposalTrackerProps {
    jobs: IJobPost[];
}

const ProposalTracker = ({ jobs }: ProposalTrackerProps) => {
    const [proposalsData, setProposalsData] = useState<Record<string, number>>({});

    useEffect(() => {
        // Calculate proposals only once when jobs change
        const proposals = jobs.reduce((acc, job) => {
            acc[job._id] = Math.floor(Math.random() * 20) + 1;
            return acc;
        }, {} as Record<string, number>);

        setProposalsData(proposals);
    }, [jobs]);

    const totalProposals = Object.values(proposalsData).reduce((sum, num) => sum + num, 0);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Proposals Overview</h2>

            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Total Proposals:</span>
                    <span className="font-bold text-blue-600">{totalProposals}</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-blue-500"
                        style={{ width: `${Math.min(100, totalProposals)}%` }}
                    ></div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="font-medium text-gray-700">Proposals by Job</h3>
                <ul className="space-y-3">
                    {jobs.map((job) => (
                        <li key={job._id} className="flex justify-between items-center">
                            <span className="text-sm text-gray-600 truncate max-w-[160px]">{job.jobTitle}</span>
                            <span className="font-medium">{proposalsData[job._id] || 0}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default (ProposalTracker);