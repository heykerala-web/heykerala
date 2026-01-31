"use client";

import { useEffect, useState } from "react";
import { stayService, Stay, StayParams } from "@/services/stayService";
import { StayCard } from "@/components/StayCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Loader2, Search } from "lucide-react";

export default function StayPage() {
    const [stays, setStays] = useState<Stay[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<StayParams>({});
    const [search, setSearch] = useState("");

    const fetchStays = async () => {
        setLoading(true);
        try {
            const response = await stayService.getAll({ ...filters, search });
            if (response && response.success) {
                setStays(response.data);
            } else {
                setStays([]);
            }
        } catch (error) {
            console.error("Failed to fetch stays", error);
            setStays([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStays();
    }, [filters]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchStays();
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header & Search */}
            <div className="bg-white border-b sticky top-0 z-30 py-4 shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                        <h1 className="text-2xl font-bold hidden md:block">Stays</h1>

                        <form onSubmit={handleSearch} className="flex gap-2 w-full md:max-w-2xl">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search by name, district..."
                                    className="pl-10"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            <Select onValueChange={(val) => setFilters({ ...filters, type: val === 'all' ? undefined : val })}>
                                <SelectTrigger className="w-[140px] md:w-[180px]">
                                    <SelectValue placeholder="Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Types</SelectItem>
                                    <SelectItem value="hotel">Hotel</SelectItem>
                                    <SelectItem value="resort">Resort</SelectItem>
                                    <SelectItem value="homestay">Homestay</SelectItem>
                                    <SelectItem value="restaurant">Restaurant</SelectItem>
                                    <SelectItem value="cafe">Cafe</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button type="submit">Search</Button>
                        </form>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    </div>
                ) : stays.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {stays.map((stay) => (
                            <StayCard
                                key={stay._id}
                                id={stay._id}
                                name={stay.name}
                                type={stay.type}
                                district={stay.district}
                                image={stay.images[0]}
                                rating={stay.ratingAvg}
                                price={stay.price}
                                amenities={stay.amenities}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="bg-white p-8 rounded-2xl shadow-sm inline-block max-w-md">
                            <p className="text-xl font-semibold text-gray-800 mb-2">No stays found</p>
                            <p className="text-gray-500 mb-6">We couldn't find any stays matching your filters. Try adjusting them.</p>
                            <Button variant="outline" onClick={() => { setSearch(""); setFilters({}); }}>Clear All Filters</Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
