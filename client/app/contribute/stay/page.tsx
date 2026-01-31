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
import { Loader2, Upload, X, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import Link from "next/link";

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
        type: "",
        district: "",
        description: "",
        latitude: "",
        longitude: "",
        price: "",
        amenities: "",
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
            if (!formData.name || !formData.type || !formData.district || !formData.price) {
                toast.error("Please fill in required fields");
                setLoading(false);
                return;
            }

            const payload = {
                ...formData,
                price: parseFloat(formData.price) || 0,
                amenities: formData.amenities.split(",").map(a => a.trim()).filter(a => a.length > 0),
                latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
                longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
            };

            await api.post("/stays/user/submission", payload);
            toast.success("Stay submitted for review!");
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
                <h1 className="text-3xl font-bold tracking-tight">Contribute a Stay</h1>
                <p className="text-muted-foreground mt-2">
                    Add a Hotel, Resort, Homestay, or Restaurant.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-card p-8 rounded-xl border shadow-sm">

                {/* Basic Info */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold border-b pb-2">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Property Name *</Label>
                            <Input id="name" name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. Green Valley Resort" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="type">Type *</Label>
                            <Select name="type" value={formData.type} onValueChange={(val) => handleSelectChange("type", val)}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {STAY_TYPES.map((t) => (
                                        <SelectItem key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</SelectItem>
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
                            <Label htmlFor="price">Approx. Price (₹) *</Label>
                            <Input id="price" name="price" type="number" value={formData.price} onChange={handleChange} required placeholder="e.g. 2500" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={4} placeholder="Describe the ambiance, facilities, etc." />
                    </div>
                </div>

                {/* Location */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold border-b pb-2">Location Coordinates</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="latitude">Latitude</Label>
                            <Input id="latitude" name="latitude" type="number" step="any" value={formData.latitude} onChange={handleChange} placeholder="e.g. 10.0889" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="longitude">Longitude</Label>
                            <Input id="longitude" name="longitude" type="number" step="any" value={formData.longitude} onChange={handleChange} placeholder="e.g. 77.0595" />
                        </div>
                    </div>
                </div>

                {/* Amenities */}
                <div className="space-y-4">
                    <h2 className="text-xl font-semibold border-b pb-2">Amenities</h2>
                    <div className="space-y-2">
                        <Label htmlFor="amenities">Amenities (Comma Separated)</Label>
                        <Input id="amenities" name="amenities" value={formData.amenities} onChange={handleChange} placeholder="WiFi, Pool, AC, Parking" />
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
                            <span className="text-xs text-muted-foreground mt-2">Upload</span>
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
                </div>

                <div className="pt-4">
                    <Button type="submit" disabled={loading} className="w-full md:w-auto md:min-w-[200px] text-lg">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Submit Stay
                    </Button>
                </div>
            </form>
        </div>
    );
}
