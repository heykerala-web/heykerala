'use client';

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ShareToolsProps {
  containerId: string;
  itinerary: any;
}

export default function ShareTools({ containerId, itinerary }: ShareToolsProps) {
  const exportPDF = async () => {
    const el = document.getElementById(containerId);
    if (!el) return;

    const canvas = await html2canvas(el, { scale: 2 });
    const img = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    pdf.addImage(img, "PNG", 10, 10, 190, 270);

    pdf.save("itinerary.pdf");
  };

  const shareWhatsApp = () => {
    const message = JSON.stringify(itinerary, null, 2);
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`);
  };

  return (
    <div className="flex gap-2">
      <button onClick={exportPDF} className="px-4 py-2 bg-gray-800 text-white rounded-lg">
        Download PDF
      </button>

      <button onClick={shareWhatsApp} className="px-4 py-2 bg-green-600 text-white rounded-lg">
        WhatsApp
      </button>
    </div>
  );
}
