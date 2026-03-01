"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { Loader2, Camera, MapPin, Phone, User as UserIcon, ShieldCheck, RefreshCcw, Landmark } from "lucide-react";
import api from "@/services/api";
import { getAvatarUrl } from "@/lib/api";

export default function PersonalInfo() {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [roleLoading, setRoleLoading] = useState(false);
    const [avatarLoading, setAvatarLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || "",
        bio: user?.bio || "",
        phone: user?.phone || "",
        location: user?.location || "",
        bankDetails: user?.bankDetails || {
            accountNumber: "",
            ifscCode: "",
            accountHolderName: "",
            bankName: ""
        }
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

    const handleRoleSwitch = async () => {
        if (!user || user.role === "Admin") return;

        const newRole = user.role === "Tourist" ? "Contributor" : "Tourist";
        const confirmMessage = newRole === "Contributor"
            ? "Switching to Contributor account will allow you to add places, stays and events. Proceed?"
            : "Switching back to Tourist will hide your contribution tools. Proceed?";

        if (!confirm(confirmMessage)) return;

        setRoleLoading(true);
        try {
            const { data } = await api.patch("/auth/role", { role: newRole });
            if (data.success) {
                toast.success(data.message);
                updateUser(data.user);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to switch role");
        } finally {
            setRoleLoading(false);
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
                                src={getAvatarUrl(user?.avatar)}
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

                {/* Account Type Section */}
                <div className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-900">Account Type</h4>
                                <p className="text-sm text-gray-500">Manage your permissions and role</p>
                            </div>
                        </div>
                        <div className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${user?.role === "Admin" ? "bg-purple-100 text-purple-700" :
                            user?.role === "Contributor" ? "bg-emerald-100 text-emerald-700" :
                                "bg-blue-100 text-blue-700"
                            }`}>
                            <span>{user?.role === "Admin" ? "🛡️ Admin" : user?.role === "Contributor" ? "✍️ Contributor" : "🎒 Tourist"}</span>
                        </div>
                    </div>

                    <div className="p-6 bg-gray-50/50 rounded-3xl border border-gray-100/50">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="max-w-md">
                                <p className="text-sm font-semibold text-gray-900 mb-1">
                                    {user?.role === "Contributor" ? "You are a recognized Contributor" : "Currently a Tourist"}
                                </p>
                                <p className="text-sm text-gray-500 leading-relaxed">
                                    {user?.role === "Contributor"
                                        ? "You have full access to add and manage tourism listings in Kerala. Your contributions help others discover hidden gems."
                                        : "Want to contribute? Switch to a Contributor account to add places, stays, and events to HeyKerala."}
                                </p>
                            </div>
                            {user?.role !== "Admin" && (
                                <Button
                                    type="button"
                                    onClick={handleRoleSwitch}
                                    disabled={roleLoading}
                                    variant="outline"
                                    className="h-12 px-6 rounded-2xl border-gray-200 hover:bg-white hover:text-emerald-600 hover:border-emerald-500 transition-all font-bold flex items-center gap-2"
                                >
                                    {roleLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCcw className="w-4 h-4" />}
                                    {user?.role === "Tourist" ? "Switch to Contributor" : "Switch to Tourist"}
                                </Button>
                            )}
                        </div>
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

                {user?.role === "Contributor" && (
                    <div className="bg-white border border-gray-100 p-8 rounded-[2rem] shadow-sm space-y-6 mt-8">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                                <Landmark className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold text-gray-900">Bank Details for Payouts</h4>
                                <p className="text-sm text-gray-500">Securely receive your earnings from bookings</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Account Holder Name</Label>
                                <Input
                                    value={formData.bankDetails.accountHolderName}
                                    onChange={(e) => setFormData({ ...formData, bankDetails: { ...formData.bankDetails, accountHolderName: e.target.value } })}
                                    className="h-12 rounded-2xl bg-gray-50/50"
                                    placeholder="Jane Doe"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Account Number</Label>
                                <Input
                                    value={formData.bankDetails.accountNumber}
                                    onChange={(e) => setFormData({ ...formData, bankDetails: { ...formData.bankDetails, accountNumber: e.target.value } })}
                                    className="h-12 rounded-2xl bg-gray-50/50"
                                    placeholder="1234567890"
                                    type="password"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">IFSC Code</Label>
                                <Input
                                    value={formData.bankDetails.ifscCode}
                                    onChange={(e) => setFormData({ ...formData, bankDetails: { ...formData.bankDetails, ifscCode: e.target.value } })}
                                    className="h-12 rounded-2xl bg-gray-50/50 uppercase"
                                    placeholder="SBIN0001234"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Bank Name</Label>
                                <Input
                                    value={formData.bankDetails.bankName}
                                    onChange={(e) => setFormData({ ...formData, bankDetails: { ...formData.bankDetails, bankName: e.target.value } })}
                                    className="h-12 rounded-2xl bg-gray-50/50"
                                    placeholder="State Bank of India"
                                />
                            </div>
                        </div>
                    </div>
                )}

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
