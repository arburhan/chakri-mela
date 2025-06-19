/* eslint-disable */
import type { IJobPost } from "@/models/jobPost";


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

        if (job.jobStatus !== "active") return false;
        if (!job.proposals || !Array.isArray(job.proposals)) return false;

        return job.proposals.some((proposal) => {
            if (!proposal.seekerID) return false;
            return proposal.seekerID.toString() === id;
        });
    });

    return activeJobsForSeeker;
}
async function getActiveJobsSeekerByStatus(id: string): Promise<IJobPost[]> {
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

        if (job.jobStatus !== "active") return false;
        if (!job.proposals || !Array.isArray(job.proposals)) return false;

        return job.proposals.some((proposal) => {
            if (proposal.proposalStatus !== "accepted") return false;
            return proposal.seekerID?.toString() === id;
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
    return data.jobPosts.filter((job) => (job.jobStatus === "active" || job.jobStatus === 'in-progress') && job?.posterID?.toString() === id);
}

async function getActiveJobs(): Promise<IJobPost[]> {
    const res = await fetch(url + `/job`);

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    const data: JobData = await res.json();
    return data.jobPosts.filter((job) => job.jobStatus === "active");
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

async function getRunningJobsBySeeker(id: string): Promise<IJobPost[]> {
    if (!id) {
        throw new Error("Seeker ID is required");
    }
    const res = await fetch(url + `/job`);

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    const data: JobData = await res.json();
    return data.jobPosts.filter((job) => {
        if (!job.proposals || !Array.isArray(job.proposals)) return false;
        // First check if any proposal matches the seeker ID
        const hasSeeker = job.proposals.some((proposal) => proposal.seekerID?.toString() === id);
        if (!hasSeeker) return false;
        // Then check if job status is 'in-progress'
        return job.jobStatus === "in-progress";
    });
}

async function getCompletedJobsByPoster(id: string): Promise<IJobPost[]> {
    const res = await fetch(url + `/job`);

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    const data: JobData = await res.json();
    return data.jobPosts.filter((job) => job.jobStatus === "completed" && job?.posterID?.toString() === id);
}


export { getActiveJobs, getJobById, getActiveJobsByPoster, getActiveJobsBySeeker, getActiveJobsSeekerByStatus, getRunningJobsBySeeker, getCompletedJobsByPoster };