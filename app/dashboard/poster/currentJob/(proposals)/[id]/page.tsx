/* eslint-disable */
'use client';

import { getJobById } from "@/app/find-work/jobFetch";
import Loading from "@/app/find-work/loading";
import { HeartFilledIcon } from "@/components/icons";
import { IJobPost } from "@/models/jobPost"; // Update import to include IProposal
import { IProposal } from "@/models/proposal";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BiXCircle } from "react-icons/bi";
import { FaCircle } from "react-icons/fa";

// Define a type for the proposals with added UI state
interface ProposalWithUIState extends IProposal {
    isFavorite: boolean;
    skills?: string[]; // Add the skills property as an optional array of strings
}

const ProposalPage = () => {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const { id: jobId } = useParams() as { id: string };
    const [job, setJob] = useState<IJobPost | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [proposals, setProposals] = useState<ProposalWithUIState[]>([]);
    const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                if (!jobId) {
                    console.error("Job ID is missing");
                    setIsLoading(false);
                    return;
                }
                const singleJob = await getJobById(jobId);
                setJob(singleJob);

                // Initialize with UI state
                if (singleJob?.proposals && Array.isArray(singleJob.proposals)) {
                    setProposals(
                        singleJob.proposals.map((proposal: any) => ({
                            ...JSON.parse(JSON.stringify(proposal)),
                            isFavorite: false
                        }))
                    );
                }
            } catch (error) {
                console.error("Error fetching job:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchJob();
    }, [jobId]);

    const handleStatusChange = async (proposalIndex: number, newStatus: string) => {
        try {
            // Get the proposal ID from the proposals array
            const proposalId = proposals[proposalIndex]._id;

            if (!proposalId) {
                console.error("Proposal ID is missing");
                return;
            }

            // Set loading state
            setStatusUpdateLoading(true);

            // Make API call to update the proposal status
            const response = await fetch(`${url}/job`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jobID: jobId,
                    proposalId: proposalId,
                    status: newStatus
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update proposal status');
            }

            // Update the local state with the response data
            if (newStatus === 'accepted') {
                // If a proposal is accepted, update all proposals to reflect their new statuses
                setProposals(prev => prev.map(proposal => {
                    if (proposal._id.toString() === proposalId.toString()) {
                        return { ...proposal, status: 'accepted' } as ProposalWithUIState;
                    } else {
                        return { ...proposal, status: 'rejected' } as ProposalWithUIState;
                    }
                }));
            } else {
                // For rejected or pending, only update the specific proposal
                setProposals(prev => prev.map((proposal, i) =>
                    i === proposalIndex ? { ...proposal, status: newStatus } as ProposalWithUIState : proposal
                ));
            }

        } catch (error) {
            console.error("Error updating proposal status:", error);
            alert("Failed to update proposal status. Please try again.");
        } finally {
            setStatusUpdateLoading(false);
        }
    };

    const toggleFavorite = (index: number) => {
        setProposals(prev => prev.map((proposal, i) =>
            i === index ? { ...proposal, isFavorite: !proposal.isFavorite } as ProposalWithUIState : proposal
        ));
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-indigo-700 mb-2">Job Details</h1>
                <div className="bg-white p-6 rounded-xl shadow-md mb-8">
                    <h2 className="text-xl font-semibold text-gray-800">{job?.jobTitle}</h2>
                    <p className="text-gray-600 mt-2">{job?.jobDescription}</p>
                </div>

                <h2 className="text-2xl font-bold text-indigo-700 mb-6">Proposals ({proposals.length})</h2>

                {statusUpdateLoading && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg">
                            <p className="text-lg">Updating proposal status...</p>
                        </div>
                    </div>
                )}

                {proposals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {proposals.map((proposal, index) => (
                            <div
                                key={proposal._id.toString()}
                                className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border-l-4 ${proposal.status === 'accepted'
                                    ? 'border-green-500'
                                    : proposal.status === 'rejected'
                                        ? 'border-red-500'
                                        : proposal.status === 'pending'
                                            ? 'border-yellow-500'
                                            : 'border-indigo-500'
                                    }`}
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-800">${proposal.bidAmount}</h3>
                                            <p className="text-indigo-600">7 days delivery</p>
                                        </div>
                                        <button
                                            onClick={() => toggleFavorite(index)}
                                            className={`p-2 rounded-full ${proposal.isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                                        >
                                            <HeartFilledIcon fill={proposal.isFavorite ? 'currentColor' : 'none'} />
                                        </button>
                                    </div>

                                    <p className="mt-4 text-gray-600 line-clamp-3">{proposal.coverLetter}</p>

                                    <div className="mt-6 flex flex-wrap gap-2">
                                        {proposal?.skills?.map((skill: string, i: number) => (
                                            <span key={i} className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="mt-6 flex items-center justify-between">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleStatusChange(index, 'accepted')}
                                                disabled={statusUpdateLoading}
                                                className={`px-3 py-1 rounded-md text-sm font-medium ${proposal.status === 'accepted'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-gray-100 text-gray-800 hover:bg-green-50'
                                                    }`}
                                            >
                                                <FaCircle className="inline mr-1" size={8} />
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(index, 'rejected')}
                                                disabled={statusUpdateLoading}
                                                className={`px-3 py-1 rounded-md text-sm font-medium ${proposal.status === 'rejected'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-gray-100 text-gray-800 hover:bg-red-50'
                                                    }`}
                                            >
                                                <BiXCircle className="inline mr-1" size={12} />
                                                Reject
                                            </button>
                                            <button
                                                onClick={() => handleStatusChange(index, 'pending')}
                                                disabled={statusUpdateLoading}
                                                className={`px-3 py-1 rounded-md text-sm font-medium ${proposal.status === 'pending'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-gray-100 text-gray-800 hover:bg-yellow-50'
                                                    }`}
                                            >
                                                <FaCircle className="inline mr-1" size={8} />
                                                Pending
                                            </button>
                                        </div>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${proposal.status === 'accepted'
                                                ? 'bg-green-100 text-green-800'
                                                : proposal.status === 'rejected'
                                                    ? 'bg-red-100 text-red-800'
                                                    : proposal.status === 'pending'
                                                        ? 'bg-yellow-100 text-yellow-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                }`}
                                        >
                                            {proposal.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                        <div className="mx-auto h-24 w-24 text-gray-400 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">No proposals yet</h3>
                        <p className="mt-1 text-gray-500">Your job hasn't received any proposals yet. Check back later!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProposalPage;