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
import { Loader2, Upload, X, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

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
        slug: "", // Will be auto-generated or hidden? Let's hide it and auto-gen on backend if possible, or simple slugify here.
        district: "",
        category: "",
        description: "",
        location: "",
        latitude: "",
        longitude: "",
        tags: "",
        images: [] as string[],
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
                return res.data.url; // Use url directly as backend now typically returns relative path
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
                toast.error("Please fill in required fields");
                setLoading(false);
                return;
            }

            const payload = {
                ...formData,
                tags: formData.tags.split(",").map(t => t.trim()).filter(t => t.length > 0),
                latitude: parseFloat(formData.latitude) || 0,
                longitude: parseFloat(formData.longitude) || 0,
            };

            // Use service
            await placeService.submit(payload);
            toast.success("Place submitted for review!");
            router.push("/dashboard");
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Submission failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-10 px-4 max-w-3xl">
            <div className="mb-6">
                <Button variant="ghost" asChild className="mb-4 pl-0 hover:pl-2 transition-all">
                    <Link href="/dashboard" className="flex items-center text-muted-foreground hover:text-foreground">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold tracking-tight">Contribute a New Place</h1>
                <p className="text-muted-foreground mt-2">
                    Share a hidden gem or a popular spot. Your submission will be reviewed by our admins.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-card p-8 rounded-xl border shadow-sm">

                {/* Basic Info */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold border-b pb-2">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Place Name *</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Munnar Tea Gardens" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category">Category *</Label>
                            <Select name="category" value={formData.category} onValueChange={(val) => handleSelectChange("category", val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map((c) => (
                                        <SelectItem key={c} value={c}>{c}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="district">District *</Label>
                            <Select name="district" value={formData.district} onValueChange={(val) => handleSelectChange("district", val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select District" />
                                </SelectTrigger>
                                <SelectContent>
                                    {KERALA_DISTRICTS.map((d) => (
                                        <SelectItem key={d} value={d}>{d}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">Location (Display Name) *</Label>
                            <Input id="location" name="location" value={formData.location} onChange={handleChange} required placeholder="e.g. 5km from Town" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={4} placeholder="Tell us what makes this place special..." />
                    </div>
                </div>

                {/* Location Details */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold border-b pb-2">Location Coordinates</h2>
                    <p className="text-sm text-muted-foreground">You can find these on Google Maps (Right click &gt; First option).</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="latitude">Latitude *</Label>
                            <Input id="latitude" name="latitude" type="number" step="any" value={formData.latitude} onChange={handleChange} required placeholder="e.g. 10.0889" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="longitude">Longitude *</Label>
                            <Input id="longitude" name="longitude" type="number" step="any" value={formData.longitude} onChange={handleChange} required placeholder="e.g. 77.0595" />
                        </div>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold border-b pb-2">Additional Details</h2>
                    <div className="space-y-2">
                        <Label htmlFor="tags">Tags (Comma Separated)</Label>
                        <Input id="tags" name="tags" value={formData.tags} onChange={handleChange} placeholder="nature, trekking, view, sunset" />
                    </div>
                </div>

                {/* Images */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold border-b pb-2">Photos</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {formData.images.map((url, index) => (
                            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border bg-muted">
                                <img
                                    src={url.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL}${url}` : url}
                                    alt={`Upload ${index}`}
                                    className="object-cover w-full h-full"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ))}

                        <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg aspect-square cursor-pointer hover:bg-muted/50 transition-colors">
                            {uploading ? (
                                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                            ) : (
                                <Upload className="w-6 h-6 text-muted-foreground" />
                            )}
                            <span className="text-xs text-muted-foreground mt-2">Upload Photo</span>
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                                disabled={uploading}
                            />
                        </label>
                    </div>
                    <p className="text-xs text-muted-foreground">Upload high-quality images to increase approval chances.</p>
                </div>

                <div className="pt-4">
                    <Button type="submit" disabled={loading} className="w-full md:w-auto md:min-w-[200px] text-lg">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Contribution
                    </Button>
                </div>
            </form>
        </div>
    );
}
