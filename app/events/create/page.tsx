"use client";

import { useState } from "react";

export default function CreateEventPage() {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = () => {
    console.log({
      title,
      date,
      location,
    });

    alert("Etkinlik oluşturuldu!");
  };

  return (
    <main className="mx-auto max-w-xl p-8">
      <h1 className="mb-8 text-3xl font-bold">
        Yeni Etkinlik
      </h1>

      <div className="space-y-5">
        <div>
          <label className="mb-2 block font-medium">
            Etkinlik Adı
          </label>

          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border p-3 text-black"
            placeholder="Örn. Teknoloji Zirvesi"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Tarih
          </label>

          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded border p-3 text-black"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Konum
          </label>

          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded border p-3 text-black"
            placeholder="İstanbul Kongre Merkezi"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Etkinliği Oluştur
        </button>
      </div>
    </main>
  );
}