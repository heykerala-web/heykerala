"use client";

import { useState } from 'react';
import { ChevronDown, ChevronUp, LifeBuoy, Mail, MessageCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function HelpPage() {
    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Hero Section */}
            <div className="bg-[#050505] text-white py-20 px-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-6">
                        <LifeBuoy className="h-4 w-4" /> Support Center
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
                        How can we <span className="text-emerald-500">help</span> you?
                    </h1>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                        Find answers to common questions, manage your bookings, and get in touch with our support team.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-4 -mt-10 relative z-20">
                {/* Contact Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <ContactCard
                        icon={<MessageCircle className="h-6 w-6 text-emerald-600" />}
                        title="Chat Support"
                        desc="Available 24/7"
                        action="Start Chat"
                    />
                    <ContactCard
                        icon={<Mail className="h-6 w-6 text-blue-600" />}
                        title="Email Us"
                        desc="Response within 24h"
                        action="Send Email"
                    />
                    <ContactCard
                        icon={<Phone className="h-6 w-6 text-purple-600" />}
                        title="Call Us"
                        desc="Mon-Fri, 9am-6pm"
                        action="Call Now"
                    />
                </div>

                {/* FAQ Section */}
                <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-xl shadow-slate-200/50">
                    <h2 className="text-3xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h2>
                    <div className="space-y-4">
                        <FAQItem
                            question="How do I book a trip to Kerala?"
                            answer="You can browse through our curated list of Places, Stays, and Events. Once you find something you like, you can contact the host directly or use our booking inquiry form."
                        />
                        <FAQItem
                            question="Is HeyKerala free to use?"
                            answer="Yes! Browsing places, creating itineraries, and reading reviews is completely free for tourists. Some premium planning features may involve a fee in the future."
                        />
                        <FAQItem
                            question="How can I list my property?"
                            answer="If you are a business owner, you can sign up as a 'Contributor' completely free. Go to your profile settings to request a role upgrade."
                        />
                        <FAQItem
                            question="Are the reviews verified?"
                            answer="We do our best to ensure authenticity. Reviews are posted by registered users. We also use AI moderation to flag suspicious activity."
                        />
                        <FAQItem
                            question="Can I customize my itinerary?"
                            answer="Absolutely! Use our AI Trip Planner to generating a custom itinerary based on your budget, interests, and duration."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function ContactCard({ icon, title, desc, action }: any) {
    return (
        <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 flex flex-col items-center text-center hover:translate-y-[-5px] transition-transform duration-300">
            <div className="h-14 w-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
                {icon}
            </div>
            <h3 className="font-bold text-slate-900 text-lg mb-1">{title}</h3>
            <p className="text-slate-500 text-sm mb-6">{desc}</p>
            <Button variant="outline" className="w-full rounded-xl font-bold border-slate-200 hover:bg-slate-50 hover:text-emerald-600">
                {action}
            </Button>
        </div>
    );
}

function FAQItem({ question, answer }: any) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-slate-100 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-md bg-slate-50/50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left"
            >
                <span className="font-bold text-slate-800 text-lg">{question}</span>
                {isOpen ? <ChevronUp className="h-5 w-5 text-emerald-500" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
            </button>
            <div
                className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-48' : 'max-h-0'}`}
            >
                <p className="px-6 pb-6 text-slate-500 leading-relaxed">
                    {answer}
                </p>
            </div>
        </div>
    );
}
