"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { placeService } from "@/services/placeService";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Sparkles } from "lucide-react";

const KERALA_DISTRICTS = [
    "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam",
    "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram",
    "Kozhikode", "Wayanad", "Kannur", "Kasaragod"
];

const CATEGORIES = [
    "Hill Station", "Beach", "Backwaters", "Wildlife", "Waterfalls",
    "Adventure", "Island", "Museum", "Heritage Site", "Temple", "Church", "Mosque",
    "Pilgrimage", "Nature", "Culture", "History", "City", "Other"
];

export default function ContributePlacePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        district: "",
        category: "",
        description: "",
        location: "",
        latitude: "",
        longitude: "",
        tags: [] as string[],
        images: [] as string[],
        isUntold: false,
        untoldStory: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updates: any = { [name]: value };
            if (name === "name") {
                updates.slug = value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
            }
            return { ...prev, ...updates };
        });
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
            if (!formData.name || !formData.category || !formData.district) {
                toast.error("Please fill in all required fields.");
                setLoading(false);
                return;
            }

            const payload = {
                ...formData,
                latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
                longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
            };

            await placeService.submit(payload);
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
                        <h1 className="text-xl font-bold text-gray-900">Add New Landmark</h1>
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
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Place Name</Label>
                                        <Input
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="e.g. Whispering Woods"
                                            className="h-14 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500/20 font-medium"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Slug</Label>
                                        <Input
                                            name="slug"
                                            value={formData.slug}
                                            readOnly
                                            className="h-14 rounded-2xl bg-gray-100 border-none text-gray-400 font-mono text-xs"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Category</Label>
                                        <Select value={formData.category} onValueChange={(val) => handleSelectChange("category", val)}>
                                            <SelectTrigger className="h-14 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500/20">
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                            <SelectContent className="rounded-2xl border-gray-100">
                                                {CATEGORIES.map((c) => (
                                                    <SelectItem key={c} value={c} className="font-medium">{c}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">Location Name</Label>
                                        <Input
                                            name="location"
                                            value={formData.location}
                                            onChange={handleChange}
                                            placeholder="e.g. Near the Old Bridge"
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
                                        placeholder="Tell the story of this place..."
                                        className="rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500/20 p-6 leading-relaxed font-medium"
                                    />
                                </div>
                            </div>
                        </Card>

                        <Card className="p-8 rounded-[2rem] border-none shadow-sm bg-white">
                            <h2 className="text-lg font-bold mb-8 flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                                Descriptive Tags
                            </h2>
                            <TagInput
                                tags={formData.tags}
                                setTags={(newTags) => setFormData({ ...formData, tags: newTags })}
                                placeholder="nature, trekking, sunrise..."
                                className="bg-gray-50 border-none rounded-2xl p-4 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all font-medium"
                            />
                        </Card>

                        <Card className="p-8 rounded-[2rem] border-none shadow-sm bg-white">
                            <div className="flex items-center space-x-3 mb-6">
                                <Checkbox
                                    id="isUntold"
                                    checked={formData.isUntold}
                                    onCheckedChange={(checked) => setFormData({ ...formData, isUntold: !!checked })}
                                    className="border-emerald-200 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                                />
                                <Label htmlFor="isUntold" className="flex items-center gap-2 cursor-pointer font-bold text-emerald-600 italic">
                                    <Sparkles className="w-4 h-4 text-emerald-500" />
                                    This is an Untold Hidden Gem
                                </Label>
                            </div>

                            {formData.isUntold && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <Label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-1">The Untold Story / Mystery</Label>
                                    <Textarea
                                        name="untoldStory"
                                        value={formData.untoldStory}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="What's the secret? Share the poetic story or the mystery of this place..."
                                        className="rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-emerald-500/20 p-6 leading-relaxed font-medium italic"
                                    />
                                </div>
                            )}
                        </Card>
                    </div>

                    <div className="space-y-8">
                        {/* District & Coordinates */}
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
                            </div>
                        </Card>

                        {/* Media Upload */}
                        <Card className="p-8 rounded-[2rem] border-none shadow-sm bg-white">
                            <h2 className="text-lg font-bold mb-8 flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                                Visuals
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
