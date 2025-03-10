/* eslint-disable */

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import Registerform from "./Registerform";

export default async function page() {
    const session = await getServerSession();
    if (session) {
        redirect("/dashboard");
    }
    return <Registerform />;
}