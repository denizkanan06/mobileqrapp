const participants = [
    {
      id: 1,
      name: "Ayşe Yılmaz",
      email: "ayse@example.com",
      status: "Check-in yapıldı",
    },
    {
      id: 2,
      name: "Mehmet Demir",
      email: "mehmet@example.com",
      status: "Bekliyor",
    },
    {
      id: 3,
      name: "Zeynep Kaya",
      email: "zeynep@example.com",
      status: "Bekliyor",
    },
  ];
  
  export default function ParticipantsPage() {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-5xl">
          <div>
            <h1 className="text-3xl font-bold">Katılımcılar</h1>
            <p className="mt-2 text-gray-600">
              Etkinliğe kayıtlı katılımcıları görüntüleyebilirsiniz.
            </p>
          </div>
  
          <div className="mt-6">
            <input
              type="text"
              placeholder="Katılımcı ara..."
              className="w-full rounded-lg border border-gray-300 bg-white p-3 outline-none focus:border-blue-500"
            />
          </div>
  
          <div className="mt-6 overflow-hidden rounded-xl bg-white shadow">
            <div className="grid grid-cols-3 gap-4 border-b bg-gray-50 p-4 font-semibold">
              <span>Ad Soyad</span>
              <span>E-posta</span>
              <span>Durum</span>
            </div>
  
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="grid grid-cols-3 gap-4 border-b p-4 last:border-b-0"
              >
                <span>{participant.name}</span>
                <span className="text-gray-600">{participant.email}</span>
                <span
                  className={
                    participant.status === "Check-in yapıldı"
                      ? "font-medium text-green-600"
                      : "text-orange-600"
                  }
                >
                  {participant.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }