"use client";

import { useEventContext } from "@/context/EventContext";

export default function DashboardPage() {
  const { events } = useEventContext();

  const totalEvents = events.length;

  const totalParticipants = events.reduce(
    (total, event) => total + event.participants.length,
    0
  );

  const checkedInParticipants = events.reduce(
    (total, event) =>
      total +
      event.participants.filter(
        (participant) => participant.checkedIn
      ).length,
    0
  );

  const waitingParticipants =
    totalParticipants - checkedInParticipants;

  const checkInRate =
    totalParticipants > 0
      ? Math.round(
          (checkedInParticipants / totalParticipants) * 100
        )
      : 0;

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-black">
        Dashboard
      </h1>

      <p className="mt-2 text-gray-600">
        Etkinlik operasyon sistemine hoş geldiniz.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-gray-500">
            Toplam Etkinlik
          </p>

          <h2 className="mt-2 text-3xl font-bold text-black">
            {totalEvents}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-gray-500">
            Toplam Katılımcı
          </p>

          <h2 className="mt-2 text-3xl font-bold text-black">
            {totalParticipants}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-gray-500">
            Check-in Yapılan
          </p>

          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {checkedInParticipants}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-gray-500">
            Bekleyen
          </p>

          <h2 className="mt-2 text-3xl font-bold text-red-600">
            {waitingParticipants}
          </h2>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <p className="text-gray-500">
            Check-in Oranı
          </p>

          <h2 className="mt-2 text-3xl font-bold text-blue-600">
            %{checkInRate}
          </h2>
        </div>
      </div>
    </main>
  );
}