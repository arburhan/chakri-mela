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
                    <span>Posted {new Date(jobDetails?.createdAt || '').toLocaleDateString()}</span>
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

// Loading fallback for JobDetails
const JobDetailsLoading = () => (
    <Card className="sticky top-8 animate-pulse">
        <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </CardHeader>
        <Divider />
        <CardBody className="space-y-4">
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
            <div className="h-16 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/5"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div>
                <div className="h-4 bg-gray-200 rounded w-1/6 mb-2"></div>
                <div className="flex flex-wrap gap-2">
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="h-6 bg-gray-200 rounded w-24"></div>
                </div>
            </div>
        </CardBody>
    </Card>
);

const SubmitProposal: React.FC = () => {
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

    // State to store form submission data
    const [submissionData, setSubmissionData] = useState<any>(null);

    // Fetch job details
    useEffect(() => {
        if (!jobId) return;

        const fetchJobDetails = async () => {
            setIsLoading(true);
            try {
                const response = await getJobById(jobId as string);
                setJobDetails(response);

                // Check if user has already applied
                await checkProposalStatus();
            } catch (error) {
                console.error("Failed to fetch job details:", error);
                setError("Failed to load job details. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobDetails();
    }, [jobId]);

    const checkProposalStatus = async () => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/proposal?jobID=${jobId}`;
            const response = await fetch(url);
            const data = await response.json();

            if (response.ok && data.hasApplied) {
                setHasApplied(true);
                setExistingProposal(data.proposal);
                setBidAmount(data.proposal.bidAmount.toString());
                setCoverLetter(data.proposal.coverLetter);
            }
        } catch (error) {
            console.error("Failed to check proposal status:", error);
        }
    };

    const handleSubmitProposal = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');

        if (!bidAmount || !coverLetter) {
            setError("Please fill all required fields.");
            return;
        }

        // Check if bid amount is within range
        if (jobDetails) {
            const bidAmountNum = Number(bidAmount);
            if (bidAmountNum < jobDetails.salaryRange.startRange || bidAmountNum > jobDetails.salaryRange.endRange) {
                setError(`Bid amount must be between ${jobDetails.salaryRange.startRange} and ${jobDetails.salaryRange.endRange}`);
                return;
            }
        }

        setIsSubmitting(true);

        try {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/proposal`;
            let method = 'POST';
            let formData: any = {
                bidAmount,
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
                    setExistingProposal(data.proposal);
                } else {
                    setSuccessMessage('Proposal submitted successfully!');
                    setSubmissionData(formData);
                    setHasApplied(true);
                    setExistingProposal(data.proposal);
                }

                setIsEditing(false);
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

    const handleWithdrawProposal = async () => {
        try {
            const url = `${process.env.NEXT_PUBLIC_API_URL}/proposal?proposalId=${existingProposal._id}`;
            const response = await fetch(url, { method: 'DELETE' });

            if (response.ok) {
                setHasApplied(false);
                setExistingProposal(null);
                setBidAmount('');
                setCoverLetter('');
                setSubmissionData(null);
                setSuccessMessage('Proposal withdrawn successfully!');
                onClose(); // Close the confirmation modal
            } else {
                const data = await response.json();
                setError(data.error || 'Failed to withdraw proposal. Please try again.');
            }
        } catch (error) {
            console.error("Failed to withdraw proposal:", error);
            setError("Failed to withdraw proposal. Please try again.");
        }
    };

    const renderSubmissionForm = () => (
        <form onSubmit={handleSubmitProposal}>
            <Card className="mb-8">
                <CardHeader className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">
                        {isEditing ? 'Edit Proposal' : 'Proposal Details'}
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

                    {/* Budget section */}
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
                </CardBody>
            </Card>

            {(!hasApplied || isEditing) && (
                <div className="flex justify-end">
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

    const renderSubmissionDetails = () => {
        // This would show if a user has already submitted and is viewing their submission
        if (!hasApplied || isEditing) return null;

        return (
            <Card className="mb-8 bg-blue-50">
                <CardHeader className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-blue-700">Your Proposal</h2>
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
                </CardHeader>
                <CardBody>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-semibold text-blue-700">Bid Amount</h3>
                            <p className="text-lg font-bold text-black">${existingProposal?.bidAmount}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-blue-700">Cover Letter</h3>
                            <p className="whitespace-pre-line text-black">{existingProposal?.coverLetter}</p>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-blue-700">Submitted On</h3>
                            <p className='text-black'>{new Date(existingProposal?.createdAt).toLocaleString()}</p>
                        </div>

                        {existingProposal?.updatedAt && existingProposal?.updatedAt !== existingProposal?.createdAt && (
                            <div>
                                <h3 className="text-sm font-semibold text-blue-700">Last Updated</h3>
                                <p>{new Date(existingProposal?.updatedAt).toLocaleString()}</p>
                            </div>
                        )}
                    </div>
                </CardBody>
            </Card>
        );
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumbs */}
            <Breadcrumbs className="mb-6">
                <BreadcrumbItem href="/find-work">Jobs</BreadcrumbItem>
                <BreadcrumbItem href={`/find-work/${jobId}`}>{jobDetails?.jobTitle || "Job Details"}</BreadcrumbItem>
                <BreadcrumbItem>Submit Proposal</BreadcrumbItem>
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

            {/* Display submission data if available */}
            {submissionData && !isEditing && (
                <Card className="mb-8 bg-green-50">
                    <CardHeader className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-green-700">Proposal Submitted Successfully</h2>
                    </CardHeader>
                    <CardBody>
                        <div className="space-y-2">
                            <p><strong>Bid Amount:</strong> ${submissionData.bidAmount}</p>
                            <p><strong>Cover Letter:</strong> {submissionData.coverLetter}</p>
                            {submissionData.estimatedDuration && (
                                <p><strong>Estimated Duration:</strong> {submissionData.estimatedDuration}</p>
                            )}
                            <p><strong>Submitted At:</strong> {new Date().toLocaleString()}</p>
                        </div>
                        <div className="mt-4">
                            <Button
                                color="primary"
                                onPress={() => router.push('/dashboard/proposals')}
                            >
                                Go to My Proposals
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main content */}
                <div className="lg:col-span-2">
                    {isLoading ? (
                        <Card className="mb-8 animate-pulse">
                            <CardHeader>
                                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                            </CardHeader>
                            <Divider />
                            <CardBody className="space-y-6">
                                <div>
                                    <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                                            <div className="h-10 bg-gray-200 rounded w-full"></div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
                                    <div className="h-32 bg-gray-200 rounded w-full"></div>
                                </div>
                            </CardBody>
                        </Card>
                    ) : (
                        <>
                            {renderSubmissionDetails()}
                            {renderSubmissionForm()}
                        </>
                    )}
                </div>

                {/* Job Details Sidebar with Suspense */}
                <div className="lg:col-span-1">
                    <Suspense fallback={<JobDetailsLoading />}>
                        <JobDetails jobDetails={jobDetails} />
                    </Suspense>
                </div>
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