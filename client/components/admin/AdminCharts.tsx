"use client";

import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Legend
} from "recharts";

interface AdminChartsProps {
    data?: any; // Pass real data if available, else use mock
}

const mockData = [
    { name: "Jan", users: 400, reviews: 240, places: 20 },
    { name: "Feb", users: 300, reviews: 139, places: 15 },
    { name: "Mar", users: 200, reviews: 980, places: 45 },
    { name: "Apr", users: 278, reviews: 390, places: 30 },
    { name: "May", users: 189, reviews: 480, places: 60 },
    { name: "Jun", users: 239, reviews: 380, places: 50 },
    { name: "Jul", users: 349, reviews: 430, places: 70 },
];

export function AdminCharts({ data }: AdminChartsProps) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Growth Chart */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold text-slate-800 mb-6">User & Review Growth</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                            data={mockData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="colorReviews" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <XAxis dataKey="name" stroke="#cbd5e1" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#cbd5e1" fontSize={12} tickLine={false} axisLine={false} />
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#1e293b", borderRadius: "12px", border: "none", color: "#f8fafc" }}
                                itemStyle={{ color: "#f8fafc" }}
                            />
                            <Area type="monotone" dataKey="users" stroke="#10b981" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={3} />
                            <Area type="monotone" dataKey="reviews" stroke="#3b82f6" fillOpacity={1} fill="url(#colorReviews)" strokeWidth={3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Content Distribution */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Content Distribution</h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={mockData}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" stroke="#cbd5e1" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#cbd5e1" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip
                                cursor={{ fill: '#f1f5f9' }}
                                contentStyle={{ backgroundColor: "#1e293b", borderRadius: "12px", border: "none", color: "#f8fafc" }}
                            />
                            <Legend />
                            <Bar dataKey="places" name="New Places" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
