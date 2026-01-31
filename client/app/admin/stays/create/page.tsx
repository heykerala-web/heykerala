"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/services/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, X, Plus } from "lucide-react";

interface RoomInput {
    roomType: string;
    price: string;
    maxGuests: string;
    availableCount: string;
}

export default function CreateStayPage() {
    const router = useRouter();
    const { toast } = useToast();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        type: "hotel",
        description: "",
        district: "",
        pricePerNight: "",
        amenities: "", // comma separated
        images: [] as string[],
        rooms: [] as RoomInput[]
    });

    const [newRoom, setNewRoom] = useState<RoomInput>({ roomType: "", price: "", maxGuests: "2", availableCount: "1" });
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

    const addRoom = () => {
        if (!newRoom.roomType || !newRoom.price) {
            toast({ title: "Please fill room details", variant: "destructive" });
            return;
        }
        setFormData(prev => ({ ...prev, rooms: [...prev.rooms, newRoom] }));
        setNewRoom({ roomType: "", price: "", maxGuests: "2", availableCount: "1" });
    };

    const removeRoom = (index: number) => {
        setFormData(prev => ({ ...prev, rooms: prev.rooms.filter((_, i) => i !== index) }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // If no manually added rooms but we have pricePerNight, we could add a default room for hotel
            // But let's just send what we have.
            const payload = {
                ...formData,
                pricePerNight: Number(formData.pricePerNight),
                amenities: formData.amenities.split(',').map(s => s.trim()).filter(Boolean),
                rooms: formData.rooms.map(r => ({
                    roomType: r.roomType,
                    price: Number(r.price),
                    maxGuests: Number(r.maxGuests),
                    availableCount: Number(r.availableCount)
                }))
            };

            await api.post("/stays", payload);
            toast({ title: "Stay created successfully!" });
            router.push("/admin/stays");
        } catch (err: any) {
            toast({ title: "Failed to create stay", description: err.response?.data?.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-10">
            <h1 className="text-3xl font-bold">Add New Stay</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium">Name</label>
                    <Input name="name" value={formData.name} onChange={handleChange} required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Type</label>
                        <Select value={formData.type} onValueChange={(val) => handleValuesChange('type', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="hotel">Hotel</SelectItem>
                                <SelectItem value="resort">Resort</SelectItem>
                                <SelectItem value="homestay">Homestay</SelectItem>
                                <SelectItem value="restaurant">Restaurant</SelectItem>
                                <SelectItem value="cafe">Cafe</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">District</label>
                        <Input name="district" value={formData.district} onChange={handleChange} required />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Base Price (Per Night / Average)</label>
                    <Input type="number" name="pricePerNight" value={formData.pricePerNight} onChange={handleChange} required />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Description</label>
                    <Textarea name="description" value={formData.description} onChange={handleChange} rows={4} required />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium">Amenities (comma separated)</label>
                    <Input name="amenities" value={formData.amenities} onChange={handleChange} placeholder="Wifi, Pool, Parking..." />
                </div>

                {/* Room Management */}
                {(formData.type === 'hotel' || formData.type === 'resort') && (
                    <div className="space-y-4 border p-4 rounded-lg bg-gray-50">
                        <h3 className="text-lg font-semibold">Rooms</h3>

                        <div className="grid grid-cols-4 gap-2">
                            <Input placeholder="Type (e.g. Deluxe)" value={newRoom.roomType} onChange={e => setNewRoom({ ...newRoom, roomType: e.target.value })} />
                            <Input type="number" placeholder="Price" value={newRoom.price} onChange={e => setNewRoom({ ...newRoom, price: e.target.value })} />
                            <Input type="number" placeholder="Max Guests" value={newRoom.maxGuests} onChange={e => setNewRoom({ ...newRoom, maxGuests: e.target.value })} />
                            <Button type="button" onClick={addRoom} variant="secondary"><Plus className="h-4 w-4" /> Add</Button>
                        </div>

                        {formData.rooms.length > 0 && (
                            <div className="space-y-2">
                                {formData.rooms.map((room, idx) => (
                                    <div key={idx} className="flex justify-between items-center bg-white p-2 rounded border">
                                        <span className="text-sm font-medium">{room.roomType} - ₹{room.price} ({room.maxGuests} guests)</span>
                                        <button type="button" onClick={() => removeRoom(idx)} className="text-red-500 hover:text-red-700">
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

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
                    Create Stay
                </Button>
            </form>
        </div>
    );
}
