"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { useEventContext } from "@/context/EventContext";

type ScannerInstance = {
  clear: () => Promise<void>;
};

export default function CheckInPage() {
  const params = useParams();
  const eventId = Number(params.id);

  const { events, checkInParticipant } = useEventContext();

  const [result, setResult] = useState("");
  const [message, setMessage] = useState("");

  const scannerRef = useRef<ScannerInstance | null>(null);
  const lastScannedRef = useRef("");

  const event = events.find(
    (item) => item.id === eventId
  );

  useEffect(() => {
    let cancelled = false;

    const startScanner = async () => {
      const readerElement =
        document.getElementById("qr-reader");

      if (!readerElement) {
        console.error(
          "qr-reader elementi bulunamadı."
        );
        return;
      }

      if (scannerRef.current) {
        return;
      }

      // html5-qrcode sadece tarayıcı tarafında yükleniyor.
      const { Html5QrcodeScanner } =
        await import("html5-qrcode");

      if (cancelled) {
        return;
      }

      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250,
          },
        },
        false
      );

      scannerRef.current = scanner;

      scanner.render(
        (decodedText) => {
          if (
            lastScannedRef.current === decodedText
          ) {
            return;
          }

          lastScannedRef.current = decodedText;
          setResult(decodedText);

          const parts = decodedText.split(":");

          if (parts.length !== 2) {
            setMessage("Geçersiz QR kod.");
            return;
          }

          const qrEventId = Number(parts[0]);
          const participantId = Number(parts[1]);

          if (
            !Number.isFinite(qrEventId) ||
            !Number.isFinite(participantId)
          ) {
            setMessage("Geçersiz QR kod.");
            return;
          }

          if (qrEventId !== eventId) {
            setMessage(
              "Bu QR kod başka bir etkinliğe ait."
            );
            return;
          }

          const participant =
            event?.participants.find(
              (person) =>
                person.id === participantId
            );

          if (!participant) {
            setMessage(
              "Katılımcı bulunamadı."
            );
            return;
          }

          if (participant.checkedIn) {
            setMessage(
              `${participant.name} daha önce giriş yapmış.`
            );
            return;
          }

          checkInParticipant(
            eventId,
            participantId
          );

          setMessage(
            `${participant.name} için check-in başarılı!`
          );
        },
        () => {
          // QR bulunamayan kareleri görmezden geliyoruz.
        }
      );
    };

    const timer = window.setTimeout(() => {
      startScanner().catch((error) => {
        console.error(
          "QR scanner başlatılamadı:",
          error
        );

        setMessage(
          "QR okuyucu başlatılamadı."
        );
      });
    }, 100);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);

      const scanner = scannerRef.current;
      scannerRef.current = null;

      if (scanner) {
        scanner.clear().catch((error) => {
          console.error(
            "QR scanner kapatılırken hata oluştu:",
            error
          );
        });
      }
    };
  }, [
    eventId,
    event,
    checkInParticipant,
  ]);

  if (!event) {
    return (
      <main className="p-8">
        <p>Etkinlik bulunamadı.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-bold">
        QR Check-in
      </h1>

      <p className="mt-2 text-gray-600">
        Etkinlik: {event.title}
      </p>

      <div
        id="qr-reader"
        className="mt-8"
      />

      {result && (
        <p className="mt-4 text-sm text-gray-500">
          Okunan QR: {result}
        </p>
      )}

      {message && (
        <div className="mt-6 rounded-lg bg-green-100 p-4 text-green-800">
          {message}
        </div>
      )}
    </main>
  );
}