"use client";

import { useEffect, useState } from "react";
import api from "@/services/api";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Check, X, Edit, Trash2, Eye } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

export default function AdminSubmissionsPage() {
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState("pending");

    useEffect(() => {
        fetchSubmissions();
    }, [statusFilter]);

    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/admin/submissions?status=${statusFilter}`);
            if (data.success) {
                setSubmissions(data.submissions);
            }
        } catch (error) {
            console.error("Failed to fetch submissions", error);
            toast.error("Failed to fetch submissions");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string, type: string) => {
        if (!confirm("Are you sure you want to approve this submission?")) return;
        try {
            await api.put(`/admin/submissions/${type}/${id}/approve`);
            toast.success("Approved successfully");
            fetchSubmissions();
        } catch (error) {
            toast.error("Approval failed");
        }
    };

    const handleReject = async (id: string, type: string) => {
        if (!confirm("Are you sure you want to reject this submission?")) return;
        try {
            await api.put(`/admin/submissions/${type}/${id}/reject`);
            toast.success("Rejected successfully");
            fetchSubmissions();
        } catch (error) {
            toast.error("Rejection failed");
        }
    };

    const handleDelete = async (id: string, type: string) => {
        if (!confirm("Are you sure you want to DELETE this submission? This cannot be undone.")) return;
        try {
            await api.delete(`/admin/submissions/${type}/${id}`);
            toast.success("Deleted successfully");
            fetchSubmissions();
        } catch (error) {
            toast.error("Deletion failed");
        }
    }

    if (loading && submissions.length === 0) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold">Submission Reviews</h1>

            <Tabs defaultValue="pending" className="w-full" onValueChange={setStatusFilter}>
                <TabsList className="grid w-full grid-cols-3 max-w-md mb-8">
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>

                <TabsContent value={statusFilter} className="mt-0">
                    {loading ? (
                        <div className="flex bg-muted/20 h-64 items-center justify-center rounded-lg border">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground ml-2" />
                            <span className="text-muted-foreground ml-2">Loading...</span>
                        </div>
                    ) : submissions.length === 0 ? (
                        <div className="text-center py-12 border rounded-lg bg-muted/20">
                            <p className="text-gray-500">No {statusFilter} submissions found.</p>
                        </div>
                    ) : (
                        <div className="grid gap-6">
                            {submissions.map((item) => (
                                <Card key={item._id} className="overflow-hidden">
                                    <div className="flex flex-col md:flex-row gap-4">
                                        {/* Image Preview */}
                                        <div className="w-full md:w-64 h-48 relative bg-gray-100 shrink-0">
                                            {item.images?.[0] || item.image ? (
                                                <img
                                                    src={item.images?.[0] || item.image}
                                                    alt={item.name || item.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                    No Image
                                                </div>
                                            )}
                                            <div className="absolute top-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded uppercase">
                                                {item.type}
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 p-4 flex flex-col justify-between">
                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h3 className="text-xl font-bold">{item.name || item.title}</h3>
                                                        <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                                                            <span>By: {item.createdBy?.name || "Unknown User"}</span>
                                                            <span>•</span>
                                                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                                                        </p>
                                                    </div>
                                                    <div className={`px-2 py-1 rounded text-xs font-semibold capitalize
                                                        ${item.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                            item.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                                'bg-yellow-100 text-yellow-800'}`}>
                                                        {item.status}
                                                    </div>
                                                </div>

                                                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                                                    {item.description}
                                                </p>

                                                <div className="flex gap-2 mt-2 text-xs text-gray-500">
                                                    {item.district && <span className="px-2 py-1 bg-gray-100 rounded">{item.district}</span>}
                                                    {item.category && <span className="px-2 py-1 bg-gray-100 rounded">{item.category}</span>}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-3 mt-4 pt-4 border-t">
                                                {/* Edit (Generic link based on type, ideally admin edit pages) */}
                                                <Button size="sm" variant="outline" asChild>
                                                    <Link href={`/admin/${item.type.toLowerCase()}s/${item._id}/edit`}>
                                                        <Edit className="w-4 h-4 mr-1" /> Edit
                                                    </Link>
                                                </Button>

                                                {statusFilter === "pending" && (
                                                    <>
                                                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700" onClick={() => handleApprove(item._id, item.type)}>
                                                            <Check className="w-4 h-4 mr-1" /> Approve
                                                        </Button>
                                                        <Button size="sm" variant="destructive" onClick={() => handleReject(item._id, item.type)}>
                                                            <X className="w-4 h-4 mr-1" /> Reject
                                                        </Button>
                                                    </>
                                                )}

                                                <Button size="sm" variant="ghost" className="ml-auto text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(item._id, item.type)}>
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
