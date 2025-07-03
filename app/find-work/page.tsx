/* eslint-disable */

import { categoriesData, experienceLevels, jobTypeData } from '@/public/data';

import { FaSearch } from 'react-icons/fa';
import { FaFilter, FaMapPin } from 'react-icons/fa6';
import ActiveWorks from './activeWorks';



const FindWorkPage = async () => {


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
                                        {jobTypeData.map((type, idx) => (
                                            <label key={type?.id || idx} className="flex items-center gap-2">
                                                <input type="checkbox" className="rounded text-blue-600" />
                                                <span>{type?.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Experience Level */}
                                <div>
                                    <h3 className="font-medium mb-3">Experience Level</h3>
                                    <div className="space-y-2">
                                        {experienceLevels.map((level, idx) => (
                                            <label key={level?.id || idx} className="flex items-center gap-2">
                                                <input type="checkbox" className="rounded text-blue-600" />
                                                <span>{level?.name}</span>
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
                                    /*  value={selectedCategory}
                                     onChange={(e) => setSelectedCategory(e.target.value)} */
                                    className="p-2 border rounded-md"
                                >
                                    <option value="all" disabled className='text-white' >All Categories</option>
                                    {
                                        categoriesData.map((category, idx) => (
                                            <option key={category.id || idx} value={category.name}>{category.name}</option>
                                        ))
                                    }
                                </select>
                            </div>

                            {/* Job Cards */}
                            <ActiveWorks />

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
