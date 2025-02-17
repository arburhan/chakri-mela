/* eslint-disable */
'use client'
import { allJobs, categories } from '@/public/data';
import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { FaBriefcase, FaClock, FaFilter, FaMapPin } from 'react-icons/fa6';
import moment from 'moment';



const FindWorkPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');

    return (
        <div className="min-h-screen bg-gray-50 pt-16 text-black">
            {/* Search Header */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Find Work</h1>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Search jobs..."
                                className="w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <FaSearch className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Location"
                                className="w-full md:w-48 pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <FaMapPin className="absolute left-3 top-3.5 text-gray-400 h-5 w-5" />
                        </div>
                        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2">
                            <FaSearch className="h-5 w-5" />
                            Search Jobs
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:w-1/4 w-full">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <FaFilter className="h-5 w-5" />
                                Filters
                            </h2>

                            <div className="space-y-6">
                                {/* Job Type */}
                                <div>
                                    <h3 className="font-medium mb-3">Job Type</h3>
                                    <div className="space-y-2">
                                        {['Full-time', 'Part-time', 'Contract'].map((type) => (
                                            <label key={type} className="flex items-center gap-2">
                                                <input type="checkbox" className="rounded text-blue-600" />
                                                <span>{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Experience Level */}
                                <div>
                                    <h3 className="font-medium mb-3">Experience Level</h3>
                                    <div className="space-y-2">
                                        {['Entry Level', 'Intermediate', 'Expert'].map((level) => (
                                            <label key={level} className="flex items-center gap-2">
                                                <input type="checkbox" className="rounded text-blue-600" />
                                                <span>{level}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Salary Range */}
                                <div>
                                    <h3 className="font-medium mb-3">Salary Range</h3>
                                    <select className="w-full p-2 border rounded-md  text-white">
                                        <option>Any</option>
                                        <option>$0 - $30</option>
                                        <option>$30 - $60</option>
                                        <option>$60 - $100</option>
                                        <option>$100+</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Job Listings */}
                    <div className="lg:w-3/4 w-full">
                        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                            <div className="flex items-center justify-between mb-6 flex-wrap gap-2  text-white">
                                <h2 className="text-lg font-semibold">Featured Jobs</h2>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="p-2 border rounded-md"
                                >
                                    {
                                        categories.map((category) => (
                                            <option key={category.id} value={category.name}>{category.name}</option>
                                        ))
                                    }
                                    <option value="all">All Categories</option>
                                    <option value="development">Development</option>
                                    <option value="design">Design</option>
                                    <option value="marketing">Marketing</option>
                                </select>
                            </div>

                            {/* Job Cards */}
                            <div className="space-y-6">
                                {allJobs.map((job) => (
                                    <div key={job.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                                        <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
                                            <div>
                                                <h3 className="text-lg font-semibold mb-2">{job.title}</h3>
                                                <p className="text-gray-600 mb-2">{job.company}</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {job.skills.map((skill) => (
                                                        <span key={skill} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-green-600 font-semibold">$8 - $12/hr</span>
                                                {/* <p className="text-gray-500 text-sm">Remote</p> */}
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between pt-4 border-t flex-wrap gap-4">
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <FaBriefcase className="h-4 w-4" />
                                                    Full-time
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <FaClock className="h-4 w-4" />
                                                    Posted {moment(job.createdAt).fromNow()}
                                                </span>
                                            </div>
                                            <button className="text-blue-600 hover:text-blue-700 font-medium">
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="flex justify-center mt-8">
                                <nav className="flex items-center gap-2">
                                    <button className="px-3 py-1 border rounded hover:bg-gray-50">Previous</button>
                                    <button className="px-3 py-1 bg-blue-600 text-white rounded">1</button>
                                    <button className="px-3 py-1 border rounded hover:bg-gray-50">2</button>
                                    <button className="px-3 py-1 border rounded hover:bg-gray-50">3</button>
                                    <button className="px-3 py-1 border rounded hover:bg-gray-50">Next</button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FindWorkPage;
