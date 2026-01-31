'use client';
import { useState } from 'react';

interface BookingForm {
  name: string;
  phone: string;
  email: string;
  date: string;
}

interface Package {
  _id: string;
  title: string;
}

interface BookingModalProps {
  pkg: Package;
  onClose: () => void;
}

export default function BookingModal({ pkg, onClose }: BookingModalProps) {
  const [form, setForm] = useState<BookingForm>({
    name: "",
    phone: "",
    email: "",
    date: ""
  });

  const submit = async (): Promise<void> => {
    if (!form.name || !form.phone || !form.date) {
      alert("Fill required fields!");
      return;
    }

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, packageId: pkg._id })
    });

    if (res.ok) {
      alert("Booking confirmed!");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-2xl">
        <h3 className="text-xl font-bold mb-3">
          Booking: {pkg.title}
        </h3>

        <input placeholder="Name" className="w-full border mb-2 p-2 rounded" onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Phone" className="w-full border mb-2 p-2 rounded" onChange={e => setForm({ ...form, phone: e.target.value })} />
        <input placeholder="Email" className="w-full border mb-2 p-2 rounded" onChange={e => setForm({ ...form, email: e.target.value })} />
        <input type="date" className="w-full border mb-4 p-2 rounded" onChange={e => setForm({ ...form, date: e.target.value })} />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={submit} className="px-4 py-2 bg-emerald-600 text-white rounded">Book</button>
        </div>
      </div>
    </div>
  );
}
