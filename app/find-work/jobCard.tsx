/* eslint-disable */
'use client'
import React, { useState, useEffect, useRef } from 'react';
import type { IJobPost } from '@/models/jobPost';
import { FaBriefcase, FaClock, FaHeart } from 'react-icons/fa6';
import moment from 'moment';
import { FaTimes } from 'react-icons/fa';
import { Button } from '@heroui/button';

interface JobCardProps {
    job: IJobPost;
}

const JobCard = ({ job }: JobCardProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    // Open job details modal
    const handleJobView = (jobId: string) => {
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        // console.log(`Viewing job with ID: ${jobId}`);
    };

    // Close job details modal
    const closeModal = () => {
        setIsModalOpen(false);
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    };

    // Toggle favorite status
    const toggleFavorite = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsFavorite(!isFavorite);
        // console.log(`Job ${job._id} ${!isFavorite ? 'added to' : 'removed from'} favorites`);
    };

    // Close modal when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                closeModal();
            }
        };

        if (isModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isModalOpen]);

    // Handle ESC key to close modal
    useEffect(() => {
        const handleEscKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeModal();
            }
        };

        if (isModalOpen) {
            document.addEventListener('keydown', handleEscKey);
        }

        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [isModalOpen]);

    return (
        <>
            {/* Job Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
                    <div>
                        <h3 className="text-xl font-semibold mb-2 text-gray-800">{job.jobTitle}</h3>
                        <p className="text-gray-600 mb-3 flex items-center">
                            <FaBriefcase className="mr-2 h-4 w-4" />
                            {job.jobType}
                        </p>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {job.skills.slice(0, 3).map((skill, index) => (
                                <span key={`${skill}-${index}`} className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                                    {skill}
                                </span>
                            ))}
                            {job.skills.length > 3 && (
                                <span className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
                                    +{job.skills.length - 3} more
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="text-right">
                        <span className="text-green-600 font-semibold text-lg">
                            ${job.salaryRange.startRange} - ${job.salaryRange.endRange}/hr
                        </span>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 flex-wrap gap-4">
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                            <FaClock className="h-4 w-4" />
                            Posted {moment(job.createdAt).fromNow()}
                        </span>
                    </div>
                    <Button onPress={() => handleJobView(job._id)}>View Details</Button>
                </div>
            </div>

            {/* Modal Backdrop */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 flex items-center justify-end">
                    {/* Modal Content */}
                    <div
                        ref={modalRef}
                        className="h-full w-full max-w-md bg-white shadow-xl rounded-l-xl animate-slide-in"
                        style={{
                            animationDuration: '300ms',
                        }}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800">Job Details</h2>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={toggleFavorite}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                    aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
                                >
                                    <FaHeart className={`h-5 w-5 ${isFavorite ? 'text-red-500' : 'text-gray-400'}`} />
                                </button>

                                <button
                                    onClick={closeModal}
                                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                    aria-label="Close"
                                >
                                    <FaTimes className="h-5 w-5 text-gray-500" />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="overflow-y-auto p-6" style={{ maxHeight: 'calc(100vh - 160px)' }}>
                            <div className="mb-6">
                                <h1 className="text-2xl font-bold mb-3 text-gray-800">{job.jobTitle}</h1>
                                <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                                    <span className="flex items-center gap-1">
                                        <FaBriefcase className="h-4 w-4" />
                                        {job.jobType}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FaClock className="h-4 w-4" />
                                        {job.workingHour}h/week
                                    </span>
                                </div>

                                <div className="mb-5 p-3 bg-green-50 rounded-lg">
                                    <span className="text-green-700 font-semibold text-lg">
                                        ${job.salaryRange.startRange} - ${job.salaryRange.endRange}/hr
                                    </span>
                                </div>

                                <div className="mb-5">
                                    <h3 className="font-semibold mb-2 text-gray-700">Required Skills</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {job.skills.map((skill, index) => (
                                            <span key={`${skill}-${index}`} className="bg-blue-50 text-blue-700 text-xs font-medium px-2.5 py-1 rounded-full">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-5">
                                    <h3 className="font-semibold mb-2 text-gray-700">Job Level</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {job.jobLevel.map((level, index) => (
                                            <span key={`${level}-${index}`} className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
                                                {level}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="mb-6">
                                <h3 className="font-semibold mb-3 text-gray-700">Job Description</h3>
                                <div className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
                                    {job.jobDescription}
                                </div>
                            </div>

                            <div className="text-gray-500 text-sm">
                                Posted {moment(job.createdAt).format('MMMM DD, YYYY')}
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="border-t border-gray-200 p-4 bg-white">
                            <Button className='bg-blue-700 w-full mb-10'>Apply Now</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Add keyframe animation to global style */}
            <style jsx global>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out forwards;
        }
      `}</style>
        </>
    );
};

export default JobCard;