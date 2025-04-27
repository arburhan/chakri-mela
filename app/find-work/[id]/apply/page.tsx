/* eslint-disable */
'use client';
import React, { useState, useEffect } from 'react';

import { BreadcrumbItem, Breadcrumbs, Button, Card, CardBody, CardHeader, Chip, Divider, Input, Textarea } from '@heroui/react';
import { BiCategory, BiChevronLeft, BiSend } from 'react-icons/bi';
import { AiFillDollarCircle } from "react-icons/ai";
import { FaClock } from 'react-icons/fa';
import { FaCalendarDays } from 'react-icons/fa6';
import { useParams, useRouter } from 'next/navigation';
import { IJobPost } from '@/models/jobPost';
import { getJobById } from '../../jobFetch';

const SubmitProposal: React.FC = () => {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const jobId = params.id;

    const [jobDetails, setJobDetails] = useState<IJobPost | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [bidAmount, setBidAmount] = useState<string>('');
    const [coverLetter, setCoverLetter] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
            } catch (error) {
                console.error("Failed to fetch job details:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchJobDetails();
    }, [jobId]);

    const handleSubmitProposal = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!bidAmount || !coverLetter) {
            alert("Please fill all required fields.");
            return;
        }

        setIsSubmitting(true);

        try {
            // Create submission data object
            const formData = {
                bidAmount,
                coverLetter,
                jobID: jobId,
            };
            console.log("Form data to be submitted:", formData);

            // Store the form data in state
            setSubmissionData(formData);

            const url = `${process.env.NEXT_PUBLIC_API_URL}/proposal`;

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                alert('Form submitted successfully!');
                // Reset form fields but keep the submission data for display
                setBidAmount('');
                setCoverLetter('');
                //setEstimatedDuration('');
            } else {
                console.log(data.message || 'Submission failed');
                alert("Submission failed: " + (data.message || "Please try again later"));
            }
        } catch (error) {
            console.error("Failed to submit proposal:", error);
            alert("Failed to submit proposal. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumbs */}
            <Breadcrumbs className="mb-6">
                <BreadcrumbItem href="/find-work">Jobs</BreadcrumbItem>
                <BreadcrumbItem href={`/find-work/${jobId}`}>{jobDetails?.jobTitle}</BreadcrumbItem>
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
            {submissionData && (
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
                            <p><strong>Submitted At:</strong> {new Date(submissionData.submittedAt).toLocaleString()}</p>
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
                    <form onSubmit={handleSubmitProposal}>
                        <Card className="mb-8">
                            <CardHeader className="flex justify-between items-center">
                                <h2 className="text-xl font-bold">Proposal Details</h2>
                            </CardHeader>
                            <Divider />
                            <CardBody className="space-y-6">
                                {/* Budget section */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">What is your bid for this project?</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium mb-2">Bid Amount ($)</label>
                                            <Input
                                                type="number"
                                                min="5"
                                                startContent={<AiFillDollarCircle size={16} />}
                                                placeholder="Enter your bid amount"
                                                value={bidAmount}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setBidAmount(e.target.value)}
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
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-2">
                                        Your cover letter is the first thing the client will see. Make sure to introduce yourself, explain how your skills are relevant, and show your enthusiasm for the project.
                                    </p>
                                </div>
                            </CardBody>
                        </Card>

                        <div className="flex justify-end">
                            <Button
                                color="primary"
                                type="submit"
                                endContent={<BiSend size={16} />}
                                isLoading={isSubmitting}
                                className="px-8"
                            >
                                Submit Proposal
                            </Button>
                        </div>
                    </form>
                </div>

                {/* Job Details Sidebar */}
                <div className="lg:col-span-1">
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
                                    {jobDetails?.skills.map((skill, index) => (
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
                </div>
            </div>
        </div>
    );
};

export default SubmitProposal;