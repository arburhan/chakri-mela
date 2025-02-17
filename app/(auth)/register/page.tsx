/* eslint-disable */
import React from 'react';
import { FaUserLarge, FaBriefcase } from "react-icons/fa6";
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import Link from 'next/link';



const page = () => {
    return (
        <section className="flex items-center justify-center min-h-screen bg-gray-100 md:pt-12">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold  text-gray-900 text-center">Sign up for explore new universe</h2>
                <form className="mt-8 space-y-6">
                    <div className="flex justify-evenly text-black">
                        <div>
                            <input type="radio" id="seeker" name="role" value="SEEKER" className=" peer sr-only" />
                            <label
                                htmlFor="seeker"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-checked:border-primary"
                            >
                                <FaUserLarge className="mb-3 h-6 w-6" />
                                <span className="font-medium">Job Seeker</span>

                            </label>
                        </div>
                        <div>
                            <input type="radio" id="poster" name="role" value="POSTER" className="peer sr-only" />
                            <label
                                htmlFor="poster"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-checked:border-primary"
                            >
                                <FaBriefcase className="mb-3 h-6 w-6" />
                                <span className="font-medium">Job Poster</span>
                            </label>
                        </div>
                    </div>
                    <div className='space-y-3'>
                        <Input id='name' name='name' type='text' placeholder='Name' required autoComplete='name' />
                        <Input id="email-address" name="email" type="email" autoComplete="email" required placeholder="Email address" />
                        <Input id="password" name="password" type="password" autoComplete="current-password" required placeholder="Password" />
                    </div>

                    <div>
                        <Button className='w-full'> Sign in </Button>
                    </div>
                    <div className="text-sm text-black">
                        Already have account?
                        <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500 pl-2 underline">
                            login here
                        </Link>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default page;