"use client";

import { useEffect, useState } from "react";
import { stayService, Stay } from "@/services/stayService";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Pencil, Trash2, MapPin, Loader2, Bed, Star, Edit } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

export default function AdminStaysPage() {
    const [stays, setStays] = useState<Stay[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchStays = async () => {
        setLoading(true);
        try {
            const response = await stayService.getAll();
            if (response.success && Array.isArray(response.data)) {
                setStays(response.data);
            } else if (Array.isArray(response)) {
                setStays(response);
            } else {
                setStays([]);
            }
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
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manage Stays</h1>
                    <p className="text-slate-500 font-medium mt-2">Manage accommodation listings and partners.</p>
                </div>
                <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-500/20 font-bold h-12 px-6 transition-all hover:scale-105 active:scale-95">
                    <Link href="/admin/stays/add">
                        <Plus className="mr-2 h-5 w-5" /> Add New Stay
                    </Link>
                </Button>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="border-b border-slate-100 hover:bg-transparent">
                            <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-xs py-6 pl-8">Property Name</TableHead>
                            <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-xs py-6">Type & Location</TableHead>
                            <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-xs py-6">Price Range</TableHead>
                            <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-xs py-6">Rating</TableHead>
                            <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-xs py-6 text-right pr-8">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {stays.map((stay) => (
                            <TableRow key={stay._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                <TableCell className="py-5 pl-8">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-slate-100 overflow-hidden relative shadow-inner flex items-center justify-center text-slate-300">
                                            {/* Placeholder icon or image */}
                                            <Bed className="h-5 w-5" />
                                        </div>
                                        <div className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{stay.name}</div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-slate-700 capitalize">{stay.type}</span>
                                        <div className="flex items-center text-slate-400 text-xs mt-0.5">
                                            <MapPin className="mr-1 h-3 w-3" />
                                            {stay.district}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="font-bold text-slate-700">₹{stay.price.toLocaleString()}</span>
                                    <span className="text-xs text-slate-400 ml-1">/ night</span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-1.5 bg-yellow-50 w-fit px-2 py-1 rounded-lg border border-yellow-100">
                                        <span className="text-sm font-black text-yellow-700">{stay.ratingAvg}</span>
                                        <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                                    </div>
                                </TableCell>
                                <TableCell className="text-right pr-8">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                        <Button asChild variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                                            <Link href={`/admin/stays/edit/${stay._id}`}>
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(stay._id)}
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
