"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import api from "@/services/api";
import { toast } from "react-hot-toast";
import { Loader2, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [resetUrl, setResetUrl] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post("/auth/forgot-password", { email });
            if (data.success) {
                toast.success(data.message || "Reset link sent to your email!");
                setSubmitted(true);
                if (data.resetUrl) {
                    setResetUrl(data.resetUrl);
                }
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to send reset link");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
            <div className="w-full max-w-md space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 font-poppins">Forgot Password?</h2>
                    <p className="text-gray-500 mt-2">
                        Enter your email and we'll send you a link to reset your password.
                    </p>
                </div>

                {!submitted ? (
                    <form onSubmit={handleSubmit} className="space-y-6 mt-8">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                            {loading ? "Sending link..." : "Send Reset Link"}
                        </Button>
                    </form>
                ) : (
                    <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 text-center space-y-4">
                        <p className="text-emerald-800 font-medium">
                            Check your email for a reset link. It may take a few minutes to arrive.
                        </p>

                        {resetUrl && (
                            <div className="p-4 bg-white rounded-lg border border-emerald-200 shadow-sm">
                                <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider font-bold">Development Mode Link:</p>
                                <Link
                                    href={resetUrl}
                                    className="text-emerald-600 break-all hover:underline text-sm font-mono"
                                >
                                    {resetUrl}
                                </Link>
                                <Button
                                    size="sm"
                                    variant="link"
                                    className="block mx-auto mt-2 text-emerald-700"
                                    onClick={() => window.open(resetUrl, '_blank')}
                                >
                                    Open Reset Page
                                </Button>
                            </div>
                        )}

                        <Button
                            variant="outline"
                            className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                            onClick={() => {
                                setSubmitted(false);
                                setResetUrl(null);
                            }}
                        >
                            Didn't get the email? Try again
                        </Button>
                    </div>
                )}

                <div className="text-center mt-8">
                    <Link
                        href="/login"
                        className="inline-flex items-center text-emerald-600 font-semibold hover:underline"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
