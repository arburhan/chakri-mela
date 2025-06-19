/* eslint-disable */
'use client';

import { getActiveJobsBySeeker } from "@/app/find-work/jobFetch";
import Loading from "@/app/find-work/loading";
import { IJobPost } from "@/models/jobPost";
import { Badge, Button, Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import moment from "moment";
import { useSession } from "next-auth/react";

import { useRouter } from "next/navigation";

import { useEffect, useState } from "react";
import { FaClock, FaMapPin } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { RiWallet2Fill } from "react-icons/ri";

const CurrentApplied = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [isLoading, setIsLoading] = useState(true);
    const [currentJobs, setCurrentJobs] = useState<IJobPost[]>([]);

    const userId = session?.user?.id;

    useEffect(() => {
        const fetchData = async () => {
            if (!userId) return; // Wait for userId to be available
            if (userId) {
                try {
                    const jobs = await getActiveJobsBySeeker(userId.toString());
                    setCurrentJobs(jobs);
                } catch (error) {
                    console.error("Error fetching jobs:", error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        if (status === "loading") {
            setIsLoading(true);
        } else {
            fetchData();
        }
    }, [userId]);

    const getProposalStatus = (proposals: any[], userId: string) => {
        const userProposal = proposals.find(p => p.seekerID.toString() === userId);
        return userProposal?.proposalStatus || "pending";
    };

    const getProposalDetails = (proposals: any[], userId: string) => {
        return proposals.find(p => p.seekerID.toString() === userId);
    };

    if (isLoading) {
        return <Loading />;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Job Applications</h1>
                    <p className="text-gray-500">Track your submitted proposals and their status</p>
                </header>

                {currentJobs.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                        <div className="mb-4 text-gray-400 mx-auto">
                            <FaX className="h-16 w-16 inline-block" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Active Applications</h2>
                        <p className="text-gray-500">Start applying to jobs to see them here</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentJobs.map((job) => {
                            const proposal = getProposalDetails(job.proposals, session?.user?.id!);
                            const status = getProposalStatus(job.proposals, session?.user?.id!);

                            return (
                                <Card
                                    key={job._id}
                                    className="hover:shadow-xl transition-all duration-300 border border-gray-200 bg-stone-800"
                                >
                                    <CardHeader className="pb-4">
                                        <div className="flex justify-between items-start space-x-4 text-white">
                                            <div className="flex-1">
                                                <h2 className="text-md font-bold mb-2 ">
                                                    {job.jobTitle}
                                                </h2>
                                                <div className="flex items-center text-sm ">
                                                    <FaMapPin className="flex-shrink-0 h-4 w-4 mr-1" />
                                                    <span>{job.jobLocation.city}, {job.jobLocation.country}</span>
                                                </div>
                                            </div>
                                            <Badge
                                                variant={
                                                    status === 'accepted' ? 'solid' :
                                                        status === 'rejected' ? 'faded' : 'flat'
                                                }
                                                color={
                                                    status === 'accepted' ? 'success' :
                                                        status === 'rejected' ? 'danger' : 'primary'
                                                }
                                                className="capitalize px-3 py-1 text-sm"
                                            >
                                                {status}
                                            </Badge>
                                        </div>
                                    </CardHeader>

                                    <CardBody className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4 text-sm text-black">
                                            <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                                                <RiWallet2Fill className="h-5 w-5 mr-2 text-blue-600" />
                                                <div>
                                                    <p className="font-medium">Salary</p>
                                                    <p>${job.salaryRange.startRange} - ${job.salaryRange.endRange}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                                                <FaClock className="h-5 w-5 mr-2 text-green-600" />
                                                <div>
                                                    <p className="font-medium">Hours</p>
                                                    <p>{job.workingHour}/week</p>
                                                </div>
                                            </div>
                                        </div>

                                        {proposal && (
                                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                                <h3 className="font-semibold text-gray-900 mb-2">Your Proposal</h3>
                                                <p className="text-gray-600 line-clamp-3 mb-3">{proposal.coverLetter}</p>
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="font-medium">
                                                        Bid: ${proposal.bidAmount}
                                                    </span>
                                                    <span className="text-gray-500">
                                                        {moment(proposal.createdAt).format('MMM D, YYYY')}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex flex-wrap gap-2">
                                            {job.skills.map((skill, index) => (
                                                <Badge
                                                    key={index}
                                                    variant="flat"
                                                    className="px-3 py-1 text-sm font-medium"
                                                >
                                                    📌{skill}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardBody>

                                    <CardFooter className="border-t pt-4">
                                        <div className="w-full flex justify-between items-center">
                                            <span className="text-sm text-gray-500">
                                                Posted {new Date(job.createdAt).toLocaleDateString()}
                                            </span>
                                            <Button
                                                onPress={() => router.push(`/find-work/${job._id}/apply`)}
                                                variant="ghost"
                                                size="sm"
                                                className="text-primary-600 hover:bg-primary-50"
                                            >
                                                View Proposal
                                            </Button>
                                        </div>
                                    </CardFooter>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div >
    );
};

export default CurrentApplied;