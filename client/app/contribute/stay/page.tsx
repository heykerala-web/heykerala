"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
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
import { TagInput } from "@/components/ui/tag-input";

const KERALA_DISTRICTS = [
    "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam",
    "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram",
    "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
];

const STAY_TYPES = ['hotel', 'resort', 'homestay', 'restaurant', 'cafe'];

export default function ContributeStayPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        type: "hotel",
        district: "",
        description: "",
        latitude: "",
        longitude: "",
        price: "",
        amenities: [] as string[],
        images: [] as string[],
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const handleAmenityChange = (amenity: string, checked: boolean) => {
        setFormData(prev => {
            const current = new Set(prev.amenities);
            if (checked) current.add(amenity);
            else current.delete(amenity);
            return { ...prev, amenities: Array.from(current) };
        });
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
            if (!formData.name || !formData.type || !formData.district || !formData.price) {
                toast.error("Please fill in all required fields.");
                setLoading(false);
                return;
            }

            const payload = {
                ...formData,
                price: parseFloat(formData.price) || 0,
                latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
                longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
            };

            await api.post("/stays/user/submission", payload);
            toast.success("Submission sent for review.");
            router.push("/add-listing");
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Submission failed");
        } finally {
            setLoading(false);
        }
    };

    const AMENITIES_LIST = ['wifi', 'parking', 'pool', 'ac', 'restaurant', 'bar', 'gym', 'spa', 'beach access', 'breakfast'];

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
                        <h1 className="text-xl font-bold text-gray-900">Add New Stay</h1>
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
                        {/* Basic Information */}
                        <Card className="p-8 rounded-[2rem] border-none shadow-sm bg-white">
                            <h2 className="text-lg font-bold mb-8 flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                                Basic Information
                            </h2>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Property Name</Label>
                                    <Input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Cloud 9 Boutique Hotel"
                                        className="h-14 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Type</Label>
                                        <Select value={formData.type} onValueChange={(val) => handleSelectChange("type", val)}>
                                            <SelectTrigger className="h-14 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500/20">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-gray-100">
                                                {STAY_TYPES.map((t) => (
                                                    <SelectItem key={t} value={t} className="capitalize font-medium">{t}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Starting Price (₹)</Label>
                                        <Input
                                            name="price"
                                            type="number"
                                            value={formData.price}
                                            onChange={handleChange}
                                            className="h-14 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-bold text-emerald-600"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Description</Label>
                                    <Textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={6}
                                        className="rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500/20 p-6 leading-relaxed font-medium"
                                    />
                                </div>
                            </div>
                        </Card>

                        {/* Amenities */}
                        <Card className="p-8 rounded-[2rem] border-none shadow-sm bg-white">
                            <h2 className="text-lg font-bold mb-8 flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                                Available Amenities
                            </h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {AMENITIES_LIST.map((amenity) => (
                                    <div key={amenity}
                                        onClick={() => handleAmenityChange(amenity, !formData.amenities.includes(amenity))}
                                        className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all border ${formData.amenities.includes(amenity)
                                                ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                                                : "bg-gray-50 border-transparent text-gray-500 hover:bg-gray-100"
                                            }`}
                                    >
                                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${formData.amenities.includes(amenity) ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-gray-200"
                                            }`}>
                                            {formData.amenities.includes(amenity) && <X className="w-3 h-3 stroke-[3]" />}
                                        </div>
                                        <span className="text-sm font-bold capitalize">{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-8">
                        {/* Location Details */}
                        <Card className="p-8 rounded-[2rem] border-none shadow-sm bg-white">
                            <h2 className="text-lg font-bold mb-8 flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                                Location
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
                                            className="h-14 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500/20"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Longitude</Label>
                                        <Input
                                            name="longitude"
                                            value={formData.longitude}
                                            onChange={handleChange}
                                            placeholder="76.0"
                                            className="h-14 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500/20"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Media Upload */}
                        <Card className="p-8 rounded-[2rem] border-none shadow-sm bg-white">
                            <h2 className="text-lg font-bold mb-8 flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                                Media
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
