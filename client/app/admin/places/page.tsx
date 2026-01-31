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
import { Plus, Edit, Trash2, MapPin } from "lucide-react";
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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manage Places</h1>
                <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                    <Link href="/admin/places/new">
                        <Plus className="mr-2 h-4 w-4" /> Add New Place
                    </Link>
                </Button>
            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>District</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {places.map((place) => (
                            <TableRow key={place._id}>
                                <TableCell className="font-medium">{place.name}</TableCell>
                                <TableCell>
                                    <div className="flex items-center text-gray-500">
                                        <MapPin className="mr-1 h-3 w-3" />
                                        {place.location}
                                    </div>
                                </TableCell>
                                <TableCell>{place.district}</TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-xs font-medium text-gray-700">
                                        {place.category}
                                    </span>
                                </TableCell>
                                <TableCell>{place.rating}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button asChild variant="ghost" size="sm">
                                            <Link href={`/admin/places/${place._id}/edit`}>
                                                <Edit className="h-4 w-4 text-blue-600" />
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleDelete(place._id)}
                                        >
                                            <Trash2 className="h-4 w-4 text-red-600" />
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
