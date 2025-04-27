/* eslint-disable */
'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoPencil } from "react-icons/go";
import { IoMail } from "react-icons/io5";

import type { IUser } from '@/models/user';
import { Button } from '@heroui/button';
import { Avatar, Badge, Card, Checkbox, CheckboxGroup, Divider, Input, Select, SelectItem } from '@heroui/react';
import moment from 'moment';
import { MdCancel } from 'react-icons/md';
import { FaCalendarAlt, FaMobile } from 'react-icons/fa';
import { FaLocationDot } from 'react-icons/fa6';
import { getSession } from 'next-auth/react';
import { getSingleUser } from '../../fetchUser';
import { categoriesData } from '@/public/data';
import LoadingComponent from '@/components/shared/loading';

const url = `${process.env.NEXT_PUBLIC_API_URL}`;

interface FormState {
    name: string;
    email: string;
    role: string;
    gender: string;
    mobileNumber: string;
    currentLocation: {
        city: string;
        state: string;
        country: string;
    };
    dateOfBirth: string;
    nidNumber: string;
    categories: string[];
    skills: string[];
}

const JobSeekerProfile = () => {
    const router = useRouter();
    const [user, setUser] = useState<IUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [editMode, setEditMode] = useState(false);

    const [formData, setFormData] = useState<FormState>({
        name: '',
        email: '',
        role: 'seeker',
        gender: '',
        mobileNumber: '',
        currentLocation: {
            city: '',
            state: '',
            country: '',
        },
        dateOfBirth: '',
        nidNumber: '',
        categories: [],
        skills: [],
    });

    const [newSkill, setNewSkill] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [availableSkills, setAvailableSkills] = useState<string[]>([]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const session = await getSession();
                const userEmail = session?.user?.email;
                const userData = await getSingleUser(userEmail as string);

                setUser(userData);
                setFormData({
                    name: userData.name || '',
                    email: userData.email || '',
                    role: userData.role || 'seeker',
                    gender: userData.gender || '',
                    mobileNumber: userData.mobileNumber || '',
                    currentLocation: {
                        city: userData.currentLocation?.city || '',
                        state: userData.currentLocation?.state || '',
                        country: userData.currentLocation?.country || '',
                    },
                    dateOfBirth: userData.dateOfBirth ? moment(userData.dateOfBirth).format('YYYY-MM-DD') : '',
                    nidNumber: userData.nidNumber ? String(userData.nidNumber) : '',
                    categories: userData.categories || [],
                    skills: userData.skills || [],
                });
            } catch (err: any) {
                console.error('Error fetching user profile:', err);
                setError(err.response?.data?.message || 'Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    // Fix: Uncommented and fixed the handleInputChange function
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData({
                ...formData,
                [parent]: {
                    ...(formData[parent as keyof FormState] as any),
                    [child]: value,
                },
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    // Handle gender selection
    const handleGenderChange = (value: string) => {
        setFormData({
            ...formData,
            gender: value
        });
    };


    const handleCategorySelect = (value: string) => {
        setSelectedCategory(value);
        // Find skills for the selected category
        const categorySkills = categoriesData.find(cat => cat.name === value)?.skills || [];
        setAvailableSkills(categorySkills);
    };

    const addCategory = () => {
        if (selectedCategory && !formData.categories.includes(selectedCategory)) {
            setFormData({
                ...formData,
                categories: [...formData.categories, selectedCategory],
            });
            setSelectedCategory('');
        }
    };

    const removeCategory = (categoryToRemove: string) => {
        // Remove the category
        setFormData({
            ...formData,
            categories: formData.categories.filter(category => category !== categoryToRemove),
            // Also remove skills that belong to this category
            skills: formData.skills.filter(skill => {
                const categorySkills = categoriesData.find(cat => cat.name === categoryToRemove)?.skills || [];
                return !categorySkills.includes(skill);
            })
        });
    };


    const validateForm = () => {
        // Check if at least one category is selected
        if (formData.categories.length === 0) {
            alert("Please select at least one job category.");
            return false;
        }

        // Check if each category has at least one skill selected
        for (const category of formData.categories) {
            const categorySkills = categoriesData.find(cat => cat.name === category)?.skills || [];
            const selectedSkillsForCategory = formData.skills.filter(skill =>
                categorySkills.includes(skill)
            );

            if (selectedSkillsForCategory.length === 0) {
                alert(`Please select at least one skill for the "${category}" category.`);
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate the form before submission
        if (!validateForm()) {
            console.log("error in form validation");
            return;
        }


        const session = await getSession();
        const userEmail = session?.user?.email;

        try {
            setLoading(true);

            const response = await fetch(`${url}/user?email=${userEmail}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to update profile');
            }

            const updatedUser = await response.json();
            setUser(updatedUser);
            setEditMode(false);

        } catch (err: any) {
            console.error('Error updating profile:', err);
            setError(err.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !user) {
        return (
            <LoadingComponent />
        );
    }

    if (error && !user) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mt-4">
                <p>{error}</p>
                <Button
                    onPress={() => window.location.reload()}
                    className="mt-2"
                    variant="bordered"
                >
                    Try Again
                </Button>
            </div>
        );
    }

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase();
    };

    const genders = [
        { key: "male", label: "Male" },
        { key: "female", label: "Female" },
        { key: "hijra", label: "Hijra" },
    ]

    // Get categories that haven't been selected yet
    const availableCategories = categoriesData.filter(
        category => !formData.categories.includes(category.name)
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Your Profile</h1>
                {!editMode ? (
                    <Button
                        onPress={() => setEditMode(true)}
                        variant="bordered"
                        className="flex items-center gap-2"
                    >
                        <GoPencil size={16} />
                        Edit Profile
                    </Button>
                ) : (
                    <Button
                        onPress={() => setEditMode(false)}
                        variant="bordered"
                        className="flex items-center gap-2 text-red-500 border-red-200 hover:bg-red-50"
                    >
                        <MdCancel size={16} />
                        Cancel
                    </Button>
                )}
            </div>

            {editMode ? (
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Personal Info Card */}
                        <Card className="p-6 col-span-3 md:col-span-1">
                            <div className="flex flex-col items-center mb-6">
                                <Avatar className="h-24 w-24 mb-4 text-xl font-semibold">
                                    {formData.name ? getInitials(formData.name) : 'JS'}
                                </Avatar>
                                <Input
                                    required
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Your Name"
                                    className="text-center font-medium text-lg"
                                />
                            </div>

                            <Divider className="my-4" />

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                                    <Input
                                        disabled
                                        name="email"
                                        value={formData.email}
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Mobile Number</label>
                                    <Input
                                        required
                                        name="mobileNumber"
                                        value={formData.mobileNumber}
                                        onChange={handleInputChange}
                                        placeholder="+1234567890"
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Gender</label>
                                    <Select
                                        isRequired
                                        className="max-w-xs"
                                        selectedKeys={[formData.gender]}
                                        onSelectionChange={(keys) => handleGenderChange(Array.from(keys)[0] as string)}
                                        items={genders}
                                        label="Your Gender"
                                        placeholder="Select a gender"
                                    >
                                        {(gender) => <SelectItem key={gender.key}>{gender.label}</SelectItem>}
                                    </Select>
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Date of Birth</label>
                                    <Input
                                        required
                                        name="dateOfBirth"
                                        value={formData.dateOfBirth}
                                        onChange={handleInputChange}
                                        type="date"
                                        className="w-full"
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">NID Number</label>
                                    <Input
                                        required
                                        name="nidNumber"
                                        value={formData.nidNumber}
                                        onChange={handleInputChange}
                                        placeholder="National ID Number"
                                        className="w-full"
                                    />
                                </div>
                            </div>
                        </Card>

                        {/* Location & Categories Card */}
                        <Card className="p-6 col-span-3 md:col-span-2">
                            <h2 className="text-xl font-semibold mb-4">Location</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">City</label>
                                    <Input
                                        required
                                        name="currentLocation.city"
                                        value={formData.currentLocation.city}
                                        onChange={handleInputChange}
                                        placeholder="City"
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">State/Province</label>
                                    <Input
                                        required
                                        name="currentLocation.state"
                                        value={formData.currentLocation.state}
                                        onChange={handleInputChange}
                                        placeholder="State/Province"
                                        className="w-full"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Country</label>
                                    <Input
                                        required
                                        name="currentLocation.country"
                                        value={formData.currentLocation.country}
                                        onChange={handleInputChange}
                                        placeholder="Country"
                                        className="w-full"
                                    />
                                </div>
                            </div>

                            <Divider className="my-6" />

                            <h2 className="text-xl font-semibold mb-4">Job Categories</h2>
                            <div className="mb-6">
                                {formData.categories.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {formData.categories.map((category, index) => (
                                            <Badge key={index} className="flex items-center gap-1 px-3 py-1">
                                                {category}
                                                <button type="button" onClick={() => removeCategory(category)} className="ml-1">
                                                    <MdCancel size={14} />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                )}

                                {availableCategories.length > 0 && (
                                    <div className="flex gap-2 mt-3">
                                        <Select
                                            className="w-full"
                                            color="warning"
                                            label="Select a Category"
                                            selectedKeys={selectedCategory ? [selectedCategory] : []}
                                            onSelectionChange={(keys) => handleCategorySelect(Array.from(keys)[0] as string)}
                                            items={availableCategories}
                                        >
                                            {(category) => <SelectItem key={category.name}>{category.name}</SelectItem>}
                                        </Select>
                                        <Button
                                            type="button"
                                            onPress={addCategory}
                                            size="sm"
                                            disabled={!selectedCategory}
                                        >
                                            Add
                                        </Button>
                                    </div>
                                )}

                                {availableCategories.length === 0 && (
                                    <p className="text-gray-500 text-sm mt-2">All categories have been added.</p>
                                )}
                            </div>

                            <Divider className="my-6" />

                            {/* Now let's add the skills section for each selected category */}
                            <h2 className="text-xl font-semibold mb-4">Skills by Category</h2>
                            <div className="mb-6">
                                {formData.categories.length > 0 ? (
                                    formData.categories.map((category) => {
                                        const categorySkills = categoriesData.find(cat => cat.name === category)?.skills || [];
                                        const selectedSkillsForCategory = formData.skills.filter(skill =>
                                            categorySkills.includes(skill)
                                        );

                                        return (
                                            <div key={category} className="mb-6 p-4 border border-gray-200 rounded-lg">
                                                <h3 className="font-medium mb-2">{category} Skills</h3>
                                                <p className="text-sm text-gray-500 mb-3">Please select at least one skill for this category.</p>

                                                <CheckboxGroup
                                                    className="grid grid-cols-1 md:grid-cols-2 gap-2"
                                                    value={selectedSkillsForCategory}
                                                    onChange={(selectedValues) => {
                                                        // Keep skills from other categories
                                                        const otherCategorySkills = formData.skills.filter(skill =>
                                                            !categorySkills.includes(skill)
                                                        );

                                                        // Add selected skills from this category
                                                        setFormData({
                                                            ...formData,
                                                            skills: [...otherCategorySkills, ...selectedValues]
                                                        });
                                                    }}
                                                >
                                                    {categorySkills.map((skill, index) => (
                                                        <Checkbox
                                                            key={index}
                                                            value={skill}
                                                            color="warning"
                                                            isSelected={formData.skills.includes(skill)}
                                                            classNames={{
                                                                icon: "text-gray-400",
                                                                wrapper: "group-[.selected]:bg-warning group-[.selected]:text-white"
                                                            }}
                                                        >
                                                            {skill}
                                                        </Checkbox>
                                                    ))}
                                                </CheckboxGroup>

                                                {selectedSkillsForCategory.length === 0 && (
                                                    <p className="text-red-500 text-sm mt-2">
                                                        Please select at least one skill for this category.
                                                    </p>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <p className="text-gray-500">Please select at least one job category first.</p>
                                )}
                            </div>
                        </Card>
                    </div>

                    <div className="flex justify-end mt-6">
                        <Button
                            type="submit"
                            className="px-6"
                            disabled={loading}
                        >
                            {loading ? 'Saving...' : 'Save Profile'}
                        </Button>
                    </div>
                </form>
            ) : (
                // View mode - display profile information
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Personal Info Card */}
                    <Card className="p-6 col-span-3 md:col-span-1">
                        <div className="flex flex-col items-center mb-6">
                            <Avatar className="h-24 w-24 mb-4 text-xl font-semibold">
                                {user?.name ? getInitials(user.name) : 'JS'}
                            </Avatar>
                            <h2 className="text-xl font-bold">{user?.name}</h2>
                            <span className="text-gray-500">Job Seeker</span>
                        </div>

                        <Divider className="my-4" />

                        <div className="space-y-4">
                            <div className="flex items-center">
                                <IoMail size={18} className="text-gray-500 mr-2" />
                                <span>{user?.email}</span>
                            </div>

                            {user?.mobileNumber && (
                                <div className="flex items-center">
                                    <FaMobile size={18} className="text-gray-500 mr-2" />
                                    <span>{user?.mobileNumber}</span>
                                </div>
                            )}

                            {user?.gender && (
                                <div className="flex items-center">
                                    <span className="w-5 h-5 text-gray-500 mr-2">⚧</span>
                                    <span className="capitalize">{user?.gender}</span>
                                </div>
                            )}

                            {user?.dateOfBirth && (
                                <div className="flex items-center">
                                    <FaCalendarAlt size={18} className="text-gray-500 mr-2" />
                                    <span>{moment(user.dateOfBirth).format('MMMM D, YYYY')}</span>
                                </div>
                            )}

                            {user?.nidNumber && (
                                <div className="flex items-center">
                                    <span className="w-5 h-5 text-gray-500 mr-2">🪪</span>
                                    <span>{user?.nidNumber?.toString()}</span>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Location & Categories Card */}
                    <Card className="p-6 col-span-3 md:col-span-2">
                        <h2 className="text-xl font-semibold mb-4">Location</h2>
                        {user?.currentLocation?.city || user?.currentLocation?.state || user?.currentLocation?.country ? (
                            <div className="flex items-center mb-6">
                                <FaLocationDot size={18} className="text-gray-500 mr-2" />
                                <address className="not-italic">
                                    {[
                                        user?.currentLocation?.city,
                                        user?.currentLocation?.state,
                                        user?.currentLocation?.country
                                    ].filter(Boolean).join(', ')}
                                </address>
                            </div>
                        ) : (
                            <p className="text-gray-500 mb-6">No location information provided</p>
                        )}

                        <Divider className="my-6" />

                        <h2 className="text-xl font-semibold mb-4">Job Categories</h2>
                        {user?.categories && user.categories.length > 0 ? (
                            <div className="flex flex-wrap gap-2 mb-6">
                                {user.categories.map((category, index) => (
                                    <Badge key={index} className="px-3 py-1">
                                        {category}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 mb-6">No job categories added</p>
                        )}

                        <Divider className="my-6" />

                        <h2 className="text-xl font-semibold mb-4">Skills</h2>
                        {user?.skills && user.skills.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {user.skills.map((skill, index) => (
                                    <Badge key={index} className="px-3 py-1">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No skills added</p>
                        )}
                    </Card>
                </div>
            )}
        </div>
    );
};

export default JobSeekerProfile;