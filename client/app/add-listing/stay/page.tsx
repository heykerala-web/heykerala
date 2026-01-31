"use client";

import { StayForm } from "@/components/admin/StayForm";
import { stayService, Stay } from "@/services/stayService";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function SubmitStayPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data: Partial<Stay>) => {
        setLoading(true);
        try {
            await stayService.submit(data);
            toast({ title: "Submission Received!", description: "Your stay has been submitted for review. It will be visible once approved." });
            router.push("/dashboard"); // Redirect to user dashboard instead of admin list
        } catch (error) {
            console.error(error);
            toast({ title: "Failed to submit stay", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null; // Auth check handled by layout or middleware usually

    return (
        <div className="container mx-auto py-10 px-4 max-w-4xl">
            <div className="mb-6">
                <Link href="/add-listing">
                    <Button variant="ghost" size="sm" className="mb-2 pl-0 hover:bg-transparent hover:text-emerald-600 gap-1">
                        <ArrowLeft className="h-4 w-4" /> Back
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold text-emerald-950">Add Property Details</h1>
                <p className="text-gray-500">Provide comprehensive details to attract more guests.</p>
            </div>

            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 mb-6 text-emerald-800 text-sm">
                <strong>Note:</strong> All submissions are reviewed by our team before going live to ensure quality.
            </div>

            <StayForm onSubmit={handleSubmit} loading={loading} />
        </div>
    );
}
