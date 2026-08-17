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

        <section className="mt-10">
  <h2 className="text-2xl font-bold text-black">
    Etkinlik Bazlı Özet
  </h2>

  {events.length === 0 ? (
    <p className="mt-4 text-gray-600">
      Henüz etkinlik bulunmuyor.
    </p>
  ) : (
    <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => {
        const total = event.participants.length;

        const checkedIn = event.participants.filter(
          (participant) => participant.checkedIn
        ).length;

        const waiting = total - checkedIn;

        const rate =
          total > 0
            ? Math.round((checkedIn / total) * 100)
            : 0;

        return (
          <div
            key={event.id}
            className="rounded-xl bg-white p-6 shadow"
          >
            <h3 className="text-xl font-bold text-black">
              {event.title}
            </h3>

            <p className="mt-4 text-gray-600">
              Toplam Katılımcı: {total}
            </p>

            <p className="mt-2 text-green-600">
              Check-in: {checkedIn}
            </p>

            <p className="mt-2 text-red-600">
              Bekleyen: {waiting}
            </p>

            <p className="mt-2 font-semibold text-blue-600">
              Check-in Oranı: %{rate}
            </p>
          </div>
        );
      })}
    </div>
  )}
</section>

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