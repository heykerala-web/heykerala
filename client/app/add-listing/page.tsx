"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Hotel, MapPin, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AddListingPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login?redirect=/add-listing");
        }
    }, [user, loading, router]);

    if (loading) return null;

    if (!user) return null;

    return (
        <div className="container mx-auto py-12 px-4">
            <div className="mb-8">
                <Link href="/" className="inline-flex items-center text-sm text-gray-500 hover:text-emerald-600 mb-4 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to Home
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">List Your Property on HeyKerala</h1>
                <p className="text-gray-600 mt-2 max-w-2xl">
                    Join our network of hosts and help travelers discover the beauty of God's Own Country.
                    Select what you would like to list below.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-emerald-100" onClick={() => router.push('/add-listing/stay')}>
                    <CardHeader>
                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 text-emerald-600">
                            <Hotel className="h-6 w-6" />
                        </div>
                        <CardTitle>List a Stay</CardTitle>
                        <CardDescription>Hotels, resorts, homestays, or apartments.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full bg-emerald-600 hover:bg-emerald-700">Add Stay</Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-blue-100" onClick={() => router.push('/contribute/place')}>
                    <CardHeader>
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4 text-blue-600">
                            <MapPin className="h-6 w-6" />
                        </div>
                        <CardTitle>List a Place</CardTitle>
                        <CardDescription>Tourist attractions, hidden gems, or spots.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700">Add Place</Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow cursor-pointer border-purple-100" onClick={() => router.push('/contribute/event')}>
                    <CardHeader>
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4 text-purple-600">
                            <Calendar className="h-6 w-6" />
                        </div>
                        <CardTitle>List an Event</CardTitle>
                        <CardDescription>Festivals, cultural events, or workshops.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full bg-purple-600 hover:bg-purple-700">Add Event</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
