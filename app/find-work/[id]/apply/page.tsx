/* eslint-disable */
'use client';
import React, { useState, useEffect, Suspense } from 'react';

import { BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, CardHeader, Chip, Divider, Input, Textarea, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@heroui/react';
import { BiCategory, BiChevronLeft, BiSend, BiEdit } from 'react-icons/bi';
import { AiFillDollarCircle } from "react-icons/ai";
import { FaClock } from 'react-icons/fa';
import { FaCalendarDays } from 'react-icons/fa6';
import { MdDelete } from 'react-icons/md';
import { useParams, useRouter } from 'next/navigation';
import { IJobPost } from '@/models/jobPost';
import { getJobById } from '../../jobFetch';
import { useSession } from 'next-auth/react';
import moment from 'moment';
import SingleDetailsLoading from './singleDetailsLoading';



// JobDetails component to be loaded with Suspense
interface JobDetailsProps {
    jobDetails: IJobPost | null;
}

const JobDetails: React.FC<JobDetailsProps> = ({ jobDetails }) => {
    if (!jobDetails) return null;

    return (
        <Card className="sticky top-8">
            <CardHeader>
                <h3 className="text-lg font-bold">Job Details</h3>
            </CardHeader>
            <Divider />
            <CardBody className="space-y-4">
                <h4 className="text-base font-medium">{jobDetails?.jobTitle}</h4>

                <div className="text-sm line-clamp-3">
                    {jobDetails?.jobDescription}
                </div>

                <div className="flex items-center gap-2">
                    <AiFillDollarCircle size={16} />
                    <span className="font-medium">
                        {jobDetails?.salaryRange.startRange} - {jobDetails?.salaryRange.endRange} USD/hrs
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <FaClock size={16} />
                    <span>Total working Hour: {jobDetails?.workingHour} hrs</span>
                </div>

                <div className="flex items-center gap-2">
                    <FaCalendarDays size={16} />
                    <span>Posted: {moment(jobDetails?.createdAt).format('MMMM Do YYYY, h:mm a')} </span>
                </div>
                <div className="flex items-center gap-2">
                    <BiCategory />
                    <span className="font-medium">Category: {jobDetails?.jobCategory} </span>
                </div>

                <div>
                    <p className="text-sm font-medium mb-2">Skills</p>
                    <div className="flex flex-wrap gap-2">
                        {jobDetails?.skills.map((skill: string, index: number) => (
                            <Chip key={index} variant="flat" size="sm">{skill}</Chip>
                        ))}
                    </div>
                </div>

                <div>
                    <p className="text-sm font-medium mb-2">Client Info</p>
                    <div className="text-sm space-y-1">
                        {/* Client info would go here */}
                    </div>
                </div>

                <Divider />

                <div className="flex justify-between items-center">
                    <span>Proposals</span>
                    {/* Proposal count would go here */}
                </div>
            </CardBody>
        </Card>
    );
};

const SubmitProposal: React.FC = () => {
    const { data: session } = useSession();
    const userID = session?.user?.id;

    const router = useRouter();
    const params = useParams<{ id: string }>();
    const jobId = params.id;
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [jobDetails, setJobDetails] = useState<IJobPost | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [bidAmount, setBidAmount] = useState<string>('');
    const [coverLetter, setCoverLetter] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [successMessage, setSuccessMessage] = useState<string>('');

    // State to store existing proposal if user has already applied
    const [existingProposal, setExistingProposal] = useState<any>(null);
    const [hasApplied, setHasApplied] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isWithdrawing, setIsWithdrawing] = useState<boolean>(false);

    // Add a key for tracking page refreshes
    const [refreshKey, setRefreshKey] = useState<number>(0);

    // Fetch job details
    useEffect(() => {
        if (!jobId) return;

        const fetchJobDetails = async () => {
            setIsLoading(true);
            try {
                const response = await getJobById(jobId as string);
                setJobDetails(response);
            } catch (error) {
                console.error("Failed to fetch job details:", error);
                setError("Failed to load job details. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobDetails();
    }, [jobId, refreshKey]); // Added refreshKey to dependency array

    // Check if the user has an existing proposal
    useEffect(() => {
        if (userID && jobDetails) {
            const seekerProposal = jobDetails?.proposals?.find((proposal) => proposal?.seekerID?.toString() === userID);

            if (seekerProposal) {
                setHasApplied(true);
                setExistingProposal(seekerProposal);
                setBidAmount(seekerProposal?.bidAmount?.toString() || '');
                setCoverLetter(seekerProposal?.coverLetter || '');
            } else {
                setHasApplied(false);
                setExistingProposal(null);
            }
        }
    }, [userID, jobDetails]);

    const handleSubmitProposal = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!bidAmount || !coverLetter) {
            setError("Please fill all required fields.");
            return;
        }

        // Convert bidAmount to a number before validation and submission
        const bidAmountNum = Number(bidAmount);

        if (isNaN(bidAmountNum)) {
            setError("Bid amount must be a valid number.");
            return;
        }

        // Check if bid amount is within range
        if (jobDetails) {
            if (bidAmountNum < jobDetails.salaryRange.startRange || bidAmountNum > jobDetails.salaryRange.endRange) {
                setError(`Bid amount must be between ${jobDetails.salaryRange.startRange} and ${jobDetails.salaryRange.endRange}`);
                return;
            }
        }

        setIsSubmitting(true);

        try {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/job`;
            let method = 'POST';
            let formData: any = {
                bidAmount: bidAmountNum,
                coverLetter,
                jobID: jobId,
            };

            // If editing existing proposal
            if (isEditing && existingProposal) {
                method = 'PUT';
                formData = {
                    ...formData,
                    proposalId: existingProposal._id
                };
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // Update UI based on whether it was a new submission or edit
                if (isEditing) {
                    setSuccessMessage('Proposal updated successfully!');
                    // Update existing proposal with new data
                    setExistingProposal(data.proposal);
                } else {
                    setSuccessMessage('Proposal submitted successfully!');
                    setExistingProposal(data.proposal);
                }

                setHasApplied(true);
                setIsEditing(false);

                // Refresh the data to ensure everything is in sync
                setRefreshKey(prev => prev + 1);
            } else {
                setError(data.error || 'Submission failed. Please try again.');
            }
        } catch (error) {
            console.error("Failed to submit proposal:", error);
            setError("Failed to submit proposal. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditProposal = () => {
        setIsEditing(true);
        setError('');
        setSuccessMessage('');
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        // Reset form values to existing proposal values
        if (existingProposal) {
            setBidAmount(existingProposal.bidAmount.toString());
            setCoverLetter(existingProposal.coverLetter);
        }
        setError('');
        setSuccessMessage('');
    };

    const handleWithdrawProposal = async () => {
        if (!existingProposal?._id) {
            setError("Cannot find proposal to withdraw.");
            onClose();
            return;
        }

        setIsWithdrawing(true);

        try {
            // Update the URL to include both jobID and proposalId
            const url = `${process.env.NEXT_PUBLIC_API_URL}/job?jobID=${jobId}&proposalId=${existingProposal._id}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                // Clear user proposal state
                setHasApplied(false);
                setExistingProposal(null);
                // Reset form fields for new submission
                setBidAmount('');
                setCoverLetter('');
                setSuccessMessage('Proposal withdrawn successfully!');
                onClose();
                // Refresh the job details to update the UI
                setRefreshKey(prev => prev + 1);
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to withdraw proposal. Please try again.');
            }
        } catch (error) {
            console.error("Failed to withdraw proposal:", error);
            setError("Failed to withdraw proposal. Please try again.");
        } finally {
            setIsWithdrawing(false);
        }
    };

    // Show notification at the top when user has already applied
    const renderApplicationStatus = () => {
        if (!hasApplied) return null;

        return (
            <Card className="mb-6 bg-green-50 border border-green-200">
                <CardBody>
                    <div className="flex items-center">
                        <div className="mr-3">
                            <div className="bg-green-100 p-2 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium text-green-800">You've already applied to this job</h3>
                            <p className="text-sm text-green-600">
                                You can view, edit or withdraw your proposal below
                            </p>
                        </div>
                    </div>
                </CardBody>
            </Card>
        );
    };

    const renderSubmissionForm = () => (
        <form onSubmit={handleSubmitProposal}>
            <Card className="mb-8">
                <CardHeader className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">
                        {isEditing ? 'Edit Proposal' : hasApplied ? 'Your Proposal' : 'Submit Proposal'}
                    </h2>
                    {hasApplied && !isEditing && (
                        <div className="flex gap-2">
                            <Button
                                color="primary"
                                variant="flat"
                                startContent={<BiEdit size={16} />}
                                onPress={handleEditProposal}
                            >
                                Edit
                            </Button>
                            <Button
                                color="danger"
                                variant="flat"
                                startContent={<MdDelete size={16} />}
                                onPress={onOpen}
                            >
                                Withdraw
                            </Button>
                        </div>
                    )}
                    {isEditing && (
                        <Button
                            color="default"
                            variant="light"
                            onPress={handleCancelEdit}
                        >
                            Cancel
                        </Button>
                    )}
                </CardHeader>
                <Divider />
                <CardBody className="space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}
                    {successMessage && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
                            {successMessage}
                        </div>
                    )}

                    {/* Bid amount section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">What is your bid for this project?</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Bid Amount ($)
                                    {jobDetails && (
                                        <span className="text-xs text-gray-500 ml-2">
                                            Range: ${jobDetails.salaryRange.startRange} - ${jobDetails.salaryRange.endRange}
                                        </span>
                                    )}
                                </label>
                                <Input
                                    type="number"
                                    min={jobDetails?.salaryRange.startRange || 5}
                                    max={jobDetails?.salaryRange.endRange || 100}
                                    startContent={<AiFillDollarCircle size={16} />}
                                    placeholder="Enter your bid amount"
                                    value={bidAmount}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBidAmount(e.target.value)}
                                    isDisabled={hasApplied && !isEditing}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Cover Letter */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Cover Letter</h3>
                        <Textarea
                            placeholder="Introduce yourself and explain why you're a good fit for this project"
                            minRows={8}
                            value={coverLetter}
                            onChange={(e) => setCoverLetter((e.target as unknown as HTMLTextAreaElement).value)}
                            isDisabled={hasApplied && !isEditing}
                            required
                        />
                        <p className="text-xs text-gray-500 mt-2">
                            Your cover letter is the first thing the client will see. Make sure to introduce yourself, explain how your skills are relevant, and show your enthusiasm for the project.
                        </p>
                    </div>

                    {/* If user has already applied and not editing, show application info */}
                    {hasApplied && !isEditing && (
                        <div className="border-t pt-4 mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Submitted on</p>
                                    <p className="font-medium">
                                        {moment(existingProposal?.createdAt).format('MMMM Do YYYY, h:mm a')}
                                    </p>
                                </div>
                                {existingProposal?.updatedAt && existingProposal?.updatedAt !== existingProposal?.createdAt && (
                                    <div>
                                        <p className="text-sm text-gray-500">Last updated</p>
                                        <p className="font-medium">{new Date(existingProposal?.updatedAt).toLocaleString()}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </CardBody>
            </Card>

            {/* Show the submit/update button only when appropriate */}
            {(!hasApplied || isEditing) && (
                <div className="flex justify-end gap-2">
                    {isEditing && (
                        <Button
                            color="default"
                            variant="flat"
                            onPress={handleCancelEdit}
                        >
                            Cancel
                        </Button>
                    )}
                    <Button
                        color="primary"
                        type="submit"
                        endContent={<BiSend size={16} />}
                        isLoading={isSubmitting}
                        className="px-8"
                    >
                        {isEditing ? 'Update Proposal' : 'Submit Proposal'}
                    </Button>
                </div>
            )}
        </form>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumbs */}
            <Breadcrumbs className="mb-6">
                <BreadcrumbItem href="/find-work">Jobs</BreadcrumbItem>
                <BreadcrumbItem href={`/find-work/${jobId}`}>{jobDetails?.jobTitle || "Job Details"}</BreadcrumbItem>
                <BreadcrumbItem>{hasApplied ? "Your Proposal" : "Submit Proposal"}</BreadcrumbItem>
            </Breadcrumbs>

            {/* Back button */}
            <Button
                variant="light"
                startContent={<BiChevronLeft size={16} />}
                className="mb-6"
                onPress={() => router.back()}
            >
                Back to Job
            </Button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main content */}
                <Suspense fallback={<SingleDetailsLoading />}>
                    <div className="lg:col-span-2">
                        {renderApplicationStatus()}

                        {/* Show proposal form/details */}
                        {renderSubmissionForm()}
                    </div>

                    {/* Job Details Sidebar with Suspense */}
                    <div className="lg:col-span-1">
                        <JobDetails jobDetails={jobDetails} />
                    </div>
                </Suspense>
            </div>

            {/* Confirmation Modal for Withdrawing Proposal */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    <ModalHeader>Confirm Withdrawal</ModalHeader>
                    <ModalBody>
                        <p>Are you sure you want to withdraw your proposal? This action cannot be undone.</p>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="default" variant="light" onPress={onClose}>
                            Cancel
                        </Button>
                        <Button
                            color="danger"
                            onPress={handleWithdrawProposal}
                            isLoading={isWithdrawing}
                        >
                            Withdraw Proposal
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
};

export default SubmitProposal;