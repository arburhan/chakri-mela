/* eslint-disable */
"use client";
import { useEffect, useState } from "react";

const ShortStatics = () => {
    const [stats, setStats] = useState({
        currentJobPost: 0,
        totalJobPosts: 0,
        totalHires: 0,
        applyRate: 0,
    });
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        async function fetchStats() {
            setLoading(true);
            try {
                const res = await fetch("/api/poster/short-statics");
                if (!res.ok) throw new Error("Failed to fetch stats");
                const data = await res.json();
                setStats(data);
            } catch (e) {
                // Optionally handle error
            }
            setLoading(false);
        }
        fetchStats();
    }, []);
    return (
        <div className="w-full px-4">
            <div className="flex justify-end mb-4">
                <select
                    className="border border-gray-300 rounded-lg p-2"
                    onChange={(e) => {
                        // Handle filter change here
                        console.log(e.target.value);
                    }}
                >
                    <option value="7-days">Last 7 Days</option>
                    <option value="1-month">Last 1 Month</option>
                    <option value="1-year">Last 1 Year</option>
                    <option value="lifetime">Lifetime</option>
                </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white shadow rounded-lg p-6">
                    <h4 className="text-md font-semibold text-gray-700">Current Job Post</h4>
                    <p className="mt-2 text-3xl font-bold text-lime-600">{loading ? '-' : stats.currentJobPost}</p>
                    <p className="mt-1 text-sm text-gray-500">Filtered statistics</p>
                </div>
                <div className="bg-white shadow rounded-lg p-6">
                    <h4 className="text-md font-semibold text-gray-700">Total Job Posts</h4>
                    <p className="mt-2 text-3xl font-bold text-blue-600">{loading ? '-' : stats.totalJobPosts}</p>
                    <p className="mt-1 text-sm text-gray-500">Filtered statistics</p>
                </div>
                <div className="bg-white shadow rounded-lg p-6">
                    <h4 className="text-md font-semibold text-gray-700">Total Hires</h4>
                    <p className="mt-2 text-3xl font-bold text-green-600">{loading ? '-' : stats.totalHires}</p>
                    <p className="mt-1 text-sm text-gray-500">Filtered statistics</p>
                </div>
                <div className="bg-white shadow rounded-lg p-6">
                    <h4 className="text-md font-semibold text-gray-700">Apply Rate</h4>
                    <p className="mt-2 text-3xl font-bold text-green-600">{loading ? '-' : stats.applyRate}%</p>
                    <p className="mt-1 text-sm text-gray-500">Filtered statistics</p>
                </div>
            </div>
        </div>
    );
};

export default ShortStatics;