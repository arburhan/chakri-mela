/* eslint-disable */
'use client';
import React, { useState } from "react";
import { categoriesData, jobTypeData } from "@/public/data";
import { Input, Textarea } from "@heroui/input";
import { Checkbox, CheckboxGroup, NumberInput, Select, SelectItem } from "@heroui/react";
import { Button } from "@heroui/button";

const Page = () => {
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [submitMessage, setSubmitMessage] = useState<string>("");

    const [formData, setFormData] = useState({
        jobTitle: "",
        jobDescription: "",
        jobType: "",
        workingHour: 0,
        salaryRange: {
            startRange: 0,
            endRange: 0,
        },
        jobLevel: [] as string[],
        skills: [] as string[],
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNumberInputChange = (name: string, value: number) => {
        // Ensure value is a valid number
        const parsedValue = isNaN(value) ? 0 : value;

        if (name === "startRange" || name === "endRange") {
            setFormData(prev => ({
                ...prev,
                salaryRange: {
                    ...prev.salaryRange,
                    [name]: parsedValue
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: parsedValue
            }));
        }
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCheckboxGroupChange = (name: string, values: string[]) => {
        setFormData(prev => ({
            ...prev,
            [name]: values
        }));
    };

    const handleCategoryChange = (categoryName: string) => {
        setSelectedCategory(categoryName);
        // Reset skills when category changes
        setFormData(prev => ({
            ...prev,
            skills: []
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const url = `${process.env.NEXT_PUBLIC_API_URL}/poster`;
        try {

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitMessage('Form submitted successfully!');
                // Reset form
                setFormData({
                    jobTitle: "",
                    jobDescription: "",
                    jobType: "",
                    workingHour: 0,
                    salaryRange: {
                        startRange: 0,
                        endRange: 0,
                    },
                    jobLevel: [] as string[],
                    skills: [] as string[],
                });
            } else {
                setSubmitMessage(data.message || 'Submission failed');
            }
        } catch (error) {
            setSubmitMessage('Error submitting form');
            console.error('Submission error:', error);
        } finally {
            console.log('successfully submitted');
        }
        console.log("Form submitted:", "success");
    };

    return (
        <section className="py-10 bg-gray-400 text-black">
            <div>
                <h1 className="text-2xl font-bold text-center pt-10 pb-2">Post a New Job</h1>
                <form onSubmit={handleSubmit}>
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                        <div className="mb-4">
                            <label className="text-gray-700 text-sm font-bold mb-2" htmlFor="jobTitle">
                                Job Title
                            </label>
                            <Input
                                required
                                name="jobTitle"
                                className="w-full"
                                value={formData.jobTitle}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="text-gray-700 text-sm font-bold mb-2" htmlFor="jobDescription">
                                Job Description
                            </label>
                            <Textarea
                                required
                                name="jobDescription"
                                className="w-full"
                                value={formData.jobDescription}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="text-gray-700 text-sm font-bold mb-2" htmlFor="jobType">
                                Job Type
                            </label>
                            <br />
                            <Select
                                isRequired
                                className="w-full"
                                label="Select job type"
                                value={formData.jobType}
                                onChange={(e) => handleSelectChange("jobType", e.target.value)}
                            >
                                {jobTypeData.map((type) => (
                                    <SelectItem key={type.name} data-value={type.name}>{type.name}</SelectItem>
                                ))}
                            </Select>
                        </div>
                        <div className="mb-4">
                            <label className="text-gray-700 text-sm font-bold mb-2" htmlFor="workingHour">
                                Working Hour
                            </label>
                            <NumberInput
                                required
                                min={2}
                                max={24}
                                name="workingHour"
                                className="w-full"
                                data-value={String(formData.workingHour)}
                                onChange={(value) => handleNumberInputChange("workingHour", Number(value))}
                            />
                        </div>
                        {/* categories */}
                        <div className="mb-4">
                            <Select
                                isRequired
                                className="w-full"
                                color="warning"
                                label="Select Categories"
                                value={selectedCategory}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                            >
                                {categoriesData.map((category) => (
                                    <SelectItem
                                        key={category.name}
                                        data-value={category.name}
                                    >
                                        {category.name}
                                    </SelectItem>
                                ))}
                            </Select>
                        </div>
                        {/* skills */}
                        <div className="mb-4">
                            <label className="text-gray-700 text-sm font-bold mb-2" htmlFor="skills">
                                Skills
                            </label>
                            {selectedCategory && (
                                <div className="mb-4">
                                    <h3 className="text-gray-700 font-bold">{selectedCategory}</h3>
                                    <CheckboxGroup
                                        isRequired
                                        name="skills"
                                        className="grid grid-cols-1 md:grid-cols-2 gap-2"
                                        value={formData.skills}
                                        onChange={(values) => handleCheckboxGroupChange("skills", values)}
                                    >
                                        {categoriesData
                                            .find((cat) => cat.name === selectedCategory)?.skills?.map((skill) => (
                                                <Checkbox key={skill} value={skill}>
                                                    {skill}
                                                </Checkbox>
                                            ))}
                                    </CheckboxGroup>
                                </div>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="text-gray-700 text-sm font-bold mb-2" htmlFor="salaryRange">
                                Salary Range Per Hour
                            </label>
                            <NumberInput
                                required
                                min={2}
                                max={150}
                                name="startRange"
                                className="w-full"
                                data-value={String(formData.salaryRange.startRange)}
                                onChange={(value) => handleNumberInputChange("startRange", Number(value))}
                            />
                            <span className="text-black pl-5">to</span>
                            <NumberInput
                                required
                                min={2}
                                max={550}
                                name="endRange"
                                className="w-full"
                                data-value={String(formData.salaryRange.endRange)}
                                onChange={(value) => handleNumberInputChange("endRange", Number(value))}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="text-gray-700 text-sm font-bold mb-2" htmlFor="jobLevel">
                                Experience Level
                            </label>
                            <CheckboxGroup
                                isRequired
                                name="jobLevel"
                                className="flex gap-5"
                                value={formData.jobLevel}
                                onChange={(values) => handleCheckboxGroupChange("jobLevel", values)}
                            >
                                {['Entry Level', 'Intermediate', 'Expert'].map((level) => (
                                    <Checkbox key={level} value={level} className="text-white">
                                        {level}
                                    </Checkbox>
                                ))}
                            </CheckboxGroup>
                        </div>
                    </section>
                    <div className="text-center pb-4">
                        <Button type="submit" size="lg">Post Job</Button>
                    </div>
                </form>
            </div>
            <div className="mt-4 text-center">
                <p className="text-gray-600">
                    Need help? <a href="/help" className="text-blue-500">Contact Support</a>
                </p>
            </div>
        </section>
    );
};

export default Page;