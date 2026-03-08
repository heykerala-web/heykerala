"use client";

import React, { useState, useEffect } from "react";
import { Check, CreditCard, Landmark, Smartphone, Wallet, Lock, ShieldCheck, ArrowRight, CheckCircle2 } from "lucide-react";
import "./PaymentGateway.css";

interface PaymentGatewayProps {
    amount: number;
    bookingId?: string;
    onSuccess?: (details: any) => void;
    onCancel?: () => void;
}

const PaymentGateway: React.FC<PaymentGatewayProps> = ({
    amount,
    bookingId = "HK2026-1245",
    onSuccess,
    onCancel
}) => {
    const [activeMethod, setActiveMethod] = useState<string>("upi");
    const [upiId, setUpiId] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const [isSuccess, setIsSuccess] = useState<boolean>(false);

    // Simulated booking details for success screen
    const bookingDetails = {
        id: bookingId,
        destination: "Munnar Tea Gardens",
        checkIn: "24 Mar 2026",
        checkOut: "27 Mar 2026",
    };

    const handlePayment = () => {
        if (activeMethod === "upi" && !upiId.includes("@")) {
            alert("Please enter a valid UPI ID (e.g., user@upi)");
            return;
        }

        setIsProcessing(true);

        // Simulate payment processing
        setTimeout(() => {
            setIsProcessing(false);
            setIsSuccess(true);
            if (onSuccess) {
                onSuccess({
                    transactionId: `TXN${Math.floor(Math.random() * 1000000000)}`,
                    amount,
                    method: activeMethod,
                    bookingId
                });
            }
        }, 2500);
    };

    if (isSuccess) {
        return (
            <div className="payment-gateway-container">
                <div className="payment-card shadow-2xl">
                    <div className="success-container">
                        <div className="checkmark-circle">
                            <Check size={48} strokeWidth={3} />
                        </div>
                        <h2 className="success-title">Payment Successful</h2>
                        <span className="booking-id-tag">Booking ID: {bookingDetails.id}</span>

                        <div className="booking-details-card">
                            <div className="detail-row">
                                <span className="detail-label">Destination</span>
                                <span className="detail-value">{bookingDetails.destination}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Check-in</span>
                                <span className="detail-value">{bookingDetails.checkIn}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Check-out</span>
                                <span className="detail-value">{bookingDetails.checkOut}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Amount Paid</span>
                                <span className="detail-value">₹{amount.toLocaleString()}</span>
                            </div>
                        </div>

                        <button className="view-booking-btn" onClick={() => window.location.href = "/dashboard/bookings"}>
                            View My Bookings
                        </button>
                    </div>
                    <div className="footer-disclaimer">
                        <p className="disclaimer-text">
                            Demo Payment Gateway – No real transaction.<br />
                            For academic project demonstration.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-gateway-container">
            <div className="payment-card">
                <div className="payment-header">
                    <span className="brand-name">Hey Kerala</span>
                    <div className="amount-container">
                        <span className="amount-label">Amount to Pay</span>
                        <div className="amount-value">₹{amount.toLocaleString()}</div>
                    </div>
                    <div className="secure-badge">
                        <Lock size={12} />
                        Secure Payment Gateway
                    </div>
                </div>

                <div className="payment-methods-tabs">
                    <button
                        className={`method-tab ${activeMethod === "upi" ? "active" : ""}`}
                        onClick={() => setActiveMethod("upi")}
                    >
                        <Smartphone />
                        <span>UPI</span>
                    </button>
                    <button
                        className={`method-tab ${activeMethod === "card" ? "active" : ""}`}
                        onClick={() => setActiveMethod("card")}
                    >
                        <CreditCard />
                        <span>Card</span>
                    </button>
                    <button
                        className={`method-tab ${activeMethod === "netbanking" ? "active" : ""}`}
                        onClick={() => setActiveMethod("netbanking")}
                    >
                        <Landmark />
                        <span>Net Banking</span>
                    </button>
                    <button
                        className={`method-tab ${activeMethod === "wallet" ? "active" : ""}`}
                        onClick={() => setActiveMethod("wallet")}
                    >
                        <Wallet />
                        <span>Wallet</span>
                    </button>
                </div>

                <div className="payment-content">
                    {activeMethod === "upi" ? (
                        <div className="upi-section">
                            <div className="qr-placeholder">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi://pay?pa=heykerala@upi&pn=HeyKerala&am=${amount}&cu=INR`}
                                    alt="UPI QR Code"
                                    className="qr-image"
                                />
                            </div>

                            <div className="input-group">
                                <label className="input-label">Enter UPI ID</label>
                                <div className="upi-input-wrapper">
                                    <input
                                        type="text"
                                        className="upi-input"
                                        placeholder="username@bankid"
                                        value={upiId}
                                        onChange={(e) => setUpiId(e.target.value)}
                                        disabled={isProcessing}
                                    />
                                </div>
                            </div>

                            <button
                                className="pay-button"
                                onClick={handlePayment}
                                disabled={isProcessing}
                            >
                                {isProcessing ? <div className="loader mx-auto"></div> : `Pay ₹${amount.toLocaleString()}`}
                            </button>

                            <div className="demo-note">
                                <ShieldCheck size={14} className="inline mr-1 mb-1" />
                                Secure Payment – Demo Mode
                            </div>
                        </div>
                    ) : (
                        <div className="placeholder-msg">
                            <div className="mb-4 opacity-20">
                                {activeMethod === "card" && <CreditCard size={48} className="mx-auto" />}
                                {activeMethod === "netbanking" && <Landmark size={48} className="mx-auto" />}
                                {activeMethod === "wallet" && <Wallet size={48} className="mx-auto" />}
                            </div>
                            <p>This payment method is disabled in Demo Mode.</p>
                            <p className="text-xs mt-2">Please use UPI for this project demonstration.</p>

                            <button
                                className="mt-8 text-primary font-bold text-sm bg-primary/5 px-4 py-2 rounded-full hover:bg-primary/10"
                                onClick={() => setActiveMethod("upi")}
                            >
                                Switch to UPI
                            </button>
                        </div>
                    )}
                </div>

                <div className="footer-disclaimer">
                    <p className="disclaimer-text">
                        Demo Payment Gateway – No real transaction.<br />
                        For academic project demonstration.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentGateway;
