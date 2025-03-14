/* eslint-disable */

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";


export default async function page() {
    const session = await getServerSession();
    if (session) {
        redirect("/dashboard");
    }
    return <LoginForm />;
}