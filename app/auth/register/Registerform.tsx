/* eslint-disable */
'use client'
import React, { useState } from 'react';
import { FaUserLarge, FaBriefcase } from "react-icons/fa6";
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Registerform = () => {


    const [message, setMessage] = useState("");
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        role: '',
        name: '',
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

        try {
            console.log("Login attempt for:", formData.email);
            const url = `${process.env.NEXT_PUBLIC_API_URL}/user`;

            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData) // Ensure formData is correctly formatted
            });

            const data = await res.json();

            if (!res.ok) {
                console.error("Registration error:", data.error);

                // Provide more specific error messages based on the error
                if (data.error === "CredentialsSignin") {
                    setMessage("Invalid email or password. Please try again.");
                } else {
                    setMessage(`Registration failed: ${data.error}`);
                }
            } else {
                console.log("Registration successful, redirecting to dashboard");
                // Add a small delay before redirecting
                setTimeout(() => {
                    router.push("/dashboard");
                }, 500);
            }
        } catch (error) {
            console.error("registration exception:", error);
            setMessage("An error occurred during registration. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="flex items-center justify-center min-h-screen bg-gray-100 md:pt-12">
            <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-gray-900 text-center">Sign up for explore new universe</h2>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="flex justify-evenly text-black">
                        <div>
                            <input type="radio" id="seeker" name="role" value="seeker" className="peer sr-only" onChange={handleChange} required />
                            <label
                                htmlFor="seeker"
                                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-checked:border-primary"
                            >
                                <FaUserLarge className="mb-3 h-6 w-6" />
                                <span className="font-medium">Job Seeker</span>
                            </label>
                        </div>
                        <div>
                            <input type="radio" id="poster" name="role" value="poster" className="peer sr-only" onChange={handleChange} required />
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
                        <Input id='name' name='name' type='text' placeholder='Name' required autoComplete='name' onChange={handleChange} />
                        <Input id="email-address" name="email" type="email" autoComplete="email" required placeholder="Email address" onChange={handleChange} />
                        <Input id="password" name="password" type="password" autoComplete="current-password" required placeholder="Password" onChange={handleChange} />
                    </div>

                    <div>
                        <Button
                            className='w-full'
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'account createing in...' : 'Sign up'}
                        </Button>
                    </div>
                    <div className="text-sm text-black">
                        Already have account?
                        <Link href="/auth/login" className="font-medium text-indigo-600 hover:text-indigo-500 pl-2 underline">
                            login here
                        </Link>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Registerform;