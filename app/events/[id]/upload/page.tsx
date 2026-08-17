"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Papa from "papaparse";
import { QRCodeSVG } from "qrcode.react";
import { useEventContext } from "@/context/EventContext";
import type { Participant } from "@/types/participant";

type CsvParticipant = {
  Name: string;
  Email: string;
};

export default function EventUploadPage() {
  const params = useParams();
  const eventId = Number(params.id);

  const {
    events,
    addParticipantsToEvent,
    deleteParticipant,
  } = useEventContext();

  const event = events.find((item) => item.id === eventId);

  const [fileName, setFileName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const participants = event?.participants ?? [];

  const handleFile = (
    uploadEvent: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = uploadEvent.target.files?.[0];

    if (!file || !event) {
      return;
    }

    setFileName(file.name);

    Papa.parse<CsvParticipant>(file, {
      header: true,
      skipEmptyLines: true,

      complete: (results) => {
        const parsedParticipants: Participant[] =
          results.data.map((person, index) => ({
            id: Date.now() + index,
            name: person.Name?.trim() ?? "",
            email: person.Email?.trim() ?? "",
            checkedIn: false,
          }));

        const validParticipants = parsedParticipants.filter(
          (person) => person.name && person.email
        );

        addParticipantsToEvent(
          eventId,
          validParticipants
        );
      },

      error: (error) => {
        console.error("CSV okuma hatası:", error);
      },
    });
  };

  const filteredParticipants = participants.filter(
    (person) => {
      const search = searchTerm.toLowerCase();

      return (
        person.name.toLowerCase().includes(search) ||
        person.email.toLowerCase().includes(search)
      );
    }
  );

  if (!event) {
    return (
      <main className="p-8">
        <p>Etkinlik bulunamadı.</p>
      </main>
    );
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">
        {event.title} Katılımcıları
      </h1>

      <p className="mt-2 text-gray-600">
        CSV dosyasını bu etkinliğe yükleyebilirsin.
      </p>

      <input
        id="csv-file"
        type="file"
        accept=".csv"
        onChange={handleFile}
        className="hidden"
      />

      <label
        htmlFor="csv-file"
        className="mt-6 inline-block cursor-pointer rounded-lg bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
      >
        CSV Dosyası Seç
      </label>

      {fileName && (
        <p className="mt-4 text-green-600">
          📄 {fileName}
        </p>
      )}

      {participants.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-4 text-xl font-semibold">
            Katılımcılar ({participants.length})
          </h2>

          <input
            type="text"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Katılımcı ara..."
            className="mb-4 w-full rounded border border-gray-300 bg-white p-3 text-black placeholder:text-gray-500"
          />

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-200 text-black">
                <tr>
                  <th className="border border-gray-300 p-3 text-left">
                    Ad
                  </th>
                  <th className="border border-gray-300 p-3 text-left">
                    QR Kod
                  </th>

                  <th className="border border-gray-300 p-3 text-left">
                    E-posta
                  </th>

                  <th className="border border-gray-300 p-3 text-left">
                    Durum
                  </th>

                  <th className="border border-gray-300 p-3 text-left">
                    İşlem
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredParticipants.map((person) => (
                  <tr key={person.id}>
                    <td className="border border-gray-300 p-3">
                      {person.name}
                    </td>

                    <td className="border border-gray-300 p-3">
                      {person.email}
                    </td>

                    <td className="border border-gray-300 p-3">
                      {person.checkedIn
                        ? "Giriş yaptı"
                        : "Bekleniyor"}
                    </td>

                    <td className="border border-gray-300 p-3">
                      <QRCodeSVG
                      value={`${eventId}:${person.id}`}
                      size={80}
                      />
                    </td>

                    <td className="border border-gray-300 p-3">
                      <button
                        type="button"
                        onClick={() => {
                          const confirmed = window.confirm(
                            `${person.name} adlı katılımcıyı silmek istiyor musun?`
                          );

                          if (confirmed) {
                            deleteParticipant(
                              eventId,
                              person.id
                            );
                          }
                        }}
                        className="rounded bg-red-600 px-3 py-1 text-white hover:bg-red-700"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}