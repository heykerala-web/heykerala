"use client";

import React from "react";
import PaymentGateway from "@/components/payment/PaymentGateway";

export default function DemoPaymentPage() {
    return (
        <div style={{ background: "#f8faff", minHeight: "100vh" }}>
            <PaymentGateway
                amount={2500}
                bookingId="HK2026-1245"
            />
        </div>
    );
}
