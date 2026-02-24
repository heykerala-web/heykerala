"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/services/api";
import { toast } from "react-hot-toast";
import { Loader2 } from "lucide-react";

export default function ResetPasswordPage() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { token } = useParams();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const { data } = await api.put(`/auth/reset-password/${token}`, { password });
            if (data.success) {
                toast.success("Password reset successfully!");
                router.push("/login");
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to reset password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
            <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 font-poppins">Reset Password</h2>
                    <p className="text-gray-500 mt-2">Enter your new password below.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                    <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="h-12 border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-lg rounded-xl shadow-lg shadow-emerald-600/20"
                        disabled={loading}
                    >
                        {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                        {loading ? "Resetting Password..." : "Reset Password"}
                    </Button>
                </form>
            </div>
        </div>
    );
}
