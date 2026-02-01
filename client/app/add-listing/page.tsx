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
        {
            title: "Sanctuary",
            label: "Hotel, Resort, Homestay",
            icon: <Hotel className="w-12 h-12" />,
            color: "text-teal-600",
            bg: "bg-teal-50",
            href: "/contribute/stay",
            description: "Share a peaceful retreat where stories are written over morning tea."
        },
        {
            title: "Heritage",
            label: "Attraction, Secret Spot",
            icon: <MapPin className="w-12 h-12" />,
            color: "text-amber-600",
            bg: "bg-amber-50",
            href: "/contribute/place",
            description: "Reveal the soul of Kerala through its hidden peaks and emerald paths."
        },
        {
            title: "Occasion",
            label: "Festival, Cultural Show",
            icon: <Calendar className="w-12 h-12" />,
            color: "text-rose-600",
            bg: "bg-rose-50",
            href: "/contribute/event",
            description: "Illuminate the celebration that brings the community to life."
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Cinematic Hero Background */}
            <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-gray-50 to-transparent pointer-events-none" />

            <div className="container mx-auto py-24 px-6 relative z-10">
                <div className="max-w-4xl mx-auto mb-24">
                    <Button variant="ghost" asChild className="mb-12 -ml-4 pl-4 hover:pl-6 transition-all text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                        <Link href="/dashboard" className="flex items-center">
                            <ArrowLeft className="mr-2 h-3 w-3" /> Dashboard
                        </Link>
                    </Button>

                    <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-[0.9] mb-8">
                        Capture the <br />
                        <span className="text-emerald-600">Soul of Kerala</span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl font-medium leading-relaxed">
                        Become a guardian of Kerala's narrative. Share your space, a hidden trail,
                        or a vibrant celebration with travelers from around the globe.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {contributionTypes.map((type, i) => (
                        <div
                            key={i}
                            onClick={() => router.push(type.href)}
                            className="group relative bg-white border border-gray-100 p-12 rounded-[3.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] transition-all duration-700 cursor-pointer overflow-hidden hover:-translate-y-4"
                        >
                            {/* Hover Background Accent */}
                            <div className={`absolute inset-0 ${type.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                            <div className="relative z-10 h-full flex flex-col">
                                <div className={`w-20 h-20 ${type.bg} ${type.color} rounded-3xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-700`}>
                                    {type.icon}
                                </div>

                                <div className="space-y-4 mb-10">
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 group-hover:text-gray-900 transition-colors">{type.label}</span>
                                    <h3 className="text-4xl font-black text-gray-900 leading-none">{type.title}</h3>
                                </div>

                                <p className="text-gray-500 font-medium leading-relaxed mb-12 flex-1 group-hover:text-gray-900 transition-colors">
                                    {type.description}
                                </p>

                                <div className="flex items-center gap-2 text-gray-900 font-black uppercase tracking-widest text-[10px]">
                                    Begin Contribution <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-32 text-center">
                    <p className="text-gray-300 font-bold uppercase tracking-[0.3em] text-[10px]">
                        God's Own Country &bull; Verified by Locals
                    </p>
                </div>
            </div>
        </div>
    );
}
