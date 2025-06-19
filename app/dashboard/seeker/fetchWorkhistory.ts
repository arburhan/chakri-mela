/* eslint-disable */
import { IJobPost } from "@/models/jobPost";

const url = `${process.env.NEXT_PUBLIC_API_URL}/seeker/work-history`;

// fetch all work history jobs for the authenticated user
async function getWorkHistory(): Promise<IJobPost[]> {
    const res = await fetch(url, { cache: "no-store" });

    if (!res.ok) {
        throw new Error("Failed to fetch work history");
    }

    const data = await res.json();
    // data.workHistory is an array of populated job posts
    return data.workHistory;
}

export { getWorkHistory };
