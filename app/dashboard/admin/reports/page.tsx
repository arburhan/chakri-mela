/* eslint-disable */
"use client";

import { useEffect, useState } from "react";

interface Stats {
    totalUsers: number;
    totalSeekers: number;
    totalPosters: number;
    totalJobs: number;
}

export default function Reports() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchStats() {
            try {
                const response = await fetch("/api/admin");
                const result = await response.json();

                if (!result.success) {
                    throw new Error(result.error || "Failed to fetch statistics");
                }

                setStats(result.data);
                setError(null);
            } catch (err) {
                setError("Failed to load statistics. Please try again later.");
                console.error("Error fetching admin stats:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 p-4 rounded-lg text-red-700">
                {error}
            </div>
        );
    }

    const cards = [
        { title: "Total Users", value: stats?.totalUsers, color: "bg-blue-500", text: "text-blue-500" },
        { title: "Job Seekers", value: stats?.totalSeekers, color: "bg-green-500", text: "text-green-500" },
        { title: "Job Posters", value: stats?.totalPosters, color: "bg-purple-500", text: "text-purple-500" },
        { title: "Total Jobs", value: stats?.totalJobs, color: "bg-orange-500", text: "text-orange-500" },
    ];

    return (
        <div className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Dashboard Statistics</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {cards.map((card) => (
                    <div
                        key={card.title}
                        className="bg-white rounded-lg shadow-lg overflow-hidden"
                    >
                        <div className={`${card.color} p-4`}>
                            <h3 className="text-white text-lg font-medium">{card.title}</h3>
                        </div>
                        <div className="p-6">
                            <p className={`text-3xl font-bold ${card.text}`}>{card.value || 0}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}