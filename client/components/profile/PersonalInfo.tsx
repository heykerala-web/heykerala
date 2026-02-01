"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { Loader2, Camera, MapPin, Phone, User as UserIcon } from "lucide-react";
import api from "@/services/api";

export default function PersonalInfo() {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [avatarLoading, setAvatarLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || "",
        bio: user?.bio || "",
        phone: user?.phone || "",
        location: user?.location || "",
    });

    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setAvatarLoading(true);
        try {
            const token = localStorage.getItem("token") || "";
            const avatarFormData = new FormData();
            avatarFormData.append("avatar", file);

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}/profile/avatar`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`
                },
                body: avatarFormData
            });
            const data = await res.json();

            if (data.success) {
                toast.success("Avatar updated!");
                updateUser({ avatar: data.user.avatar });
            } else {
                toast.error(data.message || "Upload failed");
            }
        } catch (error) {
            toast.error("Failed to upload avatar");
        } finally {
            setAvatarLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.put("/users/profile", formData);
            if (data.success) {
                toast.success("Profile updated successfully!");
                updateUser(data.user);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h2 className="text-2xl font-bold">Personal Information</h2>
                <p className="text-muted-foreground">Update your profile details and how others see you.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl">
                {/* Avatar Section */}
                <div className="bg-white border border-gray-100 p-8 rounded-[2rem] flex flex-col md:flex-row items-center gap-8 shadow-sm">
                    <div className="relative group">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl relative z-10">
                            <img
                                src={user?.avatar ? (user.avatar.startsWith('http') ? user.avatar : `http://localhost:5000${user.avatar}`) : '/default-avatar.png'}
                                alt={user?.name}
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            {avatarLoading && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm">
                                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                                </div>
                            )}
                        </div>
                        {/* Decorative background blur */}
                        <div className="absolute inset-0 bg-emerald-500/20 blur-3xl -z-10 rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <Label
                            htmlFor="avatar-upload"
                            className="absolute bottom-0 right-0 bg-gray-900 text-white p-3 rounded-2xl cursor-pointer shadow-xl hover:bg-emerald-600 transition-all hover:scale-110 z-20 flex items-center justify-center"
                        >
                            <Camera className="w-5 h-5" />
                        </Label>
                        <Input
                            id="avatar-upload"
                            type="file"
                            className="hidden"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                        />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-1">Your Visual Identity</h4>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-sm">
                            Make a lasting impression. Upload a clear, high-quality photo to help hosts and fellow travelers recognize you.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <div className="space-y-3">
                        <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                            Full Name
                        </Label>
                        <div className="relative">
                            <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="pl-10 h-12 rounded-2xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-gray-50/50"
                                placeholder="John Doe"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                            Email Address
                        </Label>
                        <Input
                            id="email"
                            value={user?.email}
                            disabled
                            className="h-12 rounded-2xl bg-gray-100/50 border-transparent text-gray-500 cursor-not-allowed"
                        />
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                            Phone Number
                        </Label>
                        <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                className="pl-10 h-12 rounded-2xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-gray-50/50"
                                placeholder="+91 9876543210"
                            />
                        </div>
                    </div>
                    <div className="space-y-3">
                        <Label htmlFor="location" className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                            Location
                        </Label>
                        <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="pl-10 h-12 rounded-2xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-gray-50/50"
                                placeholder="Kochi, Kerala"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <Label htmlFor="bio" className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">
                        Your Story (Bio)
                    </Label>
                    <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="min-h-[140px] rounded-3xl border-gray-200 focus:border-emerald-500 focus:ring-emerald-500/20 bg-gray-50/50 p-6 resize-none"
                        placeholder="Tell the world about your Kerala adventures..."
                    />
                </div>

                <div className="pt-4 flex justify-end">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full md:w-auto px-10 h-12 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-600/20 transition-all hover:-translate-y-1"
                    >
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </div>
            </form>
        </div>
    );
}
