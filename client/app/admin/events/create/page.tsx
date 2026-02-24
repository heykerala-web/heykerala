"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, X } from "lucide-react";

export default function CreateEventPage() {
    const router = useRouter();
    const { toast } = useToast();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "Festival",
        district: "",
        venue: "",
        startDate: "",
        endDate: "",
        time: "",
        latitude: "",
        longitude: "",
        images: [] as string[],
    });

    const [uploading, setUploading] = useState(false);

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleValuesChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        setUploading(true);
        const file = e.target.files[0];
        const data = new FormData();
        data.append("image", file);

        try {
            const res = await api.post("/upload", data, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (res.data.success) {
                const fullUrl = `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${res.data.url}`;
                setFormData(prev => ({ ...prev, images: [...prev.images, fullUrl] }));
                toast({ title: "Image uploaded" });
            }
        } catch (err) {
            toast({ title: "Upload failed", variant: "destructive" });
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                latitude: formData.latitude ? Number(formData.latitude) : undefined,
                longitude: formData.longitude ? Number(formData.longitude) : undefined,
            };

            await api.post("/events", payload);
            toast({ title: "Event created successfully!" });
            router.push("/admin/events");
        } catch (err: any) {
            toast({ title: "Failed to create event", description: err.response?.data?.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8 pb-10">
            <h1 className="text-3xl font-bold">Add New Event</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Event Title</label>
                    <Input name="title" value={formData.title} onChange={handleChange} required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Category</label>
                        <Select value={formData.category} onValueChange={(val) => handleValuesChange('category', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Festival">Festival</SelectItem>
                                <SelectItem value="Cultural">Cultural</SelectItem>
                                <SelectItem value="Music">Music</SelectItem>
                                <SelectItem value="Food">Food</SelectItem>
                                <SelectItem value="Workshop">Workshop</SelectItem>
                                <SelectItem value="Sports">Sports</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">District</label>
                        <Input name="district" value={formData.district} onChange={handleChange} required />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Venue</label>
                    <Input name="venue" value={formData.venue} onChange={handleChange} required />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Start Date</label>
                        <Input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">End Date</label>
                        <Input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Time</label>
                        <Input placeholder="e.g. 10:00 AM" name="time" value={formData.time} onChange={handleChange} />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea name="description" value={formData.description} onChange={handleChange} rows={5} required />
                </div>



                <div className="space-y-2">
                    <label className="text-sm font-medium">Images</label>
                    <div className="flex gap-2 items-center">
                        <Input type="file" onChange={handleImageUpload} disabled={uploading} accept="image/*" />
                        {uploading && <Loader2 className="animate-spin h-5 w-5" />}
                    </div>

                    <div className="grid grid-cols-3 gap-2 mt-4">
                        {formData.images.map((img, i) => (
                            <div key={i} className="relative group">
                                <img src={img} alt="Preview" className="h-24 w-full object-cover rounded border" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(i)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                    Create Event
                </Button>
            </form>
        </div>
    );
}
