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
    const [step, setStep] = useState(1);
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
            const payload = {
                ...formData,
                latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
                longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
            };

            await eventService.submit(payload);
            toast.success("Living history captured. Awaiting review.");
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
        <div className="min-h-screen bg-white selection:bg-rose-100 pb-20">
            {/* 🔹 STEPS PROGRESS BAR */}
            <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-100">
                <div
                    className="h-full bg-rose-600 transition-all duration-1000 ease-out"
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
                        <span className="text-rose-600 font-black text-6xl opacity-20">0{step}</span>
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none">
                            {step === 1 && <><span className="text-rose-600">The</span> Occasion</>}
                            {step === 2 && <><span className="text-rose-600">Timing</span> & Depth</>}
                            {step === 3 && <><span className="text-rose-600">The</span> Stage</>}
                            {step === 4 && <><span className="text-rose-600">Vibrant</span> Glimpse</>}
                        </h1>
                    </div>
                </div>

                <div className="bg-white/40 backdrop-blur-xl border border-gray-100 p-8 md:p-16 rounded-[4rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.05)] animate-fade-in-up">

                    {/* STEP 1: BASIC INFO */}
                    {step === 1 && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Event Title</Label>
                                <Input
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    placeholder="e.g. Grand Carnatic Soiree"
                                    className="h-20 text-3xl font-bold border-none bg-gray-50 rounded-3xl focus:bg-white focus:ring-8 focus:ring-rose-500/5 transition-all text-gray-900"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Occasion Type</Label>
                                    <Select value={formData.category} onValueChange={(val) => handleSelectChange("category", val)}>
                                        <SelectTrigger className="h-20 text-xl font-bold border-none bg-gray-50 rounded-3xl focus:ring-8 focus:ring-rose-500/5 px-6">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-3xl border-gray-100 p-2">
                                            {EVENT_CATEGORIES.map((c) => (
                                                <SelectItem key={c} value={c} className="rounded-xl h-12 font-bold focus:bg-rose-50">{c}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kerala District</Label>
                                    <Select value={formData.district} onValueChange={(val) => handleSelectChange("district", val)}>
                                        <SelectTrigger className="h-20 text-xl font-bold border-none bg-gray-50 rounded-3xl focus:ring-8 focus:ring-rose-500/5 px-6">
                                            <SelectValue placeholder="Select District" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-3xl border-gray-100 p-2">
                                            {KERALA_DISTRICTS.map((d) => (
                                                <SelectItem key={d} value={d} className="rounded-xl h-12 font-bold focus:bg-rose-50">{d}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: TIMING & DESCRIPTION */}
                    {step === 2 && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Start Date</Label>
                                    <Input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        className="h-20 text-xl font-bold border-none bg-gray-50 rounded-3xl focus:bg-white focus:ring-8 focus:ring-rose-500/5 transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">End Date</Label>
                                    <Input
                                        type="date"
                                        name="endDate"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                        className="h-20 text-xl font-bold border-none bg-gray-50 rounded-3xl focus:bg-white focus:ring-8 focus:ring-rose-500/5 transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Display Time</Label>
                                    <Input
                                        name="time"
                                        value={formData.time}
                                        onChange={handleChange}
                                        placeholder="e.g. 6:00 PM onwards"
                                        className="h-20 text-xl font-bold border-none bg-gray-50 rounded-3xl focus:bg-white focus:ring-8 focus:ring-rose-500/5 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">The Essence</Label>
                                <Textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={6}
                                    placeholder="Paint a picture of the celebration..."
                                    className="text-xl font-medium border-none bg-gray-50 rounded-[2.5rem] p-10 focus:bg-white focus:ring-8 focus:ring-rose-500/5 transition-all resize-none leading-relaxed"
                                />
                            </div>
                        </div>
                    )}

                    {/* STEP 3: VENUE & COORDINATES */}
                    {step === 3 && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">The Stage (Venue)</Label>
                                <Input
                                    name="venue"
                                    value={formData.venue}
                                    onChange={handleChange}
                                    placeholder="e.g. Marine Drive Grounds"
                                    className="h-20 text-2xl font-bold border-none bg-gray-50 rounded-3xl focus:bg-white focus:ring-8 focus:ring-rose-500/5 transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-gray-400">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Latitude</Label>
                                    <Input
                                        name="latitude"
                                        type="number"
                                        step="any"
                                        value={formData.latitude}
                                        onChange={handleChange}
                                        placeholder="10.0889"
                                        className="h-20 text-2xl font-black border-none bg-gray-50 rounded-3xl focus:bg-white focus:ring-8 focus:ring-rose-500/5 transition-all"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black uppercase tracking-widest ml-1">Longitude</Label>
                                    <Input
                                        name="longitude"
                                        type="number"
                                        step="any"
                                        value={formData.longitude}
                                        onChange={handleChange}
                                        placeholder="77.0595"
                                        className="h-20 text-2xl font-black border-none bg-gray-50 rounded-3xl focus:bg-white focus:ring-8 focus:ring-rose-500/5 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: VISUALS */}
                    {step === 4 && (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                {formData.images.map((url, index) => (
                                    <div key={index} className="relative group aspect-[4/5] rounded-[2rem] overflow-hidden border border-gray-100 shadow-xl">
                                        <img
                                            src={url.startsWith('/') ? `${process.env.NEXT_PUBLIC_API_URL}${url}` : url}
                                            alt={`Moment ${index}`}
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

                                <label className="flex flex-col items-center justify-center border-4 border-dashed border-gray-100 rounded-[2rem] aspect-[4/5] cursor-pointer hover:bg-rose-50/50 hover:border-rose-200 transition-all group">
                                    {uploading ? (
                                        <Loader2 className="w-10 h-10 animate-spin text-rose-600" />
                                    ) : (
                                        <Upload className="w-10 h-10 text-gray-200 group-hover:text-rose-600 transition-colors" />
                                    )}
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-6 group-hover:text-rose-900">Add Atmosphere</span>
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
                                className="h-16 px-10 rounded-2xl font-black uppercase tracking-widest text-xs text-gray-400 hover:text-rose-600"
                            >
                                <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                            </Button>
                        ) : <div />}

                        {step < 4 ? (
                            <Button
                                type="button"
                                onClick={nextStep}
                                className="h-16 px-12 bg-gray-900 group hover:bg-rose-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-gray-200 transition-all active:scale-95"
                            >
                                Next Step <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                onClick={handleSubmit}
                                disabled={loading}
                                className="h-16 px-12 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-rose-500/20 transition-all active:scale-95 min-w-[200px]"
                            >
                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Capture History"}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
