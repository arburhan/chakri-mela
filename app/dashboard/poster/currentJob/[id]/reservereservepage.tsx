/* eslint-disable */
'use client';
import { getJobById } from '@/app/find-work/jobFetch';
import { IJobPost } from '@/models/jobPost';
import { IProposal } from '@/models/proposal';
import { Button } from '@heroui/react';
import React, { useEffect, useState } from 'react';
import ProposalCard from './reserveproposalCard';
import { getProposalByID } from '../proposalFetch';

interface ProposalDetailsProps {
    params: Promise<{ id: string }>;
}

const ProposalDetails = ({ params }: ProposalDetailsProps) => {
    const [job, setJob] = useState<IJobPost | null>(null);
    const [proposals, setProposals] = useState<IProposal[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'shortlisted' | 'rejected'>('all');

    // Properly unwrap the params Promise
    const resolvedParams = React.use(params);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const [jobData, proposalData] = await Promise.all([
                    getJobById(resolvedParams.id),
                    getProposalByID(resolvedParams.id)
                ]);
                setJob(jobData);
                setProposals(proposalData || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [resolvedParams.id]);

    // Handle proposal status updates
    const handleProposalStatusUpdate = (proposalId: string, newStatus: string) => {
        setProposals(prevProposals =>
            prevProposals.map(proposal =>
                proposal._id === proposalId
                    ? { ...proposal, status: newStatus } as IProposal
                    : proposal
            )
        );
    };

    // Handle job actions (complete, edit, delete)
    const handleAction = async (action: 'complete' | 'edit' | 'delete') => {
        if (!job) return;

        console.log(`${action} job ${job._id}`);
        // Implement your API calls here
    };

    // Filter proposals based on active tab
    const filteredProposals = proposals.filter(proposal => {
        if (activeTab === 'all') return true;
        if (activeTab === 'shortlisted') return proposal.status === 'shortlisted';
        if (activeTab === 'rejected') return proposal.status === 'rejected';
        return false;
    });

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Loading...</div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-xl text-red-500">Job not found</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Job Details Section */}
                <div className="lg:w-1/3">
                    <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                        <h1 className="text-2xl font-bold mb-4">{job.jobTitle}</h1>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Job Type</h3>
                                <p className="text-lg">{job.jobType}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Rate</h3>
                                <p className="text-lg">
                                    ${job.salaryRange?.startRange} - ${job.salaryRange?.endRange}/hr
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Total Proposals</h3>
                                <p className="text-lg">{proposals.length}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Status Breakdown</h3>
                                <div className="flex gap-3 mt-1">
                                    <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                        Pending: {proposals.filter(p => p.status === 'pending').length}
                                    </span>
                                    <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                        Shortlisted: {proposals.filter(p => p.status === 'shortlisted').length}
                                    </span>
                                    <span className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                        Rejected: {proposals.filter(p => p.status === 'rejected').length}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 space-y-3">
                            <Button
                                variant="bordered"
                                size="md"
                                onPress={() => handleAction('edit')}
                                className="w-full"
                            >
                                Edit Job
                            </Button>
                            <div className="flex space-x-3">
                                <Button
                                    color="danger"
                                    size="md"
                                    onPress={() => handleAction('delete')}
                                    className="flex-1"
                                >
                                    Delete
                                </Button>
                                <Button
                                    color="primary"
                                    size="md"
                                    onPress={() => handleAction('complete')}
                                    className="flex-1"
                                >
                                    Complete
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Proposals Section */}
                <div className="lg:w-2/3">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">Proposals ({filteredProposals.length})</h2>
                            <div className="flex space-x-2">
                                <Button
                                    variant={activeTab === 'all' ? 'solid' : 'bordered'}
                                    size="sm"
                                    onPress={() => setActiveTab('all')}
                                >
                                    All
                                </Button>
                                <Button
                                    variant={activeTab === 'shortlisted' ? 'solid' : 'bordered'}
                                    size="sm"
                                    onPress={() => setActiveTab('shortlisted')}
                                >
                                    Shortlisted
                                </Button>
                                <Button
                                    variant={activeTab === 'rejected' ? 'solid' : 'bordered'}
                                    size="sm"
                                    onPress={() => setActiveTab('rejected')}
                                >
                                    Rejected
                                </Button>
                            </div>
                        </div>

                        {filteredProposals.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                No {activeTab !== 'all' ? activeTab : ''} proposals found
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredProposals.map(proposal => (
                                    <ProposalCard
                                        key={proposal._id}
                                        proposal={proposal}
                                        jobId={job._id}
                                        onStatusUpdate={handleProposalStatusUpdate}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProposalDetails;