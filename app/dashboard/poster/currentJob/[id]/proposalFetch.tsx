/* eslint-disable */
import { IProposal } from "@/models/proposal";

const url = `${process.env.NEXT_PUBLIC_API_URL}`;


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

export { updateProposalStatus };