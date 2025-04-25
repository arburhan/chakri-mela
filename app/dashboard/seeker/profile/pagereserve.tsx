/* eslint-disable */

import { getServerSession } from 'next-auth';
import React from 'react';

const SingleUserProfile = async () => {
    const session = await getServerSession();
    const userEmail = session?.user?.email;
    const singleUser = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user?email=${userEmail}`);
    const userData = await singleUser.json();

    return (
        <div>
            nothing here yet

        </div>
    );
};

export default SingleUserProfile;