"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Hotel, MapPin, Calendar, ArrowLeft, Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AddListingPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login?redirect=/add-listing");
        }
    }, [user, loading, router]);

    if (loading || !user) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-emerald-600" />
        </div>
    );

    const contributionTypes = [
        { title: "Stay", href: "/contribute/stay", icon: <Hotel className="w-5 h-5 flex-shrink-0" />, description: "Hotels, Resorts, Homestays" },
        { title: "Place", href: "/contribute/place", icon: <MapPin className="w-5 h-5 flex-shrink-0" />, description: "Attractions, Secret Spots" },
        { title: "Event", href: "/contribute/event", icon: <Calendar className="w-5 h-5 flex-shrink-0" />, description: "Festivals, Cultural Shows" },
    ];

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* Header Area */}
            <div className="bg-white border-b sticky top-0 z-30">
                <div className="container mx-auto px-6 h-24 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">List Property</h1>
                        <p className="text-sm text-gray-500 font-medium">Manage your contributions to Kerala's guide</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="outline" asChild className="rounded-xl font-bold text-xs uppercase tracking-widest px-6 h-12">
                            <Link href="/profile">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Profile
                            </Link>
                        </Button>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="rounded-xl font-bold text-xs uppercase tracking-widest px-8 h-12 bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200">
                                    Add New Listing <ChevronDown className="ml-2 h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl border-gray-100 shadow-2xl">
                                {contributionTypes.map((type) => (
                                    <DropdownMenuItem key={type.title} asChild>
                                        <Link href={type.href} className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 transition-colors">
                                            <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-emerald-100 transition-colors">
                                                {type.icon}
                                            </div>
                                            <div>
                                                <div className="font-bold text-sm">{type.title}</div>
                                                <div className="text-[10px] opacity-60 font-medium uppercase tracking-tighter">{type.description}</div>
                                            </div>
                                        </Link>
                                    </DropdownMenuItem>
                                ))}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </div>

            <div className="container mx-auto py-12 px-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {/* Stats Cards */}
                    <Card className="rounded-[2rem] border-none shadow-sm bg-white overflow-hidden p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600">
                                <Hotel className="w-6 h-6" />
                            </div>
                            <div className="text-xs font-black uppercase tracking-widest text-gray-400">Total Stays</div>
                        </div>
                        <div className="text-4xl font-black text-gray-900">{user.stats?.contributions || 0}</div>
                    </Card>

                    <Card className="rounded-[2rem] border-none shadow-sm bg-white overflow-hidden p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-4 bg-amber-50 rounded-2xl text-amber-600">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <div className="text-xs font-black uppercase tracking-widest text-gray-400">Total Places</div>
                        </div>
                        <div className="text-4xl font-black text-gray-900">0</div>
                    </Card>

                    <Card className="rounded-[2rem] border-none shadow-sm bg-white overflow-hidden p-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-4 bg-purple-50 rounded-2xl text-purple-600">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <div className="text-xs font-black uppercase tracking-widest text-gray-400">Active Events</div>
                        </div>
                        <div className="text-4xl font-black text-gray-900">0</div>
                    </Card>
                </div>

                {/* Submissions Table */}
                <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
                    <div className="p-10 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                            <div className="w-2 h-8 bg-emerald-500 rounded-full" />
                            Your Recent Submissions
                        </h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] border-b border-gray-50">
                                <tr>
                                    <th className="px-10 py-5">Property / Landmark</th>
                                    <th className="px-10 py-5">Type</th>
                                    <th className="px-10 py-5">Status</th>
                                    <th className="px-10 py-5">Date</th>
                                    <th className="px-10 py-5 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                <tr className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-10 py-8 min-w-[300px]">
                                        <div className="font-bold text-gray-900 text-lg">Morning Tea Homestay</div>
                                        <div className="text-sm text-gray-400 font-medium">Munnar, Idukki</div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <span className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest">Stay</span>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                                            <span className="text-amber-600 font-bold text-xs uppercase tracking-widest">Under Review</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8 text-gray-500 font-medium">Feb 12, 2026</td>
                                    <td className="px-10 py-8 text-right">
                                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-emerald-50 hover:text-emerald-600">
                                            <ArrowRight className="w-5 h-5" />
                                        </Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <div className="p-20 text-center">
                            <div className="max-w-xs mx-auto space-y-4">
                                <div className="p-6 bg-gray-50 rounded-[2.5rem] w-fit mx-auto">
                                    <Hotel className="w-10 h-10 text-gray-200" />
                                </div>
                                <p className="text-gray-400 text-sm font-medium">Track your property verification status in real-time. Start by adding a new listing.</p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
