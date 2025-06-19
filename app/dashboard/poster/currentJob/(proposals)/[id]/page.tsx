/* eslint-disable */
'use client';

import { getJobById } from "@/app/find-work/jobFetch";
import Loading from "@/app/find-work/loading";
import { HeartFilledIcon } from "@/components/icons";
import { IJobPost, IProposal } from "@/models/jobPost";

import { Button } from "@heroui/button";
import { Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea, useDisclosure } from "@heroui/react";
import moment from "moment";
import { set } from "mongoose";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BiXCircle } from "react-icons/bi";
import { FaCircle } from "react-icons/fa";
import { FcRating } from "react-icons/fc";
import { MdModeComment } from "react-icons/md";


// Define a type for the proposals with added UI state
interface ProposalWithUIState extends IProposal {
    isFavorite: boolean;
    skills?: string[];
}

const ProposalPage = () => {
    const url = process.env.NEXT_PUBLIC_API_URL;
    const { id: jobId } = useParams() as { id: string };
    const [job, setJob] = useState<IJobPost | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [proposals, setProposals] = useState<ProposalWithUIState[]>([]);
    const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const [rating, setRating] = useState<number | null>(null);
    const [comment, setComment] = useState<string>("");
    const [acceptedJobSeekerID, setAcceptedJobSeekerID] = useState<string>('');



    // Calculate total job progress time: 1 day (24 hours) + working hours (in ms)
    const jobProgressTime = (24 + (job?.workingHour ?? 0)) * 60 * 60 * 1000;
    // compare with current date
    const currentDate = new Date();
    const jobStartDate = new Date(job?.createdAt ?? 0);
    const jobEndDate = new Date(jobStartDate.getTime() + jobProgressTime);


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
            if (newStatus === 'accepted') {
                if (proposals[proposalIndex].seekerID) {
                    setAcceptedJobSeekerID(String(proposals[proposalIndex].seekerID));
                }
            }


            // Make API call to update the proposal status
            const response = await fetch(`${url}/job`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jobID: jobId,
                    proposalId: proposalId,
                    proposalStatus: newStatus,
                    hiredAt: newStatus === 'accepted' ? new Date() : null,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update proposal status');
            }

            // Refetch the job to get the latest proposals and status
            const updatedJob = await getJobById(jobId);
            setJob(updatedJob);

            // Update proposals state with the latest proposals from the backend
            if (updatedJob?.proposals && Array.isArray(updatedJob.proposals)) {
                setProposals(
                    updatedJob.proposals.map((proposal: any) => ({
                        ...JSON.parse(JSON.stringify(proposal)),
                        isFavorite: false
                    }))
                );
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

    // Sort proposals - accepted (hired) first, then others
    const sortedProposals = [...proposals].sort((a, b) => {
        if (a.proposalStatus === 'accepted' && b.proposalStatus !== 'accepted') {
            return -1;
        }
        if (a.proposalStatus !== 'accepted' && b.proposalStatus === 'accepted') {
            return 1;
        }
        return 0;
    });

    const markCompleted = async () => {
        try {
            if (!jobId) {
                console.error("Job ID is missing");
                return;
            }

            setStatusUpdateLoading(true);

            const response = await fetch(`${url}/job/complete`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    jobId,
                    seekerID: acceptedJobSeekerID,
                    jobStatus: 'completed',
                    rating: rating,
                    comment: comment,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to mark job as completed');
            }

            // Refetch the job to get the latest status
            const updatedJob = await getJobById(jobId);
            setJob(updatedJob);

        } catch (error) {
            console.error("Error marking job as completed:", error);
            alert("Failed to mark job as completed. Please try again.");
        } finally {
            setStatusUpdateLoading(false);
        }
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

                    {
                        job?.jobStatus === 'in-progress' && currentDate.getTime() >= jobEndDate.getTime() ? (
                            <>
                                <Button onPress={onOpen} size="lg" className="bg-green-500 hover:bg-green-600 text-white my-3">
                                    Mark as Completed
                                </Button>
                                <Modal isOpen={isOpen} placement="top-center" onOpenChange={onOpenChange}>
                                    <ModalContent>
                                        {(onClose) => (
                                            <>
                                                <ModalHeader className="flex flex-col gap-1">Write ratings and comments for the employee.</ModalHeader>
                                                <ModalBody>
                                                    <Input
                                                        min={1}
                                                        max={5}
                                                        endContent={
                                                            <FcRating className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                                        }
                                                        label="Rating (1-5)"
                                                        placeholder="How many stars would you like to give?"
                                                        type="number"
                                                        variant="bordered"
                                                        set-value={rating}
                                                        onChange={(e) => setRating(Number(e.target.value))}

                                                    />
                                                    <Textarea
                                                        endContent={
                                                            <MdModeComment className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                                                        }
                                                        label="Comment"
                                                        placeholder="Write how you liked the employee's work."
                                                        type="password"
                                                        variant="bordered"
                                                        set-value={comment}
                                                        onChange={(e) => setComment(e.target.value)}
                                                    />
                                                    <p>If you do not give any rating, the employee will receive a rating of <span className="text-yellow-300">4</span> , but you <span className="text-red-500" >must click the Complete button</span> .</p>
                                                </ModalBody>
                                                <ModalFooter>

                                                    <Button color="danger" variant="flat" onPress={onClose}>
                                                        Close
                                                    </Button>
                                                    <Button
                                                        color="primary"
                                                        onPress={() => {
                                                            onClose();
                                                            markCompleted();
                                                        }}
                                                    >
                                                        Complete
                                                    </Button>
                                                </ModalFooter>
                                            </>
                                        )}
                                    </ModalContent>
                                </Modal>
                            </>

                        ) : (
                            job?.jobStatus === 'completed' ? (
                                <p className="text-green-600 font-semibold">Thanks! Job is completed.</p>
                            ) : (
                                <p className="text-black">Job on progress</p>

                            ))
                    }
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
                    <div>
                        {/* Hired Proposals Section */}
                        {sortedProposals.some(p => p.proposalStatus === 'accepted') && (
                            <>
                                <h3 className="text-xl font-semibold text-green-700 mb-4">Hired Proposals</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    {sortedProposals
                                        .filter(proposal => proposal.proposalStatus === 'accepted')
                                        .map((proposal, index) => {

                                            // Find the original index in the proposals array
                                            const originalIndex = proposals.findIndex(p => p._id === proposal._id);
                                            return (
                                                <div
                                                    key={proposal._id.toString()}
                                                    className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border-l-4 border-green-500"
                                                >
                                                    <div className="p-6">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h3 className="text-lg font-bold text-gray-800">Bid Amount: ${proposal.bidAmount}</h3>
                                                            </div>
                                                            <button
                                                                onClick={() => toggleFavorite(originalIndex)}
                                                                className={`p-2 rounded-full ${proposal.isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                                                            >
                                                                <HeartFilledIcon fill={proposal.isFavorite ? 'currentColor' : 'none'} />
                                                            </button>
                                                        </div>
                                                        <p className="text-black">Cover Letter:</p>
                                                        <p className="mt-4 text-gray-600 line-clamp-3">{proposal.coverLetter}</p>

                                                        <div className="mt-6 flex flex-wrap gap-2">
                                                            {proposal?.skills?.map((skill: string, i: number) => (
                                                                <span key={i} className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-medium rounded-full">
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>

                                                        <p className="mt-4 text-black">Hired at: <span className="text-green-700">{proposal.hiredAt ? moment(proposal.hiredAt).format('MMMM Do YYYY, h:mm a') : 'N/A'}</span></p>

                                                        {/*    <div className="mt-4 flex justify-center">
                                                            {job?.jobStatus === 'completed' && (
                                                                <Button size="lg">Review</Button>
                                                            )}
                                                        </div> */}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </>
                        )}

                        {/* Non-Hired Proposals Section */}
                        {sortedProposals.some(p => p.proposalStatus !== 'accepted') && (
                            <>
                                <h3 className="text-xl font-semibold text-gray-700 mb-4">Other Proposals</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {sortedProposals
                                        .filter(proposal => proposal.proposalStatus !== 'accepted')
                                        .map((proposal, index) => {
                                            // Find the original index in the proposals array
                                            const originalIndex = proposals.findIndex(p => p._id === proposal._id);
                                            return (
                                                <div
                                                    key={proposal._id.toString()}
                                                    className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg border-l-4 ${proposal.proposalStatus === 'rejected'
                                                        ? 'border-red-500'
                                                        : proposal.proposalStatus === 'pending'
                                                            ? 'border-yellow-500'
                                                            : 'border-indigo-500'
                                                        }`}
                                                >
                                                    <div className="p-6">
                                                        <div className="flex justify-between items-start">
                                                            <div>
                                                                <h3 className="text-lg font-bold text-gray-800">Bid Amount: ${proposal.bidAmount}</h3>
                                                            </div>
                                                            <button
                                                                onClick={() => toggleFavorite(originalIndex)}
                                                                className={`p-2 rounded-full ${proposal.isFavorite ? 'text-red-500' : 'text-gray-400 hover:text-red-500'}`}
                                                            >
                                                                <HeartFilledIcon fill={proposal.isFavorite ? 'currentColor' : 'none'} />
                                                            </button>
                                                        </div>
                                                        <p className="text-black">Cover Letter:</p>
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
                                                                    onClick={() => handleStatusChange(originalIndex, 'accepted')}
                                                                    disabled={statusUpdateLoading}
                                                                    className={`px-3 py-1 rounded-md text-sm font-medium ${proposal.proposalStatus === 'accepted'
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : 'bg-gray-100 text-gray-800 hover:bg-green-50'
                                                                        }`}
                                                                >
                                                                    <FaCircle className="inline mr-1" size={8} />
                                                                    Accept
                                                                </button>
                                                                <button
                                                                    onClick={() => handleStatusChange(originalIndex, 'rejected')}
                                                                    disabled={statusUpdateLoading}
                                                                    className={`px-3 py-1 rounded-md text-sm font-medium ${proposal.proposalStatus === 'rejected'
                                                                        ? 'bg-red-100 text-red-800'
                                                                        : 'bg-gray-100 text-gray-800 hover:bg-red-50'
                                                                        }`}
                                                                >
                                                                    <BiXCircle className="inline mr-1" size={12} />
                                                                    Reject
                                                                </button>
                                                                <button
                                                                    onClick={() => handleStatusChange(originalIndex, 'pending')}
                                                                    disabled={statusUpdateLoading}
                                                                    className={`px-3 py-1 rounded-md text-sm font-medium ${proposal.proposalStatus === 'pending'
                                                                        ? 'bg-yellow-100 text-yellow-800'
                                                                        : 'bg-gray-100 text-gray-800 hover:bg-yellow-50'
                                                                        }`}
                                                                >
                                                                    <FaCircle className="inline mr-1" size={8} />
                                                                    Pending
                                                                </button>
                                                            </div>
                                                            <span
                                                                className={`px-3 py-1 rounded-full text-xs font-medium ${proposal.proposalStatus === 'rejected'
                                                                    ? 'bg-red-100 text-red-800'
                                                                    : proposal.proposalStatus === 'pending'
                                                                        ? 'bg-yellow-100 text-yellow-800'
                                                                        : 'bg-gray-100 text-gray-800'
                                                                    }`}
                                                            >
                                                                {proposal.proposalStatus}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                </div>
                            </>
                        )}
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