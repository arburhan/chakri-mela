/* eslint-disable */
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import Link from 'next/link';
import React from 'react';

const page = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-900">Login to your account</h2>
                <form className="mt-8 space-y-6">
                    <div className="rounded-md shadow-sm">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <Input id="email-address" name="email" type="email" autoComplete="email" required placeholder="Email address" />
                        </div>
                        <br />
                        <div className="-mt-px">
                            <label htmlFor="password" className="sr-only">Password</label>
                            <Input id="password" name="password" type="password" autoComplete="current-password" required placeholder="Password" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <label htmlFor="remember-me" className="block ml-2 text-sm text-gray-900">
                                Remember me
                            </label>
                        </div>
                        <div className="text-sm">
                            <button
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                                type="button">
                                Forgot your password?
                            </button>
                        </div>
                    </div>
                    <div>
                        <Button className='w-full'> Sign in </Button>
                    </div>
                    <div className="text-sm text-black">
                        New here?
                        <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500 pl-2 underline">
                            register now
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default page;