"use client";

import PlaceForm from "@/components/admin/PlaceForm";

export default function AddPlacePage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Add New Place</h1>
            <PlaceForm />
        </div>
    );
}
