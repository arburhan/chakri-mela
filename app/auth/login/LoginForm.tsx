/* eslint-disable */
'use client'
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { signIn } from "next-auth/react";

const LoginForm = () => {
    const router = useRouter();
    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        try {
            // console.log("Login attempt for:", formData.email);

            const res = await signIn("credentials", {
                redirect: false,
                email: formData.email.trim().toLowerCase(),
                password: formData.password
            });

            if (res?.error) {
                console.error("Login error:", res.error);

                // Provide more specific error messages based on the error
                if (res.error === "CredentialsSignin") {
                    setMessage("Invalid email or password. Please try again.");
                } else {
                    setMessage(`Login failed: ${res.error}`);
                }
            } else if (res?.ok) {
                console.log("Login successful, redirecting to dashboard");
                // Add a small delay before redirecting
                setTimeout(() => {
                    router.push("/dashboard");
                    router.refresh();
                }, 500);
            } else {
                setMessage("Unknown response from authentication server");
            }
        } catch (error) {
            console.error("Login exception:", error);
            setMessage("An error occurred during login. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-center text-gray-900">Login to your account</h2>

                {message && (
                    <div className="p-3 bg-red-100 text-red-700 rounded-md">
                        {message}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="email-address" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                            <Input
                                id="email-address"
                                name="email"
                                type="email"
                                onChange={handleChange}
                                value={formData.email}
                                autoComplete="email"
                                required
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                onChange={handleChange}
                                value={formData.password}
                                autoComplete="current-password"
                                required
                                placeholder="Password"
                            />
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
                        <Button
                            className='w-full'
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Signing in...' : 'Sign in'}
                        </Button>
                    </div>
                    <div className="text-sm text-black">
                        New here?
                        <Link href="/auth/register" className="font-medium text-indigo-600 hover:text-indigo-500 pl-2 underline">
                            register now
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;