"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, MapPin, Star } from "lucide-react";
import toast from "react-hot-toast";

interface PlaceType {
    _id: string;
    name: string;
    location: string;
    category: string;
    district: string;
    rating: number;
}

export default function PlacesPage() {
    const [places, setPlaces] = useState<PlaceType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPlaces();
    }, []);

    const fetchPlaces = async () => {
        try {
            // Use admin endpoint for raw list without frontend filters if desired
            // Or reuse public endpoint but admin specific usually better
            const { data } = await api.get("/admin/places");
            if (data.success) {
                setPlaces(data.places);
            }
        } catch (error) {
            toast.error("Failed to fetch places");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This action cannot be undone.")) return;
        try {
            await api.delete(`/admin/places/${id}`);
            setPlaces((prev) => prev.filter((p) => p._id !== id));
            toast.success("Place deleted");
        } catch (error) {
            toast.error("Failed to delete place");
        }
    };

    if (loading) return <div>Loading places...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manage Places</h1>
                    <p className="text-slate-500 font-medium mt-2">Curate and oversee travel destinations.</p>
                </div>
                <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-500/20 font-bold h-12 px-6 transition-all hover:scale-105 active:scale-95">
                    <Link href="/admin/places/new">
                        <Plus className="mr-2 h-5 w-5" /> Add New Place
                    </Link>
                </Button>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="border-b border-slate-100 hover:bg-transparent">
                            <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-xs py-6 pl-8">Place Name</TableHead>
                            <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-xs py-6">Location</TableHead>
                            <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-xs py-6">Category</TableHead>
                            <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-xs py-6">Rating</TableHead>
                            <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-xs py-6 text-right pr-8">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {places.map((place) => (
                            <TableRow key={place._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                <TableCell className="py-5 pl-8">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-slate-100 overflow-hidden relative shadow-inner">
                                            {/* We could add an image here if available in the API response, assuming place.image or places.images[0] exists but current interface doesn't strictly show it. Let's try to be safe or add a placeholder icon */}
                                            <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                                <MapPin className="h-5 w-5" />
                                            </div>
                                            {/* If we had images: <img src={place.image} className="h-full w-full object-cover" /> */}
                                        </div>
                                        <div className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{place.name}</div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-slate-700">{place.location}</span>
                                        <span className="text-xs text-slate-400">{place.district}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-bold uppercase tracking-wide">
                                        {place.category}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1.5 bg-yellow-50 w-fit px-2 py-1 rounded-lg border border-yellow-100">
                                        <span className="text-sm font-black text-yellow-700">{place.rating}</span>
                                        <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                                    </div>
                                </TableCell>
                                <TableCell className="text-right pr-8">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                        <Button asChild variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                                            <Link href={`/admin/places/${place._id}/edit`}>
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(place._id)}
                                            className="h-9 w-9 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
