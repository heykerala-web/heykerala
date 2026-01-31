"use client";

import { StayForm } from "@/components/admin/StayForm";
import { stayService, Stay } from "@/services/stayService";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EditStayPage() {
    const { id } = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [stay, setStay] = useState<Stay | undefined>(undefined);

    useEffect(() => {
        if (id) {
            stayService.getById(id as string)
                .then(setStay)
                .catch(() => toast({ title: "Failed to load stay", variant: "destructive" }))
                .finally(() => setFetching(false));
        }
    }, [id]);

    const handleSubmit = async (data: Partial<Stay>) => {
        setLoading(true);
        try {
            await stayService.update(id as string, data);
            toast({ title: "Stay updated successfully!" });
            router.push("/admin/stays");
        } catch (error) {
            console.error(error);
            toast({ title: "Failed to update stay", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
    if (!stay) return <div className="p-10 text-center">Stay not found</div>;

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="mb-6 flex items-center gap-4">
                <Link href="/admin/stays">
                    <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
                </Link>
                <h1 className="text-3xl font-bold">Edit Stay</h1>
            </div>
            <StayForm initialData={stay} onSubmit={handleSubmit} loading={loading} />
        </div>
    );
}
