"use client";

import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import { toast } from "react-hot-toast";

interface UploadPhotoModalProps {
    placeId: string;
    placeName: string;
    onUploadSuccess?: () => void;
}

export default function UploadPhotoModal({ placeId, placeName, onUploadSuccess }: UploadPhotoModalProps) {
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [caption, setCaption] = useState("");
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.size > 5 * 1024 * 1024) {
                toast.error("File size must be less than 5MB");
                return;
            }
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const selectedFile = e.dataTransfer.files[0];
            if (!selectedFile.type.startsWith("image/")) {
                toast.error("Only image files are allowed");
                return;
            }
            if (selectedFile.size > 5 * 1024 * 1024) {
                toast.error("File size must be less than 5MB");
                return;
            }
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const clearFile = () => {
        setFile(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async () => {
        if (!file) return;

        try {
            setUploading(true);
            const formData = new FormData();
            formData.append("image", file);
            formData.append("placeId", placeId);
            formData.append("caption", caption);

            const res = await api.post("/place-photos/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            if (res.data.success) {
                toast.success("Photo uploaded successfully! Pending approval.");
                setIsOpen(false);
                setFile(null);
                setPreview(null);
                setCaption("");
                if (onUploadSuccess) onUploadSuccess();
            }
        } catch (error: any) {
            console.error("Upload failed", error);
            toast.error(error.response?.data?.message || "Failed to upload photo");
        } finally {
            setUploading(false);
        }
    };

    if (!user) {
        return (
            <Button variant="outline" className="gap-2" onClick={() => toast("Please login to upload photos")}>
                <Camera className="w-4 h-4" /> Add Photo
            </Button>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="bg-white text-gray-900 hover:bg-gray-100 border border-gray-200 shadow-sm gap-2 font-bold rounded-xl transition-all hover:scale-105">
                    <Camera className="w-4 h-4" /> Add Your Photo
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md rounded-[2rem] p-0 overflow-hidden border-none gap-0">
                <DialogHeader className="p-6 bg-gradient-to-r from-emerald-50 to-teal-50 border-b border-gray-100">
                    <DialogTitle className="text-xl font-black text-gray-800">Share your experience</DialogTitle>
                    <p className="text-sm text-gray-500 font-medium">Upload a photo from {placeName}</p>
                </DialogHeader>

                <div className="p-6 space-y-6 bg-white">
                    {!preview ? (
                        <div
                            className="border-2 border-dashed border-gray-200 rounded-3xl h-64 flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500 hover:bg-emerald-50/50 transition-all group"
                            onClick={() => fileInputRef.current?.click()}
                            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                            onDrop={handleDrop}
                        >
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                                <Upload className="w-8 h-8" />
                            </div>
                            <p className="font-bold text-gray-900">Click or Drag & Drop</p>
                            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-bold">Max 5MB • JPG, PNG, WEBP</p>
                        </div>
                    ) : (
                        <div className="relative rounded-3xl overflow-hidden group shadow-lg">
                            <img src={preview} alt="Preview" className="w-full h-64 object-cover" />
                            <button
                                onClick={clearFile}
                                className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-transform hover:scale-110"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileSelect}
                    />

                    <div className="space-y-3">
                        <Label htmlFor="caption" className="text-xs font-bold uppercase tracking-wider text-gray-500 ml-1">Caption (Optional)</Label>
                        <Input
                            id="caption"
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="What's this moment about?"
                            className="h-12 rounded-2xl border-gray-200 bg-gray-50/50 focus:border-emerald-500 focus:ring-emerald-500/20"
                        />
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={!file || uploading}
                        className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-1"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Uploading...
                            </>
                        ) : (
                            <>
                                <ImageIcon className="w-4 h-4 mr-2" /> Post Photo
                            </>
                        )}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
