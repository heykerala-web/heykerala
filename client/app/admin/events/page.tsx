"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { eventService, Event } from "@/services/eventService";
import { Button } from "@/components/ui/button";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Calendar, Edit, Star, StarOff, Upload, RefreshCw, Eye, Bell, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { EventStatusBadge } from "@/components/events/EventStatusBadge";

// ── CSV util ──────────────────────────────────────────────────
function parseCSV(text: string): any[] {
    const lines = text.trim().split("\n");
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map(h => h.trim().replace(/^"|"$/g, ""));
    return lines.slice(1).map(line => {
        const values = line.split(",").map(v => v.trim().replace(/^"|"$/g, ""));
        return headers.reduce((obj: any, h, i) => { obj[h] = values[i] || ""; return obj; }, {});
    });
}

export default function AdminEventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [expiring, setExpiring] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [csvPreview, setCsvPreview] = useState<any[]>([]);
    const fileRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    const fetchEvents = async () => {
        try {
            const response = await eventService.getAll();
            setEvents(Array.isArray(response.data) ? response.data : []);
        } catch { setEvents([]); }
        finally { setLoading(false); }
    };

    useEffect(() => { fetchEvents(); }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this event? This cannot be undone.")) return;
        try {
            await eventService.delete(id);
            setEvents(events.filter(e => e._id !== id));
            toast({ title: "Event deleted" });
        } catch { toast({ title: "Failed to delete", variant: "destructive" }); }
    };

    const handleToggleFeatured = async (id: string) => {
        try {
            const res = await eventService.toggleFeatured(id);
            setEvents(events.map(e => e._id === id ? { ...e, isFeatured: res.isFeatured } : e));
            toast({ title: res.message });
        } catch { toast({ title: "Failed to toggle featured", variant: "destructive" }); }
    };

    const handleAutoExpire = async () => {
        setExpiring(true);
        try {
            const res = await eventService.autoExpire();
            toast({ title: `Updated: ${res.updated?.ongoing || 0} ongoing, ${res.updated?.completed || 0} completed` });
            fetchEvents();
        } catch { toast({ title: "Auto-expire failed", variant: "destructive" }); }
        finally { setExpiring(false); }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            const text = ev.target?.result as string;
            const parsed = parseCSV(text);
            setCsvPreview(parsed);
        };
        reader.readAsText(file);
    };

    const handleBulkUpload = async () => {
        if (csvPreview.length === 0) return;
        setUploading(true);
        try {
            const res = await eventService.bulkUpload(csvPreview);
            toast({ title: `✅ Created ${res.results?.created} events, ${res.results?.failed} failed` });
            setShowUploadModal(false);
            setCsvPreview([]);
            if (fileRef.current) fileRef.current.value = "";
            fetchEvents();
        } catch { toast({ title: "Upload failed", variant: "destructive" }); }
        finally { setUploading(false); }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64 text-gray-400">
            <Loader2 className="h-8 w-8 animate-spin mr-3" /> Loading events…
        </div>
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-end gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Manage Events</h1>
                    <p className="text-slate-500 font-medium mt-1">
                        {events.length} events total · Oversee Kerala&apos;s events and festivals
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={handleAutoExpire}
                        disabled={expiring}
                        className="rounded-xl font-bold border-orange-200 text-orange-600 hover:bg-orange-50"
                    >
                        {expiring ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                        Auto-Expire
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => setShowUploadModal(true)}
                        className="rounded-xl font-bold border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                        <Upload className="h-4 w-4 mr-2" /> Bulk Upload CSV
                    </Button>
                    <Button asChild className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold h-10 px-5">
                        <Link href="/admin/events/create">
                            <Plus className="mr-2 h-4 w-4" /> Add Event
                        </Link>
                    </Button>
                </div>
            </div>

            {/* CSV Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-blue-50">
                            <div>
                                <h3 className="font-black text-gray-900">Bulk Upload Events</h3>
                                <p className="text-xs text-gray-500 mt-0.5">CSV columns: title, description, category, district, venue, startDate, endDate, time, ticketUrl</p>
                            </div>
                            <button onClick={() => { setShowUploadModal(false); setCsvPreview([]); }} className="p-2 hover:bg-blue-100 rounded-full">
                                <X className="h-5 w-5 text-gray-500" />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <input
                                ref={fileRef}
                                type="file"
                                accept=".csv"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-blue-50 file:text-blue-700 file:font-bold cursor-pointer"
                            />
                            {csvPreview.length > 0 && (
                                <div>
                                    <p className="text-sm font-bold text-gray-700 mb-2">{csvPreview.length} events found in CSV</p>
                                    <div className="overflow-x-auto max-h-64 border border-gray-100 rounded-2xl">
                                        <table className="w-full text-xs">
                                            <thead className="bg-gray-50 sticky top-0">
                                                <tr>
                                                    {Object.keys(csvPreview[0]).map(k => (
                                                        <th key={k} className="px-3 py-2 text-left font-bold text-gray-500 uppercase tracking-wider">{k}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-50">
                                                {csvPreview.slice(0, 5).map((row, i) => (
                                                    <tr key={i} className="hover:bg-gray-50">
                                                        {Object.values(row).map((val: any, j) => (
                                                            <td key={j} className="px-3 py-2 text-gray-600 truncate max-w-[120px]">{val}</td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {csvPreview.length > 5 && (
                                            <p className="text-center text-xs text-gray-400 py-2">…and {csvPreview.length - 5} more rows</p>
                                        )}
                                    </div>
                                </div>
                            )}
                            <div className="flex gap-3">
                                <Button
                                    onClick={handleBulkUpload}
                                    disabled={uploading || csvPreview.length === 0}
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
                                >
                                    {uploading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                                    Upload {csvPreview.length > 0 ? `(${csvPreview.length} events)` : ""}
                                </Button>
                                <Button variant="outline" onClick={() => { setShowUploadModal(false); setCsvPreview([]); }} className="rounded-xl">
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Events Table */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)] overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50/50">
                        <TableRow className="border-b border-slate-100 hover:bg-transparent">
                            <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-xs py-5 pl-6">Event</TableHead>
                            <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-xs py-5">Date</TableHead>
                            <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-xs py-5">Status</TableHead>
                            <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-xs py-5">Stats</TableHead>
                            <TableHead className="font-bold text-slate-400 uppercase tracking-widest text-xs py-5 text-right pr-6">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {events.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-16 text-slate-400 font-medium">
                                    No events found. Add your first event!
                                </TableCell>
                            </TableRow>
                        ) : events.map((event) => (
                            <TableRow key={event._id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                                <TableCell className="py-4 pl-6">
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-300 flex-shrink-0">
                                            <Calendar className="h-4 w-4" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900 group-hover:text-emerald-600 transition-colors text-sm line-clamp-1">
                                                {event.title}
                                                {event.isFeatured && <span className="ml-2 text-amber-500 text-xs">⭐</span>}
                                            </div>
                                            <div className="text-xs text-slate-400">{event.district} · {event.category}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm font-semibold text-slate-700">
                                        {new Date(event.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                                    </div>
                                    <div className="text-xs text-slate-400">{event.time || "All Day"}</div>
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        {(event as any).eventStatus && <EventStatusBadge status={(event as any).eventStatus} />}
                                        {event.status === 'pending' && (
                                            <span className="inline-block text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-600 border border-yellow-100">
                                                Pending Approval
                                            </span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-3 text-xs text-slate-500 font-bold">
                                        <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{event.viewCount || 0}</span>
                                        <span className="flex items-center gap-1"><Bell className="h-3 w-3" />{event.reminderCount || 0}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right pr-6">
                                    <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-all">
                                        {/* Featured Toggle */}
                                        <button
                                            title={event.isFeatured ? "Unfeature" : "Feature"}
                                            onClick={() => handleToggleFeatured(event._id)}
                                            className={`h-8 w-8 rounded-xl flex items-center justify-center transition-colors
                                                ${event.isFeatured ? "bg-amber-50 text-amber-500 hover:bg-amber-100" : "hover:bg-gray-100 text-slate-400"}`}
                                        >
                                            {event.isFeatured ? <Star className="h-4 w-4 fill-current" /> : <StarOff className="h-4 w-4" />}
                                        </button>
                                        <Button asChild variant="ghost" size="icon" className="h-8 w-8 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50">
                                            <Link href={`/admin/events/edit/${event._id}`}><Edit className="h-3.5 w-3.5" /></Link>
                                        </Button>
                                        <button
                                            onClick={() => handleDelete(event._id)}
                                            className="h-8 w-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
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
