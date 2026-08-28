"use client";

import { useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { useEventContext } from "@/context/EventContext";

export default function CheckInPage() {
  const { events, checkInParticipant } = useEventContext();

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const isReadingRef = useRef(false);

  const [message, setMessage] = useState(
    "Henüz QR okutulmadı."
  );

  const [cameraError, setCameraError] = useState("");
  const [cameraStarted, setCameraStarted] = useState(false);

  const handleStartCamera = async () => {
    try {
      setCameraError("");

      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError(
          "Bu tarayıcı kamera erişimini desteklemiyor."
        );
        return;
      }

      const scanner = new Html5Qrcode("qr-reader");

      scannerRef.current = scanner;

      await scanner.start(
        {
          facingMode: "environment",
        },
        {
          fps: 10,
          qrbox: {
            width: 250,
            height: 250,
          },
        },
        (decodedText) => {
          if (isReadingRef.current) {
            return;
          }

          isReadingRef.current = true;

          try {
            const [eventIdText, participantIdText] =
              decodedText.split(":");

            const scannedEventId = Number(eventIdText);
            const participantId = Number(participantIdText);

            if (
              Number.isNaN(scannedEventId) ||
              Number.isNaN(participantId)
            ) {
              setMessage("Geçersiz QR kod.");
              return;
            }

            const event = events.find(
              (item) => item.id === scannedEventId
            );

            if (!event) {
              setMessage(
                "QR koduna ait etkinlik bulunamadı."
              );
              return;
            }

            const participant = event.participants.find(
              (person) => person.id === participantId
            );

            if (!participant) {
              setMessage(
                "QR koduna ait katılımcı bulunamadı."
              );
              return;
            }

            if (participant.checkedIn) {
              setMessage(
                `${participant.name} daha önce check-in yaptı.`
              );
              return;
            }

            checkInParticipant(
              scannedEventId,
              participantId
            );

            setMessage(
              `${participant.name} için check-in başarılı!`
            );
          } finally {
            setTimeout(() => {
              isReadingRef.current = false;
            }, 2000);
          }
        },
        () => {
          // QR bulunamadığında hata göstermiyoruz.
        }
      );

      setCameraStarted(true);
    } catch (error) {
      console.error("Kamera hatası:", error);

      setCameraError(
        "Kamera açılamadı. Tarayıcı kamera iznini kontrol edin."
      );
    }
  };

  const handleStopCamera = async () => {
    try {
      if (
        scannerRef.current &&
        scannerRef.current.isScanning
      ) {
        await scannerRef.current.stop();
        scannerRef.current.clear();
      }

      scannerRef.current = null;
      setCameraStarted(false);
    } catch (error) {
      console.error(
        "Kamera kapatılamadı:",
        error
      );
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow">
        <h1 className="text-3xl font-bold">
          QR Check-in
        </h1>

        <p className="mt-2 text-gray-600">
          Katılımcının QR kodunu okutun.
        </p>

        <div className="relative z-50 mt-6 flex gap-3">
          {!cameraStarted ? (
            <button
            type="button"
            onClick={handleStartCamera}
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white"
          >
            📷 Kamerayı Aç
          </button>

          ) : (
            <button
              type="button"
              onClick={handleStopCamera}
              className="relative z-50 cursor-pointer rounded-lg bg-red-600 px-5 py-3 font-semibold text-white pointer-events-auto"
            >
              Kamerayı Kapat
            </button>
          )}
        </div>

        <div className="relative z-0 mt-6 overflow-hidden rounded-xl border border-gray-300 bg-gray-50">
          <div
            id="qr-reader"
            className="relative z-0 w-full"
          />
        </div>

        {cameraError && (
          <div className="mt-4 rounded-lg bg-red-100 p-4 text-red-700">
            {cameraError}
          </div>
        )}

        <div className="mt-8 rounded-xl bg-green-100 p-4">
          <h2 className="font-semibold">
            Son Okunan Katılımcı
          </h2>

          <p className="mt-2">
            {message}
          </p>
        </div>
      </div>
    </main>
  );
}