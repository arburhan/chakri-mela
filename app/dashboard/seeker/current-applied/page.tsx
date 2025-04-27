/* eslint-disable */
import React from 'react';

const currentApplied = () => {
    const jobs = [
        {
            id: 1,
            title: 'Frontend Developer',
            company: 'TechCorp',
            location: 'Remote',
            status: 'Pending',
        },
        {
            id: 2,
            title: 'Backend Developer',
            company: 'CodeWorks',
            location: 'New York, NY',
            status: 'pending',
        },
        {
            id: 3,
            title: 'UI/UX Designer',
            company: 'Designify',
            location: 'San Francisco, CA',
            status: 'pending',
        },
    ];

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Current Applied Jobs</h1>
            <div className="space-y-4">
                {jobs.map((job) => (
                    <div
                        key={job.id}
                        className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center"
                    >
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">{job.title}</h2>
                            <p className="text-sm text-gray-600">{job.company}</p>
                            <p className="text-sm text-gray-600">{job.location}</p>
                        </div>
                        <div>
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${job.status === 'Pending'
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : job.status === 'Interview Scheduled'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                    }`}
                            >
                                {job.status}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default currentApplied;