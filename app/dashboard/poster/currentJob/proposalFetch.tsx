/* eslint-disable */
import { IProposal } from "@/models/proposal";

const url = `${process.env.NEXT_PUBLIC_API_URL}`;

// Fetch all proposals for a specific job
async function getProposalByID(jobID: string): Promise<IProposal[]> {
    try {
        const res = await fetch(`${url}/proposals?jobID=${jobID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!res.ok) {
            throw new Error("Failed to fetch proposals for this job");
        }

        const data = await res.json();
        return data.proposals || [];
    } catch (error) {
        console.error("Error fetching proposals:", error);
        throw error;
    }
}

// Update proposal status
async function updateProposalStatus(proposalId: string, status: string): Promise<IProposal> {
    try {
        const res = await fetch(`${url}/proposals/status`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ proposalId, status })
        });

        if (!res.ok) {
            throw new Error("Failed to update proposal status");
        }

        const data = await res.json();
        return data.proposal;
    } catch (error) {
        console.error("Error updating proposal status:", error);
        throw error;
    }
}

export { getProposalByID, updateProposalStatus };