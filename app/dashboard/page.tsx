export default function DashboardPage() {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
  
        <p className="mt-2 text-gray-600">
          Etkinlik operasyon sistemine hoş geldiniz.
        </p>
  
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">Toplam Etkinlik</p>
            <h2 className="mt-2 text-3xl font-bold">3</h2>
          </div>
  
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">Toplam Katılımcı</p>
            <h2 className="mt-2 text-3xl font-bold">120</h2>
          </div>
  
          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">Check-in Yapılan</p>
            <h2 className="mt-2 text-3xl font-bold">84</h2>
          </div>
        </div>
      </main>
    );
  }