/* eslint-disable */
import React from 'react';

const JobDetailsLoading = () => {
    return (
        <section className="py-8 bg-gray-100 text-black">
            <div className="container mx-auto px-4 max-w-5xl">
                {/* Breadcrumb loading */}
                <div className="pb-4 animate-pulse">
                    <div className="h-4 bg-gray-300 rounded w-40"></div>
                </div>

                {/* Job Header loading */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6 animate-pulse">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <div className="h-7 bg-gray-300 rounded w-3/4 mb-2"></div>
                            <div className="flex flex-wrap gap-2 mb-4">
                                <div className="h-4 bg-gray-300 rounded w-20"></div>
                                <div className="h-4 bg-gray-300 rounded w-4"></div>
                                <div className="h-4 bg-gray-300 rounded w-40"></div>
                            </div>
                        </div>
                        <div>
                            <div className="h-10 bg-gray-300 rounded w-32 mb-5"></div>
                            <div className="h-10 bg-gray-300 rounded w-32"></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                            <div>
                                <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
                                <div className="h-6 bg-gray-300 rounded w-20"></div>
                                <div className="h-3 bg-gray-300 rounded w-16 mt-1"></div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                            <div>
                                <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
                                <div className="h-6 bg-gray-300 rounded w-28"></div>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                            <div>
                                <div className="h-4 bg-gray-300 rounded w-24 mb-1"></div>
                                <div className="h-6 bg-gray-300 rounded w-32"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content loading */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 animate-pulse">
                            <div className="h-6 bg-gray-300 rounded w-40 mb-4"></div>
                            <div className="space-y-2 mb-6">
                                <div className="h-4 bg-gray-300 rounded w-full"></div>
                                <div className="h-4 bg-gray-300 rounded w-full"></div>
                                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                <div className="h-4 bg-gray-300 rounded w-5/6"></div>
                                <div className="h-4 bg-gray-300 rounded w-full"></div>
                            </div>

                            <div className="h-6 bg-gray-300 rounded w-48 mb-3"></div>
                            <div className="flex flex-wrap gap-2 mb-6">
                                <div className="h-8 bg-gray-300 rounded-full w-16"></div>
                                <div className="h-8 bg-gray-300 rounded-full w-20"></div>
                                <div className="h-8 bg-gray-300 rounded-full w-24"></div>
                                <div className="h-8 bg-gray-300 rounded-full w-20"></div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-1 animate-pulse">
                        <div className="h-40 bg-gray-300 rounded mb-6"></div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default JobDetailsLoading;