/* eslint-disable */
import type { IJobPost } from "@/models/jobPost";
import { IProposal } from "@/models/proposal";

interface JobData {
    jobPosts: IJobPost[];
}

const url = `${process.env.NEXT_PUBLIC_API_URL}`;

// fetch all active jobs from the API
async function getActiveJobsBySeeker(id: string): Promise<IJobPost[]> {
    const res = await fetch(url + `/job`);
    if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.status}`);
    }
    const data: JobData = await res.json();


    if (!data.jobPosts || !Array.isArray(data.jobPosts)) {
        console.error("Invalid data structure: jobPosts is missing or not an array");
        return [];
    }
    const activeJobsForSeeker = data.jobPosts.filter(job => {

        if (job.status !== "active") return false;
        if (!job.proposals || !Array.isArray(job.proposals)) return false;

        return job.proposals.some((proposal) => {
            if (!proposal.seekerID) return false;
            return proposal.seekerID.toString() === id;
        });
    });

    return activeJobsForSeeker;
}
async function getActiveJobsByPoster(id: string): Promise<IJobPost[]> {
    const res = await fetch(url + `/job`);

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    const data: JobData = await res.json();
    return data.jobPosts.filter((job) => job.status === "active" && job?.posterID?.toString() === id);
}

async function getActiveJobs(): Promise<IJobPost[]> {
    const res = await fetch(url + `/job`);

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    const data: JobData = await res.json();
    return data.jobPosts.filter((job) => job.status === "active");
}


// fetch a job by ID from the API
async function getJobById(id: string): Promise<IJobPost> {
    const res = await fetch(`${url}/job?id=${id}`);

    if (!res.ok) {
        throw new Error("Failed to fetch job with the given ID");
    }

    const response = await res.json();

    if (!response.jobPost) {
        throw new Error("Job post not found in the response");
    }

    return response.jobPost as IJobPost;
}

export { getActiveJobs, getJobById, getActiveJobsByPoster, getActiveJobsBySeeker };