export default function UploadPage() {
    return (
      <main className="min-h-screen bg-gray-100 p-6">
        <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow">
          <h1 className="text-3xl font-bold">CSV Yükle</h1>
  
          <p className="mt-2 text-gray-600">
            Katılımcı listesini CSV dosyası olarak yükleyin.
          </p>
  
          <div className="mt-8 rounded-xl border-2 border-dashed border-gray-300 p-10 text-center">
            <p className="text-gray-500">
              CSV dosyanızı seçin.
            </p>
  
            <input
              type="file"
              accept=".csv"
              className="mt-6 block w-full rounded-lg border border-gray-300 bg-white p-3"
            />
          </div>
        </div>
      </main>
    );
  }