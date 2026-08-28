"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Papa from "papaparse";
import { QRCodeSVG } from "qrcode.react";
import QRCode from "qrcode";
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
    addParticipant,
    updateParticipant,
    deleteParticipant,
  } = useEventContext();

  const event = events.find((item) => item.id === eventId);

  const [fileName, setFileName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingEmail, setEditingEmail] = useState("");

  const participants = event?.participants ?? [];

  const handleDownloadQR = async (participant: Participant) => {
    try {
      const qrValue = `${eventId}:${participant.id}`;

      const dataUrl = await QRCode.toDataURL(qrValue, {
        width: 500,
        margin: 2,
      });

      const safeName = participant.name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");

      const link = document.createElement("a");

      link.href = dataUrl;
      link.download = `${safeName}-qr.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("QR kod indirilemedi:", error);
      alert("QR kod indirilirken bir hata oluştu.");
    }
  };

  const handleDownloadTicket = async (participant: Participant) => {
    try {
      if (!event) {
        return;
      }

      const qrValue = `${eventId}:${participant.id}`;

      const qrDataUrl = await QRCode.toDataURL(qrValue, {
        width: 500,
        margin: 2,
      });

      const canvas = document.createElement("canvas");

      canvas.width = 1000;
      canvas.height = 1400;

      const ctx = canvas.getContext("2d");

      if (!ctx) {
        return;
      }

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#111827";
      ctx.textAlign = "center";
      ctx.font = "bold 54px Arial";
      ctx.fillText(event.title, 500, 130);

      ctx.fillStyle = "#2563eb";
      ctx.font = "bold 32px Arial";
      ctx.fillText("ETKİNLİK GİRİŞ BİLETİ", 500, 200);

      ctx.fillStyle = "#111827";
      ctx.font = "bold 44px Arial";
      ctx.fillText(participant.name, 500, 310);

      ctx.fillStyle = "#6b7280";
      ctx.font = "28px Arial";
      ctx.fillText(participant.email, 500, 365);

      const qrImage = new Image();

      qrImage.onload = () => {
        ctx.drawImage(qrImage, 250, 440, 500, 500);

        ctx.fillStyle = "#111827";
        ctx.font = "bold 30px Arial";
        ctx.fillText(event.date, 500, 1040);

        ctx.fillStyle = "#4b5563";
        ctx.font = "28px Arial";
        ctx.fillText(event.location, 500, 1100);

        ctx.fillStyle = "#6b7280";
        ctx.font = "24px Arial";
        ctx.fillText(
          "Giriş sırasında QR kodunuzu okutunuz.",
          500,
          1210
        );

        const safeName = participant.name
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-");

        const link = document.createElement("a");

        link.download = `${safeName}-bilet.png`;
        link.href = canvas.toDataURL("image/png");

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      };

      qrImage.src = qrDataUrl;
    } catch (error) {
      console.error("Bilet oluşturulamadı:", error);
      alert("Bilet oluşturulurken bir hata oluştu.");
    }
  };

  const handleDownloadReport = () => {
    if (!event) {
      return;
    }

    const reportData = participants.map((participant) => ({
      "Ad Soyad": participant.name,
      "E-posta": participant.email,
      "Check-in Durumu": participant.checkedIn
        ? "Giriş yaptı"
        : "Bekleniyor",
    }));

    const csv = Papa.unparse(reportData);

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const safeEventName = event.title
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

    const link = document.createElement("a");

    link.href = url;
    link.download = `${safeEventName}-katilim-raporu.csv`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const handleAddParticipant = () => {
    const name = newName.trim();
    const email = newEmail.trim();

    if (!name || !email) {
      alert("Lütfen ad ve e-posta alanlarını doldurun.");
      return;
    }

    const emailExists = participants.some(
      (participant) =>
        participant.email.toLowerCase() === email.toLowerCase()
    );

    if (emailExists) {
      alert("Bu e-posta adresine sahip bir katılımcı zaten var.");
      return;
    }

    addParticipant(eventId, {
      id: Date.now(),
      name,
      email,
      checkedIn: false,
    });

    setNewName("");
    setNewEmail("");
  };

  const handleStartEdit = (participant: Participant) => {
    setEditingId(participant.id);
    setEditingName(participant.name);
    setEditingEmail(participant.email);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingName("");
    setEditingEmail("");
  };

  const handleSaveEdit = (participant: Participant) => {
    const name = editingName.trim();
    const email = editingEmail.trim();

    if (!name || !email) {
      alert("Ad ve e-posta alanları boş bırakılamaz.");
      return;
    }

    const emailExists = participants.some(
      (person) =>
        person.id !== participant.id &&
        person.email.toLowerCase() === email.toLowerCase()
    );

    if (emailExists) {
      alert(
        "Bu e-posta adresine sahip başka bir katılımcı zaten var."
      );
      return;
    }

    updateParticipant(eventId, {
      ...participant,
      name,
      email,
    });

    handleCancelEdit();
  };

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
        const parsedParticipants: Participant[] = results.data.map(
          (person, index) => ({
            id: Date.now() + index,
            name: person.Name?.trim() ?? "",
            email: person.Email?.trim() ?? "",
            checkedIn: false,
          })
        );

        const validParticipants = parsedParticipants.filter(
          (person) => person.name && person.email
        );

        addParticipantsToEvent(eventId, validParticipants);
      },

      error: (error) => {
        console.error("CSV okuma hatası:", error);
      },
    });
  };

  const filteredParticipants = participants.filter((person) => {
    const search = searchTerm.toLowerCase();

    return (
      person.name.toLowerCase().includes(search) ||
      person.email.toLowerCase().includes(search)
    );
  });

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
        CSV dosyasını bu etkinliğe yükleyebilir veya manuel katılımcı
        ekleyebilirsin.
      </p>

      <div className="mt-6 rounded-xl bg-white p-6 shadow">
        <h2 className="text-xl font-semibold text-black">
          Manuel Katılımcı Ekle
        </h2>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Ad Soyad"
            className="rounded border border-gray-300 bg-white p-3 text-black placeholder:text-gray-500"
          />

          <input
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="E-posta"
            className="rounded border border-gray-300 bg-white p-3 text-black placeholder:text-gray-500"
          />
        </div>

        <button
          type="button"
          onClick={handleAddParticipant}
          className="mt-4 rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
        >
          Katılımcı Ekle
        </button>
      </div>

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
        <p className="mt-4 text-green-600">📄 {fileName}</p>
      )}

      {participants.length > 0 && (
        <div className="mt-8">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-xl font-semibold">
              Katılımcılar ({participants.length})
            </h2>

            <button
              type="button"
              onClick={handleDownloadReport}
              className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700"
            >
              Katılım Raporunu İndir
            </button>
          </div>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
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
                    E-posta
                  </th>

                  <th className="border border-gray-300 p-3 text-left">
                    Durum
                  </th>

                  <th className="border border-gray-300 p-3 text-left">
                    QR Kod
                  </th>

                  <th className="border border-gray-300 p-3 text-left">
                    İşlem
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredParticipants.map((person) => {
                  const isEditing = editingId === person.id;

                  return (
                    <tr key={person.id}>
                      <td className="border border-gray-300 p-3">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) =>
                              setEditingName(e.target.value)
                            }
                            className="w-full rounded border border-gray-300 bg-white p-2 text-black"
                          />
                        ) : (
                          person.name
                        )}
                      </td>

                      <td className="border border-gray-300 p-3">
                        {isEditing ? (
                          <input
                            type="email"
                            value={editingEmail}
                            onChange={(e) =>
                              setEditingEmail(e.target.value)
                            }
                            className="w-full rounded border border-gray-300 bg-white p-2 text-black"
                          />
                        ) : (
                          person.email
                        )}
                      </td>

                      <td className="border border-gray-300 p-3">
                        {person.checkedIn ? (
                          <span className="font-medium text-green-600">
                            Giriş yaptı
                          </span>
                        ) : (
                          <span className="text-gray-600">
                            Bekleniyor
                          </span>
                        )}
                      </td>

                      <td className="border border-gray-300 p-3">
                        <div className="flex flex-col items-start gap-2">
                          <QRCodeSVG
                            value={`${eventId}:${person.id}`}
                            size={80}
                          />

                          <button
                            type="button"
                            onClick={() => handleDownloadQR(person)}
                            className="rounded bg-purple-600 px-3 py-1 text-sm text-white hover:bg-purple-700"
                          >
                            QR İndir
                          </button>
                        </div>
                      </td>

                      <td className="border border-gray-300 p-3">
                        <div className="flex flex-wrap gap-2">
                          {isEditing ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleSaveEdit(person)}
                                className="rounded bg-green-600 px-3 py-1 text-white hover:bg-green-700"
                              >
                                Kaydet
                              </button>

                              <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="rounded bg-gray-500 px-3 py-1 text-white hover:bg-gray-600"
                              >
                                İptal
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleStartEdit(person)}
                                className="rounded bg-blue-600 px-3 py-1 text-white hover:bg-blue-700"
                              >
                                Düzenle
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDownloadTicket(person)}
                                className="rounded bg-purple-600 px-3 py-1 text-white hover:bg-purple-700"
                              >
                                Bilet İndir
                              </button>

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
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}