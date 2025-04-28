/* eslint-disable */
'use client';
import { IProposal } from '@/models/proposal';
import { Button } from '@heroui/react';
import React, { useState } from 'react';
import { updateProposalStatus } from '../proposalFetch';

interface ProposalCardProps {
    proposal: IProposal;
    jobId: string;
    onStatusUpdate?: (proposalId: string, newStatus: string) => void;
}

const ProposalCard = ({ proposal, jobId, onStatusUpdate }: ProposalCardProps) => {
    const [status, setStatus] = useState(proposal.status || 'pending');
    const [isLoading, setIsLoading] = useState(false);

    // Format date for better readability
    const formatDate = (dateString: string | Date) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const handleStatusChange = async (newStatus: string) => {
        if (status === newStatus) return;

        setIsLoading(true);
        try {
            await updateProposalStatus(proposal._id, newStatus);
            setStatus(newStatus);

            // Notify parent component if callback provided
            if (onStatusUpdate) {
                onStatusUpdate(proposal._id, newStatus);
            }
        } catch (error) {
            console.error('Error updating proposal status:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Get user info safely
    const userName = proposal.seekerID && (proposal.seekerID as any).name
        ? (proposal.seekerID as any).name
        : 'Anonymous User';

    const profilePicture = proposal.seekerID && (proposal.seekerID as any).profilePicture
        ? (proposal.seekerID as any).profilePicture
        : null;

    return (
        <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                        {profilePicture ? (
                            <img src={profilePicture} alt={userName} className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-gray-500">👤</span>
                        )}
                    </div>
                    <div>
                        <h3 className="font-medium">{userName}</h3>
                        <p className="text-xs text-gray-500">Applied {formatDate(proposal.createdAt)}</p>
                    </div>
                </div>

                <div className="text-right">
                    <p className="font-bold">${proposal.bidAmount}/hr</p>
                    <span className={`px-2 py-1 text-xs rounded-full ${status === 'shortlisted' ? 'bg-green-100 text-green-800' :
                            status === 'rejected' ? 'bg-red-100 text-red-800' :
                                'bg-blue-100 text-blue-800'
                        }`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </span>
                </div>
            </div>

            <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Cover Letter</h4>
                <p className="text-gray-600">{proposal.coverLetter}</p>
            </div>

            <div className="flex space-x-2">
                <Button
                    color={status === 'shortlisted' ? 'success' : 'primary'}
                    size="sm"
                    onPress={() => handleStatusChange('shortlisted')}
                    className="flex-1"
                    disabled={isLoading || status === 'shortlisted'}
                >
                    {status === 'shortlisted' ? 'Shortlisted' : 'Shortlist'}
                </Button>
                <Button
                    color={status === 'rejected' ? 'danger' : 'default'}
                    size="sm"
                    onPress={() => handleStatusChange('rejected')}
                    className="flex-1"
                    disabled={isLoading || status === 'rejected'}
                >
                    {status === 'rejected' ? 'Rejected' : 'Reject'}
                </Button>
                <Button
                    variant="bordered"
                    size="sm"
                    onPress={() => console.log('View profile')}
                >
                    Profile
                </Button>
            </div>
        </div>
    );
};

export default ProposalCard;