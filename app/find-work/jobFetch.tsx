/* eslint-disable */
import type { IJobPost } from "@/models/jobPost";

interface JobData {
    jobPosts: IJobPost[];
}

const url = `${process.env.NEXT_PUBLIC_API_URL}/poster`;

async function getActiveJobs(): Promise<IJobPost[]> {
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    const data: JobData = await res.json();
    return data.jobPosts.filter((job) => job.status === "active");
}

export default getActiveJobs;