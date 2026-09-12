"use client";

import Link from "next/link";
import { useEventContext } from "@/context/EventContext";
import EventCard from "@/components/EventCard";

export default function EventsPage() {
  const { events, deleteEvent } = useEventContext();

  return (
    <main className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Etkinlikler</h1>

          <p className="mt-2 text-gray-600">
            Oluşturduğun etkinlikleri buradan yönetebilirsin.
          </p>
        </div>

        <Link
          href="/events/create"
          className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Yeni Etkinlik
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="rounded-lg border border-dashed border-gray-300 p-10 text-center">
          <h2 className="text-xl font-semibold">
            Henüz etkinlik oluşturulmadı
          </h2>

          <p className="mt-2 text-gray-600">
            İlk etkinliğini oluşturmak için butona tıkla.
          </p>

          <Link
            href="/events/create"
            className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-3 text-white hover:bg-blue-700"
          >
            Etkinlik Oluştur
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
          <EventCard
          key={event.id}
          event={event}
          onDelete={deleteEvent}
        /> 
          ))}
        </div>
      )}
    </main>
  );
}