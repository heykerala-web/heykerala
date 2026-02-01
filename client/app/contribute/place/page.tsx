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
    const [step, setStep] = useState(1);
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
                return res.data.url;
            });

            const urls = await Promise.all(uploadPromises);
            setFormData((prev) => ({ ...prev, images: [...prev.images, ...urls] }));
            toast.success("Visions captured successfully");
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

    const handleSubmit = async () => {
        setLoading(true);

        try {
            if (!formData.name || !formData.category || !formData.district) {
                toast.error("The essence of the place is missing.");
                setLoading(false);
                return;
            }

            const payload = {
                ...formData,
                tags: formData.tags.split(",").map(t => t.trim()).filter(t => t.length > 0),
                latitude: parseFloat(formData.latitude) || 0,
                longitude: parseFloat(formData.longitude) || 0,
            };

            await placeService.submit(payload);
            toast.success("The landmark has been sent for archival review.");
            router.push("/dashboard");
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Submission failed");
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => setStep(s => Math.min(s + 1, 4));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    return (
        <div className="min-h-screen bg-white selection:bg-emerald-100 pb-20">
            {/* 🔹 STEPS PROGRESS BAR */}
            <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-100">
                <div
                    className="h-full bg-emerald-600 transition-all duration-1000 ease-out"
                    style={{ width: `${(step / 4) * 100}%` }}
                />
            </div>

            <div className="container mx-auto py-24 px-6 max-w-4xl">
                <div className="mb-16">
                    <Button variant="ghost" asChild className="mb-12 -ml-4 pl-4 hover:pl-6 transition-all text-gray-400 font-bold uppercase tracking-widest text-[10px]">
                        <Link href="/dashboard" className="flex items-center">
                            <ArrowLeft className="mr-2 h-3 w-3" /> Dashboard
                        </Link>
                    </Button>

                    <div className="flex items-baseline gap-4 mb-2">
                        <span className="text-emerald-600 font-black text-6xl opacity-20">0{step}</span>
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none">
                            {step === 1 && <><span className="text-emerald-600">Define</span> the Essence</>}
                            {step === 2 && <><span className="text-emerald-600">Tell</span> the Story</>}
                            {step === 3 && <><span className="text-emerald-600">Pin</span> the Location</>}
                            {step === 4 && <><span className="text-emerald-600">Capture</span> the Vision</>}
                        </h1>
                    </div>
                </div>

                <div className="bg-white/40 backdrop-blur-xl border border-gray-100 p-8 md:p-16 rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] animate-fade-in-up">

                    {/* STEP 1: BASIC INFO */}
                    {step === 1 && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Place Name</Label>
                                    <Input
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="e.g. Whispering Woods of Munnar"
                                        className="h-20 text-2xl font-bold border-none bg-gray-50 rounded-3xl focus:bg-white focus:ring-8 focus:ring-emerald-500/5 transition-all"
                                    />
                                    <p className="text-[10px] text-gray-400 ml-1">SLUG: <span className="font-bold text-gray-900">{formData.slug}</span></p>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Archive Category</Label>
                                    <Select value={formData.category} onValueChange={(val) => handleSelectChange("category", val)}>
                                        <SelectTrigger className="h-20 text-xl font-bold border-none bg-gray-50 rounded-3xl focus:ring-8 focus:ring-emerald-500/5 px-6">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-3xl border-gray-100 p-2">
                                            {CATEGORIES.map((c) => (
                                                <SelectItem key={c} value={c} className="rounded-xl h-12 font-bold focus:bg-emerald-50">{c}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kerala District</Label>
                                    <Select value={formData.district} onValueChange={(val) => handleSelectChange("district", val)}>
                                        <SelectTrigger className="h-20 text-xl font-bold border-none bg-gray-50 rounded-3xl focus:ring-8 focus:ring-emerald-500/5 px-6">
                                            <SelectValue placeholder="Select District" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-3xl border-gray-100 p-2">
                                            {KERALA_DISTRICTS.map((d) => (
                                                <SelectItem key={d} value={d} className="rounded-xl h-12 font-bold focus:bg-emerald-50">{d}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Location Name</Label>
                                    <Input
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="e.g. Near the Old Bridge"
                                        className="h-20 text-xl font-bold border-none bg-gray-50 rounded-3xl focus:bg-white focus:ring-8 focus:ring-emerald-500/5 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: DESCRIPTION */}
                    {step === 2 && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Detailed Narrative</Label>
                                <Textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={8}
                                    placeholder="Tell the world why this sanctuary is special..."
                                    className="text-xl font-medium border-none bg-gray-50 rounded-[2.5rem] p-10 focus:bg-white focus:ring-8 focus:ring-emerald-500/5 transition-all resize-none leading-relaxed"
                                />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Descriptive Tags</Label>
                                <TagInput
                                    tags={formData.tags ? formData.tags.split(',').filter(Boolean) : []}
                                    setTags={(newTags) => setFormData({ ...formData, tags: newTags.join(',') })}
                                    placeholder="nature, trekking, sunrise, serenity"
                                    label="Type tag and press Enter"
                                    className="bg-gray-50 focus-within:bg-white"
                                />
                            </div>
                        </div>
                    )}

                    {/* STEP 3: COORDINATES */}
                    {step === 3 && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <p className="text-gray-500 font-medium text-lg max-w-xl">
                                Precision matters. Find the destination on the map to ensure travelers can reach this sanctuary.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Latitude</Label>
                                    <Input
                                        name="latitude"
                                        type="number"
                                        step="any"
                                        value={formData.latitude}
                                        onChange={handleChange}
                                        placeholder="10.0889"
                                        className="h-20 text-3xl font-black border-none bg-gray-50 rounded-3xl focus:bg-white focus:ring-8 focus:ring-emerald-500/5 transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Longitude</Label>
                                    <Input
                                        name="longitude"
                                        type="number"
                                        step="any"
                                        value={formData.longitude}
                                        onChange={handleChange}
                                        placeholder="77.0595"
                                        className="h-20 text-3xl font-black border-none bg-gray-50 rounded-3xl focus:bg-white focus:ring-8 focus:ring-emerald-500/5 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: PHOTOS */}
                    {step === 4 && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {formData.images.map((url, index) => (
                                    <div key={index} className="relative group aspect-[4/5] rounded-[2rem] overflow-hidden border border-gray-100 shadow-xl">
                                        <img
                                            src={url.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL}${url}` : url}
                                            alt={`Capture ${index}`}
                                            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeImage(index)}
                                            className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 shadow-lg"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}

                                <label className="flex flex-col items-center justify-center border-4 border-dashed border-gray-100 rounded-[2rem] aspect-[4/5] cursor-pointer hover:bg-emerald-50/50 hover:border-emerald-200 transition-all group">
                                    {uploading ? (
                                        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
                                    ) : (
                                        <Upload className="w-10 h-10 text-gray-200 group-hover:text-emerald-600 transition-colors" />
                                    )}
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-6 group-hover:text-emerald-900">Add New View</span>
                                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                                </label>
                            </div>
                        </div>
                    )}

                    {/* 🔹 NAVIGATION BUTTONS */}
                    <div className="mt-20 pt-16 border-t border-gray-50 flex items-center justify-between">
                        {step > 1 ? (
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={prevStep}
                                className="h-16 px-10 rounded-2xl font-black uppercase tracking-widest text-xs text-gray-400 hover:text-emerald-600"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                            </Button>
                        ) : <div />}

                        {step < 4 ? (
                            <Button
                                type="button"
                                onClick={nextStep}
                                className="h-16 px-12 bg-gray-900 group hover:bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-gray-200 transition-all active:scale-95"
                            >
                                Next Step <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="h-16 px-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-emerald-500/20 transition-all active:scale-95 min-w-[200px]"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Contribute to Heritage"}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
