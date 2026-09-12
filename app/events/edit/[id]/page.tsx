"use client";

import { useParams, useRouter } from "next/navigation";
import { useEventContext } from "@/context/EventContext";
import { useEffect, useState } from "react";

export default function EditEventPage() {
  const { id } = useParams();
  const router = useRouter();

  const { events, updateEvent } = useEventContext();

  const event = events.find((e) => e.id === Number(id));

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDate(event.date);
      setLocation(event.location);
    }
  }, [event]);

  if (!event) {
    return <p className="p-8">Etkinlik bulunamadı.</p>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateEvent({
        ...event,
        title,
        date,
        location,
      });

    router.push("/events");
  };

  return (
    <div className="mx-auto mt-10 max-w-xl rounded-lg bg-white p-8 shadow">
      <h1 className="mb-6 text-2xl font-bold">
        Etkinliği Düzenle
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Etkinlik Adı"
          className="w-full rounded border p-3"
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded border p-3"
        />

        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Konum"
          className="w-full rounded border p-3"
        />

        <button
          type="submit"
          className="rounded bg-blue-600 px-5 py-3 text-white"
        >
          Kaydet
        </button>

      </form>
    </div>
  );
}