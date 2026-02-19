"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { eventService, Event } from "@/services/eventService";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Trash, Eye, MapPin, Calendar, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

export default function AdminEventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchEvents = async () => {
        try {
            const response = await eventService.getAll({ category: "all" });
            if (response.success && Array.isArray(response.data)) {
                setEvents(response.data);
            } else if (Array.isArray(response)) {
                setEvents(response);
            } else {
                setEvents([]);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this event?")) return;
        try {
            await eventService.delete(id);
            setEvents(events.filter(e => e._id !== id));
            toast({ title: "Event deleted successfully" });
        } catch (error) {
            toast({ title: "Failed to delete", variant: "destructive" });
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manage Events</h1>
                    <p className="text-slate-500 font-medium mt-2">Oversee upcoming local events and festivals.</p>
                </div>
                <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-lg shadow-emerald-500/20 font-bold h-12 px-6 transition-all hover:scale-105 active:scale-95">
                    <Link href="/admin/events/create">
                        <Plus className="mr-2 h-5 w-5" /> Add New Event
                    </Link>
                </Button>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="border-b border-slate-100 hover:bg-transparent">
                            <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-xs py-6 pl-8">Event Name</TableHead>
                            <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-xs py-6">Date & Time</TableHead>
                            <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-xs py-6">Location</TableHead>
                            <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-xs py-6">Category</TableHead>
                            <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-xs py-6 text-right pr-8">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {events.map((event) => (
                            <TableRow key={event._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                <TableCell className="py-5 pl-8">
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-xl bg-slate-100 overflow-hidden relative shadow-inner flex items-center justify-center text-slate-300">
                                            {/* Ideally display image here if available */}
                                            <Calendar className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{event.title}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-slate-700">{new Date(event.startDate).toLocaleDateString()}</span>
                                        <span className="text-xs text-slate-400">{event.time}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center text-slate-500 text-sm">
                                        <MapPin className="mr-1.5 h-3.5 w-3.5" />
                                        {event.venue}, {event.district}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-purple-50 text-purple-600 border border-purple-100 text-[10px] font-bold uppercase tracking-wide">
                                        {event.category}
                                    </span>
                                </TableCell>
                                <TableCell className="text-right pr-8">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                                        <Button asChild variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors">
                                            <Link href={`/admin/events/edit/${event._id}`}>
                                                <Edit className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(event._id)}
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
