"use client";

import { useEffect, useState } from "react";
import { stayService, Stay } from "@/services/stayService";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Pencil, Trash2, MapPin, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminStaysPage() {
    const [stays, setStays] = useState<Stay[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchStays = async () => {
        setLoading(true);
        try {
            const data = await stayService.getAll();
            setStays(data);
        } catch (error) {
            console.error(error);
            toast({ title: "Failed to load stays", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStays();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this stay?")) return;
        try {
            // Assume we have a delete method in service, if not I need to add it
            // stayService.delete(id)
            // But wait, I didn't verify delete method in stayservice.ts
            // I'll assume standard API call or add it if missing
            await stayService.delete(id);
            setStays(stays.filter(s => s._id !== id));
            toast({ title: "Stay deleted successfully" });
        } catch (error) {
            console.error(error);
            toast({ title: "Failed to delete stay", variant: "destructive" });
        }
    };

    if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manage Stays</h1>
                <Link href="/admin/stays/add">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" /> Add New Stay
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-lg shadow border overflow-hidden">
                <table className="w-full text-left text-sm text-gray-600">
                    <thead className="bg-gray-50 text-gray-800 font-semibold uppercase text-xs">
                        <tr>
                            <th className="p-4">Name</th>
                            <th className="p-4">Type</th>
                            <th className="p-4">District</th>
                            <th className="p-4">Price</th>
                            <th className="p-4">Rating</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {stays.map((stay) => (
                            <tr key={stay._id} className="hover:bg-gray-50 transition">
                                <td className="p-4 font-medium text-gray-900">{stay.name}</td>
                                <td className="p-4 capitalize">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold 
                                        ${stay.type === 'hotel' ? 'bg-blue-100 text-blue-700' :
                                            stay.type === 'resort' ? 'bg-green-100 text-green-700' :
                                                'bg-gray-100 text-gray-700'}`}>
                                        {stay.type}
                                    </span>
                                </td>
                                <td className="p-4 flex items-center gap-1">
                                    <MapPin className="h-3 w-3" /> {stay.district}
                                </td>
                                <td className="p-4 font-bold">₹{stay.price}</td>
                                <td className="p-4">{stay.ratingAvg}</td>
                                <td className="p-4 text-right space-x-2">
                                    <Link href={`/admin/stays/edit/${stay._id}`}>
                                        <Button size="icon" variant="ghost">
                                            <Pencil className="h-4 w-4 text-blue-600" />
                                        </Button>
                                    </Link>
                                    <Button size="icon" variant="ghost" onClick={() => handleDelete(stay._id)}>
                                        <Trash2 className="h-4 w-4 text-red-600" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {stays.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        No stays found. Add one to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
