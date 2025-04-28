/* eslint-disable */
/* eslint-disable */

import { IUser } from "@/models/user";

interface userData {
    users: IUser[];
}

const url = `${process.env.NEXT_PUBLIC_API_URL}/user`;

// fetch all active jobs from the API
async function getAllUser(): Promise<IUser[]> {
    const res = await fetch(url);

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    const data: userData = await res.json();
    return data.users.filter((job) => job.role === "seeker");
}
// fetch a job by email from the API
async function getSingleUser(email: string): Promise<IUser> {
    const res = await fetch(`${url}?email=${email}`);

    if (!res.ok) {
        throw new Error("Failed to fetch job with the given ID");
    }

    const response = await res.json();

    if (!response.user) {
        throw new Error("user not found in the response");
    }

    return response.user as IUser;
}

export { getAllUser, getSingleUser };