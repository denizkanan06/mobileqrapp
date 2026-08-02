"use client";

import Link from "next/link";
import type { Event } from "@/types/event";

type Props = {
  event: Event;
  onDelete: (id: number) => void;
};

export default function EventCard({
  event,
  onDelete,
}: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-black">
        {event.title}
      </h2>

      <p className="mt-4 text-gray-600">
        Tarih: {event.date}
      </p>

      <p className="mt-2 text-gray-600">
        Konum: {event.location}
      </p>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/upload"
          className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
        >
          Katılımcıları Yönet
        </Link>

        <Link
          href={`/events/edit/${event.id}`}
          className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Düzenle
        </Link>

        <button
          type="button"
          onClick={() => {
            const confirmed = window.confirm(
              "Bu etkinliği silmek istediğine emin misin?"
            );

            if (confirmed) {
              onDelete(event.id);
            }
          }}
          className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
          Etkinliği Sil
        </button>
      </div>
    </div>
  );
}