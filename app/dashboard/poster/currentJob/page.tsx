/* eslint-disable */
import { Button } from '@heroui/button';
import React from 'react';

const url = `${process.env.NEXT_PUBLIC_API_URL}/poster`;
async function getData() {
    const res = await fetch(url)
    if (!res.ok) {
        console.log('Failed to fetch data')
    }
    return res.json()
}

interface JobPost {
    _id: string;
    jobTitle: string;
    jobType: string;
    workingHour: number;
    status: string;
    salaryRange: {
        startRange: number;
        endRange: number;
    };
}

interface JobData {
    jobPosts: JobPost[];
}

const Page = async () => {
    const allJobs = await getData();
    const activeJobs: JobPost[] = (allJobs as JobData).jobPosts.filter((job: JobPost) => job.status === 'active');
    //  console.log('Active jobs:', activeJobs);
    const activeJob = activeJobs[0]; // Get the first active job

    if (!activeJob) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl font-semibold text-gray-600">
                    No active job found
                </div>
            </div>
        );
    }
    const handleComplete = async () => {
        const res = await fetch(`${url}/${activeJob._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: 'completed' }),
        });
        if (!res.ok) {
            console.log('Failed to update job status')
        }
        const updatedJob = await res.json();
        console.log('Job status updated:', updatedJob);
    }
    const handleDelete = async () => {
        const res = await fetch(`${url}/${activeJob._id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!res.ok) {
            console.log('Failed to delete job')
        }
        const deletedJob = await res.json();
        console.log('Job deleted:', deletedJob);
    }
    const handleEdit = async () => {
        const res = await fetch(`${url}/${activeJob._id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: 'edited' }),
        });
        if (!res.ok) {
            console.log('Failed to edit job')
        }
        const editedJob = await res.json();
        console.log('Job edited:', editedJob);
    }


    return (
        <section className="py-16 bg-gray-200 text-black">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl font-bold mb-8">Active Jobs</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {
                        activeJobs.map((job) => (
                            <div key={job._id} className=" bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="font-semibold mb-2">{job?.jobTitle}</h3>
                                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                        ${job?.salaryRange.startRange}/hr
                                        ${job.salaryRange.endRange}/hr
                                    </span>
                                </div>

                                <p className="text-gray-600 text-sm mb-2">
                                    Type: {job?.jobType}
                                </p>
                                <div className='text-center py-3'>
                                    <div className='flex flex-wrap justify-between pb-6'>
                                        <Button>Edit</Button>
                                        <Button>Delete</Button>
                                    </div>
                                    <Button >Make Complete</Button>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </section >

    );
};

export default Page;