/* eslint-disable */
'use client';
import React, { useState } from "react";
import { categoriesData, jobTypeData } from "@/public/data";
import { Input, Textarea } from "@heroui/input";
import { addToast, Checkbox, CheckboxGroup, NumberInput, Select, SelectItem } from "@heroui/react";
import { Button } from "@heroui/button";

const Page = () => {
    const [jobCategory, setjobCategory] = useState<string>("");
    const [submitMessage, setSubmitMessage] = useState<string>("");
    const [salaryError, setSalaryError] = useState<string>("");
    console.log(jobCategory);

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
        jobCategory: "",
        skills: [] as string[],
        jobLocation: {
            city: "",
            state: "",
            country: "",
        },

    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Check if this is a nested property (contains a dot)
        if (name.includes('.')) {
            const [parent, child] = name.split('.');

            if (parent === 'jobLocation') {
                setFormData(prev => ({
                    ...prev,
                    jobLocation: {
                        ...prev.jobLocation,
                        [child]: value
                    }
                }));
            }
            // Add other nested objects if needed in the future
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleNumberInputChange = (name: string, value: number) => {
        // Ensure value is a valid number
        const parsedValue = isNaN(value) ? 0 : value;

        if (name === "startRange" || name === "endRange") {
            const updatedSalaryRange = {
                ...formData.salaryRange,
                [name]: parsedValue
            };

            // Clear error when user is updating values
            setSalaryError("");

            // Check if startRange is greater than or equal to endRange
            if (name === "startRange" && parsedValue >= formData.salaryRange.endRange && formData.salaryRange.endRange > 0) {
                setSalaryError("Start range must be less than end range");
            } else if (name === "endRange" && parsedValue <= formData.salaryRange.startRange && parsedValue > 0) {
                setSalaryError("End range must be greater than start range");
            }

            setFormData(prev => ({
                ...prev,
                salaryRange: updatedSalaryRange
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
        console.log("Selected category:", categoryName); // Add this for debugging
        setjobCategory(categoryName);

        setFormData(prev => ({
            ...prev,
            jobCategory: categoryName,
            skills: [], // Reset skills when category changes
        }));
    };

    const handleJobLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            jobLocation: {
                ...prev.jobLocation,
                [name]: value
            }
        }));
    }

    const validateSalaryRange = () => {
        const { startRange, endRange } = formData.salaryRange;

        if (startRange >= endRange) {
            setSalaryError("Start range must be less than end range");
            return false;
        }

        setSalaryError("");
        return true;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(formData);

        // Validate salary range before submission
        if (!validateSalaryRange()) {
            setSubmitMessage("Please fix salary range before submitting.");
            return;
        }

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
                    jobCategory: "",
                    skills: [] as string[],
                    jobLocation: {
                        city: "",
                        state: "",
                        country: "",
                    },
                });
                addToast({
                    timeout: 8000,
                    title: "Success",

                    description: "Successfully posted a new job",
                    icon: "check",
                    color: "success",
                })
                setjobCategory("");
            } else {
                setSubmitMessage(data.message || 'Submission failed');
            }
        } catch (error) {
            setSubmitMessage('Error submitting form');
            console.error('Submission error:', error);
        } finally {
            console.log('Form submission attempt complete');
        }
    };

    return (
        <section className="py-10 bg-gray-500 text-white">
            <div>
                <h1 className="text-2xl font-bold text-center pt-10 pb-2">Post a New Job</h1>
                {submitMessage && (
                    <div className={`text-center p-2 mb-4 ${submitMessage.includes('success') ? 'bg-green-500' : 'bg-red-500'}`}>
                        {submitMessage}
                    </div>
                )}
                <form onSubmit={handleSubmit}>
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                        <div className="mb-4">
                            <label className="text-sm font-bold mb-2" htmlFor="jobTitle">
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
                            <label className="text-sm font-bold mb-2" htmlFor="jobDescription">
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
                            <label className="text-sm font-bold mb-2" htmlFor="jobType">
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
                                {jobTypeData.map((type, index) => (
                                    <SelectItem key={index} data-value={type.name}>{type.name}</SelectItem>
                                ))}
                            </Select>
                        </div>
                        <div className="mb-4">
                            <label className="text-sm font-bold mb-2" htmlFor="workingHour">
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
                                name="jobCategory"
                                isRequired
                                className="w-full"
                                color="warning"
                                label="Select Categories"
                                data-value={jobCategory}
                                onChange={(e) => handleCategoryChange(e.target.value)}
                            >
                                {categoriesData.map((category) => (
                                    <SelectItem
                                        color="warning"
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
                            <label className="text-sm font-bold mb-2" htmlFor="skills">
                                Skills
                            </label>
                            {jobCategory && (
                                <div className="mb-4">
                                    <h3 className="font-bold">{jobCategory}</h3>
                                    <CheckboxGroup
                                        isRequired
                                        name="skills"
                                        className="grid grid-cols-1 md:grid-cols-2 gap-2"
                                        value={formData.skills}
                                        onChange={(values) => handleCheckboxGroupChange("skills", values)}
                                    >
                                        {categoriesData
                                            .find((cat) => cat.name === jobCategory)?.skills?.map((skill, index) => (
                                                <Checkbox
                                                    key={index}
                                                    value={skill}
                                                    color="warning"
                                                    classNames={{
                                                        icon: "text-gray-400",
                                                        wrapper: "group-[.selected]:bg-warning group-[.selected]:text-white"
                                                    }}
                                                >
                                                    {skill}
                                                </Checkbox>
                                            ))}
                                    </CheckboxGroup>
                                </div>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="text-sm font-bold mb-2" htmlFor="salaryRange">
                                Salary Range Per Hour
                            </label>
                            <div className="flex items-center gap-2">
                                <NumberInput
                                    required
                                    min={2}
                                    max={150}
                                    name="startRange"
                                    className="w-full"
                                    data-value={String(formData.salaryRange.startRange)}
                                    onChange={(value) => handleNumberInputChange("startRange", Number(value))}
                                />
                                <span className="px-2">to</span>
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
                            {salaryError && (
                                <div className="text-red-400 mt-1 text-sm font-bold">
                                    {salaryError}
                                </div>
                            )}
                        </div>
                        <div className="mb-4">
                            <label className="text-sm font-bold mb-2" htmlFor="jobLevel">
                                Experience Level
                            </label>
                            <CheckboxGroup
                                isRequired
                                name="jobLevel"
                                className="flex gap-5"
                                value={formData.jobLevel}
                                onChange={(values) => handleCheckboxGroupChange("jobLevel", values)}
                            >
                                {['Entry Level', 'Intermediate', 'Expert'].map((level, index) => (
                                    <Checkbox key={index} value={level} className="text-white">
                                        {level}
                                    </Checkbox>
                                ))}
                            </CheckboxGroup>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div>
                                <label className="text-sm font-medium  mb-1 block">City</label>
                                <Input
                                    required
                                    name="city"  // Change to just "city"
                                    value={formData.jobLocation.city}
                                    onChange={(e) => handleJobLocationChange(e)}
                                    placeholder="City"
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium  mb-1 block">State/Province</label>
                                <Input
                                    required
                                    name="jobLocation.state"
                                    value={formData.jobLocation.state}
                                    onChange={handleInputChange}
                                    placeholder="State/Province"
                                    className="w-full"
                                />
                            </div>
                            <div>
                                <label className="text-sm font-medium  mb-1 block">Country</label>
                                <Input
                                    required
                                    name="jobLocation.country"
                                    value={formData.jobLocation.country}
                                    onChange={handleInputChange}
                                    placeholder="Country"
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </section>
                    <div className="text-center pb-4">
                        <Button
                            type="submit"
                            size="lg"
                            disabled={!!salaryError}
                        >
                            Post Job
                        </Button>
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