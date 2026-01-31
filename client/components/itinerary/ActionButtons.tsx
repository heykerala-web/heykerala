"use client";

import { useState } from "react";
import { Save, Download, Share2, Loader2 } from "lucide-react";

interface ActionButtonsProps {
  itineraryId: string;
  itineraryData: any;
}

export default function ActionButtons({ itineraryId, itineraryData }: ActionButtonsProps) {
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/itineraries/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itineraryData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Itinerary saved successfully! ✅");
      } else {
        alert("Failed to save itinerary: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Error saving itinerary:", error);
      alert("Failed to save itinerary");
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      // First save the itinerary if not already saved
      const saveResponse = await fetch("/api/itineraries/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itineraryData),
      });

      const saveData = await saveResponse.json();
      let idToUse = itineraryId;

      if (saveResponse.ok && saveData.id) {
        idToUse = saveData.id;
      }

      // Download PDF
      const pdfResponse = await fetch(`/api/itineraries/${idToUse}/pdf`);
      
      if (pdfResponse.ok) {
        const blob = await pdfResponse.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `itinerary-${idToUse}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert("Failed to generate PDF");
      }
    } catch (error) {
      console.error("Error downloading PDF:", error);
      alert("Failed to download PDF");
    } finally {
      setDownloading(false);
    }
  };

  const handleShareWhatsApp = () => {
    const message = `Here is my Kerala Trip Plan 🌴\n\n${itineraryData.title}\n\nDuration: ${itineraryData.duration} days\nTravelers: ${itineraryData.travelers}\nBudget: ₹${itineraryData.budgetEstimate.min.toLocaleString()} - ₹${itineraryData.budgetEstimate.max.toLocaleString()}\n\nView full itinerary: ${window.location.href}`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="flex flex-wrap gap-4">
      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {saving ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Save className="w-5 h-5" />
        )}
        {saving ? "Saving..." : "Save Itinerary"}
      </button>

      <button
        onClick={handleDownloadPDF}
        disabled={downloading}
        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {downloading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Download className="w-5 h-5" />
        )}
        {downloading ? "Generating..." : "Download PDF"}
      </button>

      <button
        onClick={handleShareWhatsApp}
        className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors"
      >
        <Share2 className="w-5 h-5" />
        Share on WhatsApp
      </button>
    </div>
  );
}

