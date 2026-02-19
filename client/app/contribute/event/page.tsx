"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { eventService } from "@/services/eventService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2, Upload, X, ArrowLeft, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

const EVENT_CATEGORIES = ["Festival", "Cultural", "Music", "Food", "Workshop", "Sports", "Other"];
const KERALA_DISTRICTS = [
    "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam",
    "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram",
    "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
];

export default function ContributeEventPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        setUploading(true);
        const files = Array.from(e.target.files);

        try {
            const uploadPromises = files.map(async (file) => {
                const data = new FormData();
                data.append("image", file);
                const res = await api.post("/upload", data, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
                return res.data.url;
            });

            const urls = await Promise.all(uploadPromises);
            setFormData((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
            toast.success("Images uploaded successfully");
        } catch (error) {
            console.error("Upload failed", error);
            toast.error("Failed to upload images");
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!formData.title || !formData.category || !formData.district || !formData.startDate) {
                toast.error("Please fill in all required fields.");
                setLoading(false);
                return;
            }

            const payload = {
                ...formData,
                latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
                longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
            };

            await eventService.submit(payload);
            toast.success("Submission sent for review.");
            router.push("/add-listing");
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Submission failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50/50 pb-20">
            <div className="bg-white border-b sticky top-0 z-30">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" asChild className="rounded-xl">
                            <Link href="/add-listing">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <h1 className="text-xl font-bold text-gray-900">Add New Event</h1>
                    </div>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-8 font-bold text-xs uppercase tracking-widest h-11"
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Listing
                    </Button>
                </div>
            </div>

            <div className="container mx-auto py-12 px-6 max-w-5xl">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Event Details */}
                        <Card className="p-8 rounded-[2rem] border-none shadow-sm bg-white">
                            <h2 className="text-lg font-bold mb-8 flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                                Event Details
                            </h2>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Event Title</Label>
                                    <Input
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="e.g. Cochin Carnival"
                                        className="h-14 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Category</Label>
                                        <Select value={formData.category} onValueChange={(val) => handleSelectChange("category", val)}>
                                            <SelectTrigger className="h-14 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500/20">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-gray-100">
                                                {EVENT_CATEGORIES.map((c) => (
                                                    <SelectItem key={c} value={c} className="font-medium">{c}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Venue Name</Label>
                                        <Input
                                            name="venue"
                                            value={formData.venue}
                                            onChange={handleChange}
                                            placeholder="e.g. Fort Kochi Beach"
                                            className="h-14 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Start Date</Label>
                                        <Input
                                            name="startDate"
                                            type="date"
                                            value={formData.startDate}
                                            onChange={handleChange}
                                            className="h-14 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">End Date</Label>
                                        <Input
                                            name="endDate"
                                            type="date"
                                            value={formData.endDate}
                                            onChange={handleChange}
                                            className="h-14 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Specific Time</Label>
                                        <Input
                                            name="time"
                                            value={formData.time}
                                            onChange={handleChange}
                                            placeholder="e.g. 10:00 AM - 8:00 PM"
                                            className="h-14 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Description</Label>
                                    <Textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={8}
                                        placeholder="Describe the celebration and its significance..."
                                        className="rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500/20 p-6 leading-relaxed font-medium"
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-8">
                        {/* Location */}
                        <Card className="p-8 rounded-[2rem] border-none shadow-sm bg-white">
                            <h2 className="text-lg font-bold mb-8 flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                                Geolocation
                            </h2>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">District</Label>
                                    <Select value={formData.district} onValueChange={(val) => handleSelectChange("district", val)}>
                                        <SelectTrigger className="h-14 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500/20">
                                            <SelectValue placeholder="Select District" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-2xl border-gray-100">
                                            {KERALA_DISTRICTS.map((d) => (
                                                <SelectItem key={d} value={d} className="font-medium">{d}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Latitude</Label>
                                        <Input
                                            name="latitude"
                                            value={formData.latitude}
                                            onChange={handleChange}
                                            placeholder="10.0"
                                            className="h-14 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Longitude</Label>
                                        <Input
                                            name="longitude"
                                            value={formData.longitude}
                                            onChange={handleChange}
                                            placeholder="76.0"
                                            className="h-14 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Visuals */}
                        <Card className="p-8 rounded-[2rem] border-none shadow-sm bg-white">
                            <h2 className="text-lg font-bold mb-8 flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                                Moments
                            </h2>
                            <div className="grid grid-cols-2 gap-4">
                                {formData.images.map((url, index) => (
                                    <div key={index} className="relative aspect-square rounded-2xl overflow-hidden group shadow-sm">
                                        <img src={url} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                                <label className="aspect-square rounded-2xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                                    {uploading ? <Loader2 className="w-5 h-5 animate-spin text-emerald-600" /> : <Upload className="w-5 h-5 text-gray-300" />}
                                    <span className="text-[10px] uppercase font-black tracking-widest text-gray-400 mt-2">Upload</span>
                                    <input type="file" multiple hidden onChange={handleImageUpload} />
                                </label>
                            </div>
                        </Card>
                    </div>
                </form>
            </div>
        </div>
    );
}

import { Card } from "@/components/ui/card";
