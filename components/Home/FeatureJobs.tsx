/* eslint-disable */
import React from 'react';

const FeatureJobs = () => {
    return (
        <section className="py-16 bg-gray-50 text-black">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8">Featured Jobs</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {featuredJobs.map((job) => (
                        <div key={job.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-semibold mb-2">{job.title}</h3>
                                    <p className="text-gray-600 text-sm mb-2">{job.company}</p>
                                </div>
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                    ${job.hourlyRate}/hr
                                </span>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">{job.description}</p>
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
const featuredJobs = [
    {
        id: 1,
        title: 'Experienced Plumber',
        company: 'FixIt Plumbing',
        hourlyRate: '50',
        description: 'Looking for a certified plumber to handle residential plumbing issues.',
        skills: ['Plumbing', 'Pipe Repair', 'Water Systems']
    },
    {
        id: 2,
        title: 'Electrician',
        company: 'Bright Sparks',
        hourlyRate: '55',
        description: 'Need a licensed electrician for various electrical installations and repairs.',
        skills: ['Electrical Work', 'Wiring', 'Circuit Breakers']
    },
    {
        id: 3,
        title: 'Carpenter',
        company: 'WoodWorks',
        hourlyRate: '45',
        description: 'Seeking a skilled carpenter for custom furniture and home renovations.',
        skills: ['Carpentry', 'Woodworking', 'Furniture Making']
    }
];

export default FeatureJobs;