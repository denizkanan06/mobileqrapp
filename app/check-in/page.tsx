export default function CheckInPage() {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-3xl rounded-xl bg-white p-8 shadow">
  
          <h1 className="text-3xl font-bold">
            QR Check-in
          </h1>
  
          <p className="mt-2 text-gray-600">
            Katılımcının QR kodunu okutun.
          </p>
  
          <div className="mt-8 flex h-80 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
            <p className="text-gray-500">
              📷 Kamera burada açılacak
            </p>
          </div>
  
          <div className="mt-8 rounded-xl bg-green-100 p-4">
            <h2 className="font-semibold">
              Son Okunan Katılımcı
            </h2>
  
            <p className="mt-2">
              Henüz QR okutulmadı.
            </p>
          </div>
  
        </div>
      </main>
    );
  }