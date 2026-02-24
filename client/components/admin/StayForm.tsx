"use client";

import { useState, ChangeEvent } from "react";
import { Stay } from "@/services/stayService";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, X, Upload } from "lucide-react";
import api from "@/services/api";

interface StayFormProps {
    initialData?: Partial<Stay>;
    onSubmit: (data: Partial<Stay>) => Promise<void>;
    loading: boolean;
}

const STAY_TYPES = ['hotel', 'resort', 'homestay', 'restaurant', 'cafe'];
const AMENITIES_LIST = ['wifi', 'parking', 'pool', 'ac', 'restaurant', 'bar', 'gym', 'spa', 'beach access', 'breakfast'];

export function StayForm({ initialData, onSubmit, loading }: StayFormProps) {
    const [formData, setFormData] = useState<Partial<Stay>>({
        name: "",
        type: "hotel",
        description: "",
        district: "",
        price: 0,
        amenities: [],
        images: [],
        latitude: 0,
        longitude: 0,
        ratingAvg: 0,
        ...initialData
    });
    const [uploading, setUploading] = useState(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleAmenityChange = (amenity: string, checked: boolean) => {
        setFormData(prev => {
            const current = new Set(prev.amenities || []);
            if (checked) current.add(amenity);
            else current.delete(amenity);
            return { ...prev, amenities: Array.from(current) };
        });
    };

    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return;

        setUploading(true);
        const files = Array.from(e.target.files);
        const newImages: string[] = [...(formData.images || [])];

        try {
            for (const file of files) {
                const form = new FormData();
                form.append("image", file);
                const res = await api.post("/upload", form, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                if (res.data.success) {
                    newImages.push(res.data.url);
                }
            }
            setFormData(prev => ({ ...prev, images: newImages }));
        } catch (error) {
            console.error("Upload failed", error);
            alert("Image upload failed");
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images?.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select value={formData.type} onValueChange={(val) => setFormData(p => ({ ...p, type: val as any }))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                            {STAY_TYPES.map(t => (
                                <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="district">District</Label>
                    <Input id="district" name="district" value={formData.district} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="price">Price (₹)</Label>
                    <Input id="price" name="price" type="number" min="0" value={formData.price} onChange={handleChange} required />
                </div>


            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={4} />
            </div>

            <div className="space-y-2">
                <Label>Amenities</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border p-4 rounded-md">
                    {AMENITIES_LIST.map(amenity => (
                        <div key={amenity} className="flex items-center space-x-2">
                            <Checkbox
                                id={`amenity-${amenity}`}
                                checked={formData.amenities?.includes(amenity)}
                                onCheckedChange={(checked) => handleAmenityChange(amenity, checked as boolean)}
                            />
                            <label htmlFor={`amenity-${amenity}`} className="text-sm font-medium capitalize cursor-pointer">
                                {amenity}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <Label>Images</Label>
                <div className="flex flex-wrap gap-4 mb-2">
                    {formData.images?.map((img, i) => (
                        <div key={i} className="relative w-24 h-24 group">
                            <img src={img} alt="preview" className="w-full h-full object-cover rounded-md border" />
                            <button
                                type="button"
                                onClick={() => removeImage(i)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition"
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </div>
                    ))}
                    <div className="w-24 h-24 border-2 border-dashed rounded-md flex items-center justify-center cursor-pointer hover:bg-gray-50 relative">
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            disabled={uploading}
                        />
                        {uploading ? <Loader2 className="animate-spin text-gray-400" /> : <Upload className="text-gray-400" />}
                    </div>
                </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading || uploading}>
                {loading ? <Loader2 className="animate-spin mr-2" /> : null}
                Save Stay
            </Button>
        </form>
    );
}
