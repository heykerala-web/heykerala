"use client";

import { StayForm } from "@/components/admin/StayForm";
import { stayService, Stay } from "@/services/stayService";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AddStayPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (data: Partial<Stay>) => {
        setLoading(true);
        try {
            await stayService.create(data);
            toast({ title: "Stay created successfully!" });
            router.push("/admin/stays");
        } catch (error) {
            console.error(error);
            toast({ title: "Failed to create stay", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="mb-6 flex items-center gap-4">
                <Link href="/admin/stays">
                    <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
                </Link>
                <h1 className="text-3xl font-bold">Add New Stay</h1>
            </div>
            <StayForm onSubmit={handleSubmit} loading={loading} />
        </div>
    );
}
