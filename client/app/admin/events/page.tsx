"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { eventService, Event } from "@/services/eventService";
import { Button } from "@/components/ui/button";
import { Plus, Trash, Eye, MapPin, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/services/api";

export default function AdminEventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchEvents = async () => {
        try {
            const data = await eventService.getAll({ category: "all" });
            setEvents(data);
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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manage Events</h1>
                <Link href="/admin/events/create">
                    <Button className="flex items-center gap-2">
                        <Plus className="h-4 w-4" /> Add New Event
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-700 uppercase">
                        <tr>
                            <th className="px-6 py-3">Title</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Venue</th>
                            <th className="px-6 py-3">Category</th>
                            <th className="px-6 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event) => (
                            <tr key={event._id} className="border-b hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{event.title}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3 w-3" /> {new Date(event.startDate).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" /> {event.venue}, {event.district}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">
                                        {event.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 flex gap-2">
                                    <Link href={`/admin/events/edit/${event._id}`}>
                                        <Button size="icon" variant="ghost" className="text-blue-600"><span className="sr-only">Edit</span>✎</Button>
                                    </Link>
                                    <Link href={`/events/${event._id}`} target="_blank">
                                        <Button size="icon" variant="ghost"><Eye className="h-4 w-4" /></Button>
                                    </Link>
                                    <Button size="icon" variant="ghost" className="text-red-500" onClick={() => handleDelete(event._id)}>
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        {events.length === 0 && (
                            <tr><td colSpan={5} className="text-center py-6 text-gray-500">No events found.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
