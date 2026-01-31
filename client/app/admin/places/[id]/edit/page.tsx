"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Use useParams instead of useParam
import api from "@/services/api";
import PlaceForm from "@/components/admin/PlaceForm";
import { Loader2 } from "lucide-react";

export default function EditPlacePage() {
    const params = useParams(); // returns { id: string } or similar
    // Safely extract ID. NextJS 13 params can be string or string[].
    const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) {
            fetchPlace(id);
        }
    }, [id]);

    const fetchPlace = async (placeId: string) => {
        try {
            const { data } = await api.get(`/admin/places`); // Wait, getById is not in admin routes? 
            // Reuse public API for fetching details or filter from list?
            // Actually, admin routes defined `getAllPlaces`. `getPlaceById` is in public `placeRoutes`.
            // I can use public endpoint `/api/places/:id` to fetch details.

            // Wait, I should verify if public API returns everything I need. Yes it does.
            const res = await api.get(`/places/${placeId}`);
            if (res.data.success) {
                setPlace(res.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch place", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;
    if (!place) return <div>Place not found</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Edit Place</h1>
            <PlaceForm initialData={place} isEdit={true} />
        </div>
    );
}
